import { AccountAddressInput } from "@aptos-labs/ts-sdk";
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { APT_DECIMALS, dateToSeconds, convertAmountFromHumanReadableToOnChain } from "@/utils/helpers"


export type CreateBlackJackGameArguments = {
    player: any,
    bet_amount: any,
  };
  
  export const createBlackJackGame = (args: CreateBlackJackGameArguments): InputTransactionData => {
    const {
      player, 
      bet_amount,
    } = args;
    return {
      data: {
        function: `0xf153190d4f9aae433a4a0ce666f8b065fe911b3aee9becce918ed9f46c7e56f6::blackjack::start_game`,
        typeArguments: [],
        functionArguments: [
          player,
          bet_amount,
        ],
      },
    };
  };