import { Aptos, AptosConfig } from "@aptos-labs/ts-sdk";
import { AptosClient, Network } from 'aptos';


// const aptos = new Aptos(new AptosConfig({ network: NETWORK }));
const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));

// Reuse same Aptos instance to utilize cookie based sticky routing
export function aptosClient() {
  return aptos;
}