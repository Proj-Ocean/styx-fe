
import { Aptos, AptosConfig, Network, Account} from "@aptos-labs/ts-sdk";
import { ABI } from "./abi";
import { createSurfClient, createViewPayload, createEntryPayload} from '@thalalabs/surf';
import { useSubmitTransaction } from "@thalalabs/surf/hooks";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

enum GameEmitEvents {
    NEW_GAME = "NewGame",
    MOVE_COMPLETED = "MoveCompleted",
    GAME_OUTCOME = "GameOutcome",
  }

enum ErrorEvents {
  GAME_INIT_ERROR = "Error occurred during Blackjack game initialization.",
  INSUFFICIENT_BALANCE = "Not enough coins in the wallet.",
  PLAYER_MOVE_ERROR = "Error occurred processing the player move.",
}

export const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
export const surfClient = createSurfClient(aptos).useABI(ABI);

export const handleGameStart = async (betSize: number) => {

}