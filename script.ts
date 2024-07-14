import { Account, Aptos, AptosConfig, Network, Ed25519Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import {
    AptosFaucetClient,
    FundRequest,
  } from "@aptos-labs/aptos-faucet-client";
 
const APTOS_COIN = "0x1::aptos_coin::AptosCoin";
const COIN_STORE = `0x1::coin::CoinStore<${APTOS_COIN}>`;
const ALICE_INITIAL_BALANCE = 100_000_000;
const BOB_INITIAL_BALANCE = 100;
const TRANSFER_AMOUNT = 100;

async function main()  {
    console.log(
        "This example will create two accounts (Alice and Bob), fund them, and transfer between them.",
      );

//       profiles:
//   default:
//     private_key: "0x2befab5699416f2216806172792baaa53f9b251bee421911ce7039c6f0e38bed"
//     public_key: "0x3d10e7e9ff015c73ed1be65a98aa941433083235790b0ca58dc83775ab862580"
//     account: f33713e34849cfe2368be4138b368f451a7fef8124c90d11a7d1a24ec3c09ae3
//     rest_url: "https://fullnode.testnet.aptoslabs.com"
//     faucet_url: "https://faucet.testnet.aptoslabs.com"

     
      // Setup the client
      const config = new AptosConfig({ network: Network.TESTNET });
      const aptos = new Aptos(config);
      const privateKey = new Ed25519PrivateKey("0x2befab5699416f2216806172792baaa53f9b251bee421911ce7039c6f0e38bed");
      const alice = Account.fromPrivateKey({ privateKey  });
    //   console.log(`Alice's address is: ${alice.accountAddress}`);

    //   const request: FundRequest = {
    //     amount: 100,
    //     address: alice.accountAddress.toString()
    //   };
    //   console.log(alice.accountAddress.toString())
    //   const faucetClient = new AptosFaucetClient({
    //     BASE: "https://faucet.testnet.aptoslabs.com",
    //   });
    //   const response = await faucetClient.fund.fund({ requestBody: request });
    //   console.log(response)

    const txn = await aptos.transaction.build.simple({
        sender: alice.accountAddress.toString(),
        data: {
          // All transactions on Aptos are implemented via smart contracts.
          function: "0xf153190d4f9aae433a4a0ce666f8b065fe911b3aee9becce918ed9f46c7e56f6::blackjack::start_game",
          functionArguments: [100],
        },
      });
      console.log(txn)

      const senderAuthenticator = aptos.transaction.sign({ signer: alice, transaction: txn });
    const committedTransaction = await aptos.transaction.submit.simple({ transaction: txn, senderAuthenticator });

// using signAndSubmit combined
// const committedTransaction = await aptos.signAndSubmitTransaction({ signer: alice, transaction: txn });

}

// if (require.main == module) {
//     main()
// }
main()