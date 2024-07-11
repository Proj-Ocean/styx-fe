"use client"
import { useEffect, useState, Fragment } from "react";
import { DealerHandData, BlackjackGameData, PlayerHandData } from "./types";
import ChipsControls from "./ChipControls";
import ActionBar from "./ActionBar";
// import { PlayerHandResults, calculateTotalWin } from "./utils";
import { card, CardProps as cardInterface } from './types'
import Image from "next/image";
import GameBoard from "./GameBoard";
// type BlackjackTableProps = {
    // gameData: BlackjackGameData;
    // originalBetSize: number;
    // dealerHandData: DealerHandData;
    // playerHandsData: Array<PlayerHandData>;
    // syncGame: Function;
    // triggerEndGame: Function;
  // };

  interface BlackjackTableProps {
    dealerCards: cardInterface[],
    playerCards: cardInterface[],
    dealerScore: number|string|null,
    playerScore: number|string|null,
}

  //TODO move to some types or constant file
  export enum GameState {
    NotStarted = 'notStarted',
    Started = 'started',
    Finished = 'finished'
  }

const BlackJackTable: React.FC<BlackjackTableProps> = ({ }) => {
    const [betSize, setBetSize] = useState(0);
    const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);

    const [playerCards, setPlayerCards]: any[] = useState([]);
    const [playerScore, setPlayerScore] = useState(0);
    const [userCount, setUserCount] = useState(0);
  
    const [dealerCards, setDealerCards]: any[] = useState([]);
    const [dealerScore, setDealerScore] = useState(0);
    const [dealerCount, setDealerCount] = useState(0);
    
    const startGame = () => {
      setGameState(GameState.Started);
    };

      const handleClear = () => {
        setBetSize(0);
      };

      const finishGame = () => {
        setBetSize(0);
        setGameState(GameState.Finished);
      };

      const handleChipClick = (amount: number) => {
        setBetSize(prevBetSize => prevBetSize + amount);
      };

      const playAgain = () => {
        setGameState(GameState.NotStarted);
      };

      useEffect(() => {
        if (gameState === GameState.Started) {
          setPlayerCards([{ image: '/cards/2-H.png', value: 2, suit: 'hearts' }, { image: '/cards/3-H.png', value: 3, suit: 'hearts' }]);
          setDealerCards([{ image: '/cards/Hole Card-.png', value: 0, suit: 'none' }, { image: '/cards/3-D.png', value: 3, suit: 'diamonds' }]);
        }
      }, [gameState]);

      useEffect(() => {
        if (gameState === GameState.Finished) {
          setPlayerCards([]);
          setDealerCards([]);
        }
      }, [gameState]);

      useEffect(() => {
        var userScore = 0;
        var dealerScore = 0;
        if (playerCards.length) {
          playerCards.forEach((card: any) => {
            userScore += card.value;
          })
          setPlayerScore(userScore);
        }
        if (dealerCards.length) {
          dealerCards.forEach((card: any) => {
            dealerScore += card.value;
          })
          setDealerScore(dealerScore);
        }
        
      }, [playerCards, dealerCards]);

    return (
        <div className="flex justify-center items-center py-10">
        <div className="py-4 w-[96vw] h-[72vh] bg-tableBg border-[12px] border-tableBorder rounded-[36px] flex flex-col justify-center items-center">
        <div className="flex flex-row items-center w-full">
          <div className="w-2/6">
          {gameState ===  GameState.NotStarted ? (
          <ChipsControls           
            gameState={gameState}
            startGame={startGame}
            betSize={betSize}
            handleClear={handleClear}
            handleChipClick={handleChipClick} />
            ) : (
            <ActionBar  finishGame={finishGame} playAgain={playAgain}     betSize={betSize} gameState={gameState} />
          ) }
          </div>
          <div className="w-4/6">
          <div className="flex flex-col justify-center items-center py-40">
          {/* <Image src="/styx-table-deco.png" alt="Poker Table Image" className="h-40 w-40 object-contain text-center" width={40} height={40} /> */}
          {/* <p className="text-center text-gray-700 text-[12px] mt-1">Blackjack pays 3 to 2 - ♠ ♣ ♥ ♦ - Dealer hits on soft 17</p> */}
          <GameBoard 
            dealerCards={dealerCards}
            playerCards={playerCards}
            dealerScore={dealerScore}
            playerScore={playerScore}
            /> 
          </div>
          </div>
          </div>
        </div>
      </div>
    )
  }

export default BlackJackTable;
