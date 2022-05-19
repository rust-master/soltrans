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
    let userKey = anchor.web3.Keypair.generate();
    let transferKey = anchor.web3.Keypair.generate();
    let toKey = anchor.web3.Keypair.generate();

    console.log("transferKey", transferKey.publicKey.toString());
    console.log("toKey", toKey.publicKey.toString());

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

    const fromAirDropSignature = await connection.requestAirdrop(transferKey.publicKey, 2 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(fromAirDropSignature);

    const walletBalance = await connection.getBalance(transferKey.publicKey);
    console.log(`Wallet balance is ${walletBalance}`);

    let tx = await program.rpc.transferNativeSol({
      accounts: {
        from: transferKey.publicKey,
        to: toKey.publicKey,
        user: userKey.publicKey,
        systemProgram: SystemProgram.programId
      },
      signers: [userKey]
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
