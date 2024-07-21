"use client"
import { useEffect, useState } from "react";
import { DealerHandData, BlackjackGameData, PlayerHandData } from "./types";
import ChipsControls from "./ChipControls";
import ActionBar from "./ActionBar";
import { ToastContainer, toast } from "react-toastify";

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


  //TODO move to some types or constant file
  export enum GameState {
    NotStarted = 'notStarted',
    Started = 'started',
    Finished = 'finished'
  }

  export enum PlayerActions {
    HIT = 'hit',
    STAND = 'stand',
    SPLIT = 'split',
    DOUBLE = 'double'
  }




const BlackJackTable: React.FC<BlackjackTableProps> = ({
  
    // gameData,
    // originalBetSize,
    // dealerHandData,
    // playerHandsData,
    // syncGame,
    // triggerEndGame,
  }) => {
    const [betSize, setBetSize] = useState(0);
    const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
    
    const startGame = () => {
      toast.success("Game of blackjack started!", {
        position: "bottom-left",
      });
      setGameState(GameState.Started);
    };

    const handlePlayerAction = (action: PlayerActions) => {
      switch (action) {
        case PlayerActions.DOUBLE:
          toast.success("Successful Double!", {
            position: "bottom-left",
          });
          finishGame();
          break;
        case PlayerActions.HIT:
          toast.success("Successful Hit!", {
            position: "bottom-left",
          });
          finishGame();
          break;
        case PlayerActions.SPLIT:
          toast.success("Successful Split!", {
            position: "bottom-left",
          });
          finishGame();
          break;
        case PlayerActions.STAND:
          toast.success("Successful Stand!", {
            position: "bottom-left",
          });
          finishGame();
          break;
      }
    };
  

      const handleClear = () => {
        setBetSize(0);
      };

      const finishGame = () => {
        toast.success("Game of blackjack finished!", {
          position: "bottom-left",
        });
        setBetSize(0);
        setGameState(GameState.Finished);
      };

      const handleChipClick = (amount: number) => {
        setBetSize(prevBetSize => prevBetSize + amount);
      };

      const playAgain = () => {
        setGameState(GameState.NotStarted);
      };
    return (
        <div className="flex justify-center items-center py-10">
        <div className="py-4 w-[96vw] h-[72vh] bg-tableBg border-[12px] border-tableBorder rounded-[36px] flex flex-col justify-center items-center">
        <div className="flex flex-row justify-between items-center w-full">
          <div>
            
          {gameState ===  GameState.NotStarted ?  (
        <ChipsControls           gameState={gameState}
        startGame={startGame}
        betSize={betSize}
        handleClear={handleClear}
        handleChipClick={handleChipClick} />
      ): (
        <ActionBar  handlePlayerAction={handlePlayerAction} playAgain={playAgain}     betSize={betSize} gameState={gameState} />
      ) }
          </div>
          <div className="flex flex-col items-center py-40">
          <Image src="/styx-table-deco.png" alt="Poker Table Image" className="h-40 w-40 object-contain text-center" width={40} height={40} />
          <p className="text-center text-gray-700 text-[12px] mt-1">Blackjack pays 3 to 2 - ♠ ♣ ♥ ♦ - Dealer hits on soft 17</p>
          </div>
          <div></div>
          </div>
        </div>
      </div>
    )
  }

export default BlackJackTable;
