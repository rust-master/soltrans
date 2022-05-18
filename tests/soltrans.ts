import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Soltrans } from "../target/types/soltrans";
const { SystemProgram } = anchor.web3;

const {
  Connection,
  PublicKey,
  clusterApiUrl,
  Keypair,
  LAMPORTS_PER_SOL
} = require("@solana/web3.js");

describe("soltrans", () => {
  // Configure the client to use the local cluster.
  let provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Soltrans as Program<Soltrans>;

  it("Transfer", async () => {
    let transferKey = anchor.web3.Keypair.generate();
    let toKey = anchor.web3.Keypair.generate();

    // console.log("transferKey", transferKey);
    // console.log("toKey", toKey);

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')
    const walletBalance = await connection.getBalance(toKey.publicKey);
    console.log(`Wallet balance is ${walletBalance}`);

    let tx = await program.rpc.transferFrom(new anchor.BN(1000), {
      accounts: {
        transfer: transferKey.publicKey,
        from: provider.wallet.publicKey,
        to: toKey.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [transferKey]
    });


    const walletBalanceTo = await connection.getBalance(toKey.publicKey);
    console.log(`Wallet balance after is ${walletBalanceTo}`);

    // check balanace using public key
    // let balance = await program.rpc.getBalance(toKey.publicKey);
    // console.log("balance", balance);

    // console.log("Your transaction signature", tx);

    // const transferAccount = await program.account.data.fetch(transferKey.publicKey);
    // console.log("Your transfer account", transferAccount);


  });
});
