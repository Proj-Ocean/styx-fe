import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { ABI } from "./abi";
import { createSurfClient, createViewPayload } from '@thalalabs/surf';

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

