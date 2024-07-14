"use client"
import { useEffect, useState, Fragment } from "react";
import { DealerHandData, BlackjackGameData, PlayerHandData } from "./types";
import ChipsControls from "./ChipControls";
import ActionBar from "./ActionBar";
// import { PlayerHandResults, calculateTotalWin } from "./utils";
import { card, CardProps as cardInterface } from './types'
import Image from "next/image";
import GameBoard from "./GameBoard";
import styles from './BlackJackTable.module.css'
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

export interface Card {
  image: string;
  value: number;
  suit: string;
}

export enum PlayerActions {
  HIT = 'Hit',
  STAND = 'Stand',
  SPLIT = 'Split',
  DOUBLE = 'Double'
}

export enum GameState {
  NotStarted = 'notStarted',
  Started = 'started',
  Finished = 'finished'
}

const BlackJackTable: React.FC<BlackjackTableProps> = ({ }) => {
  const [betSize, setBetSize] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [gameStatus, setGameStatus] = useState('');

  const [playerCards, setPlayerCards] = useState<any[]>([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [userCount, setUserCount] = useState(0);

  const [dealerCards, setDealerCards] = useState<any[]>([]);
  const [dealerScore, setDealerScore] = useState(0);
  const [dealerCount, setDealerCount] = useState(0);

  const startGame = () => {
    setGameState(GameState.Started);
  };

  const addCardToPlayerAndCheck = (newCard: Card) => {
    setPlayerCards((prevCards: Card[]) => {
      const updatedCards = [...prevCards, newCard];
      const newScore = calculateScore(updatedCards);
      if (newScore > 21) {
        setGameStatus('You busted you lose!');
        delay(2000).then(() => finishGame());
      }
      return updatedCards;
    });
  };

  const handlePlayerAction = (action: PlayerActions) => {
    switch (action) {
      case PlayerActions.DOUBLE:
        generateCard();
        doubleBet();
        startDealerTurn();
        break;
      case PlayerActions.HIT:
        generateCard();
        break;
      case PlayerActions.SPLIT:
        break;
      case PlayerActions.STAND:
        startDealerTurn();
        break;
    }
  };

  // Function to pause for a given time
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const startDealerTurn = async () => {
    flipDealerCard();
    await delay(1000);
    let currentDealerScore = calculateScore(dealerCards);

    while (currentDealerScore < 17) {
      await delay(1000);
      const newCard = generateDealerCard();
      setDealerCards((prevCards: Card[]) => {
        const updatedCards = [...prevCards, newCard];
        currentDealerScore = calculateScore(updatedCards);
        setDealerScore(currentDealerScore);
        return updatedCards;
      });
    }

    await delay(1000);
    //find all game cases
    if (currentDealerScore > 21) {
      setGameStatus('Player wins!');
      finishGame();
    } else if (currentDealerScore > playerScore) {
      setGameStatus('Dealer wins!');
      finishGame();
    } else if (currentDealerScore < playerScore) {
      setGameStatus('Player wins!');
      finishGame();
    } else {
      setGameStatus("It's a tie!");
      finishGame();
    }
  };

  const flipDealerCard = () => {
    const randomNumber = Math.floor(Math.random() * 11);
    const randomCard = { image: `/cards/${randomNumber}-H.png`, value: randomNumber, suit: 'hearts' };
    dealerCards[0] = randomCard;
    setDealerCards(dealerCards);
  };

  const doubleBet = () => {
    setBetSize(betSize * 2);
  };

  const generateDealerCard = () => {
    const randomNumber = Math.floor(Math.random() * 11) + 1;
    const randomCard = { image: `/cards/${randomNumber}-H.png`, value: randomNumber, suit: 'hearts' };
    return randomCard;
  };

  const calculateScore = (cards: Card[]) => {
    return cards.reduce((total: number, card: Card) => total + card.value, 0);
  };

  const generateCard = () => {
    const randomNumber = Math.floor(Math.random() * 11);
    const randomCard = { image: `/cards/${randomNumber}-H.png`, value: randomNumber, suit: 'hearts' };
    addCardToPlayerAndCheck(randomCard);
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
    let userScore = 0;
    let dealerScore = 0;
    if (playerCards.length) {
      playerCards.forEach((card: Card) => {
        userScore += card.value;
      });
      setPlayerScore(userScore);
    }
    if (dealerCards.length) {
      dealerCards.forEach((card: Card) => {
        dealerScore += card.value;
      });
      setDealerScore(dealerScore);
    }
  }, [playerCards, dealerCards]);

  return (
    <div className="flex justify-center items-center py-10">
      <div className={` ${styles['blackjack-table']} py-4 w-[96vw] h-[72vh]  border-[12px] border-tableBorder rounded-[36px] flex flex-col justify-center items-center`}>
        <div className="flex flex-row items-center w-full">
          <div className="w-2/6">
            {gameState === GameState.NotStarted ? (
              <ChipsControls
                gameState={gameState}
                startGame={startGame}
                betSize={betSize}
                handleClear={handleClear}
                handleChipClick={handleChipClick}
              />
            ) : (
              <ActionBar
                handlePlayerAction={handlePlayerAction}
                finishGame={finishGame}
                playAgain={playAgain}
                betSize={betSize}
                gameState={gameState}
                playerScore={playerScore}
              />
            )}
          </div>
          <div className="w-4/6">
            <div className="flex flex-col justify-center items-center py-40">
              <div>{gameStatus}</div>
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
  );
};

export default BlackJackTable;

