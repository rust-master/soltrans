use anchor_lang::prelude::*;

declare_id!("FGLHHdApR2TXq9fXCdWE9SSeVzs4btmN77j7MjkS36dH");

#[program]
pub mod soltrans {
    use super::*;

    pub fn transfer_native_sol(ctx: Context<SolSend>) -> Result<()> {
        let lamports: u64 = 1000000;

        let sol_transfer = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.from.key,
            &ctx.accounts.to.key,
            lamports,
        );
        anchor_lang::solana_program::program::invoke(
            &sol_transfer,
            &[
                ctx.accounts.from.clone(),
                ctx.accounts.to.clone(),
                ctx.accounts.system_program.clone(),
            ],
        )?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SolSend<'info> {
    #[account(mut, signer)]
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub from: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    #[account(mut)]
    pub to: AccountInfo<'info>,
    /// CHECK: This is not dangerous because we don't read or write from this account
    pub system_program: AccountInfo<'info>,
}
