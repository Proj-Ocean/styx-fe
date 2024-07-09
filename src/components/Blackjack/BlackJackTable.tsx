import { useEffect, useState } from "react";
import { DealerHandData, BlackjackGameData, PlayerHandData } from "./types";
import { PlayerHandResults, calculateTotalWin } from "./utils";
import Image from "next/image";

type BlackjackTableProps = {
    // gameData: BlackjackGameData;
    // originalBetSize: number;
    // dealerHandData: DealerHandData;
    // playerHandsData: Array<PlayerHandData>;
    // syncGame: Function;
    // triggerEndGame: Function;
  };


const BlackJackTable: React.FC<BlackjackTableProps> = ({
    // gameData,
    // originalBetSize,
    // dealerHandData,
    // playerHandsData,
    // syncGame,
    // triggerEndGame,
  }) => {
    return (
        <div className="flex justify-center items-center h-screen">
        <div className="py-4 w-[1100px] h-[420px] bg-tableBg border-[20px] border-tableBorder rounded-full flex justify-center items-center">
          <div className="text-center text-gray-700 text-xl font-semibold">
          <Image src="/styx-table-deco.png" alt="Poker Table Image" className="h-40 w-40 object-contain" width={40} height={40} />
          </div>
        </div>
      </div>
    )
  }

export default BlackJackTable;
