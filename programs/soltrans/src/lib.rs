use anchor_lang::prelude::*;

declare_id!("AZpNhwAtYUbsMnDGPFkTXnnkG2cDkUoSVqyYvyAfDbtL");

#[program]
pub mod soltrans {
    use super::*;

    pub fn transfer_from(ctx: Context<Transfer>, lamports: u64) -> Result<()> {
        let transfer = &mut ctx.accounts.transfer;

        transfer.from = *ctx.accounts.from.key;
        transfer.to = *ctx.accounts.to.key;

        // msg!(
        //     "transfering to [{}] from [{}]",
        //     &transfer.from.key(),
        //     &transfer.to.key()
        // );

        let transfer_instruction = anchor_lang::solana_program::system_instruction::transfer(
            &transfer.from.key(),
            &transfer.to.key(),
            lamports,
        );

        anchor_lang::solana_program::program::invoke(
            &transfer_instruction,
            &[
                ctx.accounts.from.to_account_info(),
                ctx.accounts.to.to_account_info(),
            ],
        );

        msg!("transfer instruction: {:?}", transfer_instruction);

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Transfer<'info> {
    #[account(init, payer = from, space = 8 + 32 * 2 + 32 )]
    transfer: Account<'info, Data>,
    #[account(mut)]
    from: Signer<'info>,
    /// CHECK:
    to: AccountInfo<'info>,
    system_program: Program<'info, System>,
}

#[account]
pub struct Data {
    pub from: Pubkey,
    pub to: Pubkey,
}
