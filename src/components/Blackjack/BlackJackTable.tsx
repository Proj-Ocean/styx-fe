"use client"
import { useEffect, useState } from "react";
import { DealerHandData, BlackjackGameData, PlayerHandData } from "./types";
import ChipsControls from "./ChipControls";
// import { PlayerHandResults, calculateTotalWin } from "./utils";
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
    const [betSize, setBetSize] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const startGame = () => {
        setGameStarted(true);
      };

      const handleClear = () => {
        setBetSize(0);
      };

      const resetGame = () => {
        setGameStarted(false);
      };

      const handleChipClick = (amount: number) => {
        setBetSize(prevBetSize => prevBetSize + amount);
      };

      const playAgain = () => {
        setBetSize(0);
        setGameStarted(false);
      };
    return (
        <div className="flex justify-center items-center py-10">
        <div className="py-4 w-[96vw] h-[72vh] bg-tableBg border-[12px] border-tableBorder rounded-[36px] flex flex-col justify-center items-center">
          <div className="flex flex-col items-center py-40">
          <Image src="/styx-table-deco.png" alt="Poker Table Image" className="h-40 w-40 object-contain text-center" width={40} height={40} />
          <p className="text-center text-gray-700 text-[12px] mt-1">Blackjack pays 3 to 2 - ♠ ♣ ♥ ♦ - Dealer hits on soft 17</p>
          </div>
          <ChipsControls           gameStarted={gameStarted}
        startGame={startGame}
        betSize={betSize}
        handleClear={handleClear}
        handleChipClick={handleChipClick} />
        </div>
      </div>
    )
  }

export default BlackJackTable;
