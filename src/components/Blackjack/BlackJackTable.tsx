"use client"
import { useEffect, useState, Fragment } from "react";
import { DealerHandData, BlackjackGameData, PlayerHandData } from "./types";
import ChipsControls from "./ChipControls";
import ActionBar from "./ActionBar";
import { ToastContainer, toast } from "react-toastify";

// import { PlayerHandResults, calculateTotalWin } from "./utils";
import { card, CardProps as cardInterface } from './types'
import Image from "next/image";
import GameBoard from "./GameBoard";
import styles from './styles/BlackJackTable.module.css'
import { createSurfClient, createEntryPayload } from "@thalalabs/surf";
import { useSubmitTransaction } from "@thalalabs/surf/hooks";
import { Aptos, AptosConfig, Network, Account} from "@aptos-labs/ts-sdk";
import { ABI } from "../../hooks/blackjack/abi";
import { NextResponse } from "next/server";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

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

export const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
export const surfClient = createSurfClient(aptos).useABI(ABI);

const BlackJackTable: React.FC<BlackjackTableProps> = ({ }) => {
  const { account, connected, network, wallet, changeNetwork } = useWallet();
  const {
    isIdle,
    reset,
    isLoading,
    error,
    submitTransaction,
    data,
  } = useSubmitTransaction();

  if (network?.name !== Network.TESTNET) {
    changeNetwork(Network.TESTNET);
  }
  const [betSize, setBetSize] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [gameStatus, setGameStatus] = useState('');

  const [playerCards, setPlayerCards] = useState<any[]>([]);
  const [playerScore, setPlayerScore] = useState(0);

  const [dealerCards, setDealerCards] = useState<any[]>([]);
  const [dealerScore, setDealerScore] = useState(0);

  const handleGameStart = async (betSize: number) => {
    try {
    const startGamePayload = createEntryPayload(ABI, {
      function: "start_game",
      typeArguments: [],
      functionArguments: [betSize],
    });
      const tx = await submitTransaction(startGamePayload);
      return NextResponse.json({ tx });
    } catch (e) {
        console.error('error', e);
    }
  }

  const getDealerCards = async () => {
    const [dealer_cards] = await surfClient.view.get_dealer_cards({
      functionArguments: [ABI.address],
      typeArguments: [],
    })
    console.log("dealer_cards: ", dealer_cards)
    setDealerCards(dealer_cards)
  }
  const getPlayerCards = async () => {
    const [player_cards] = await surfClient.view.get_player_cards({
      functionArguments: [ABI.address],
      typeArguments: [],
    })
    console.log("player_cards: ", player_cards)
    setPlayerCards(player_cards)
  }

  // hit contract call
  const hit = async () => {
    try {
      const hitPayload = createEntryPayload(ABI, {
        function: "hit",
        typeArguments: [],
        functionArguments: [],
      });
      const tx = await submitTransaction(hitPayload);
      return NextResponse.json({ tx });
    } catch (e) {
        console.error('error', e);
    }
  }

  // stand contract call
  const stand = async () => {
    try {
      const standPayload = createEntryPayload(ABI, {
        function: "stand",
        typeArguments: [],
        functionArguments: [],
      });
      const tx = await submitTransaction(standPayload);
      return NextResponse.json({ tx });
    } catch (e) {
        console.error('error', e);
    }
  }

  const startGame = () => {
    setGameState(GameState.Started);
    handleGameStart(betSize); 
    //         Card { rank, suit }
    //   struct BlackjackHand has key {
    //     player_cards: vector<Card>,
    //     dealer_cards: vector<Card>,
    // }
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
        hit();
        generateCard(); // merge with hit function?
        break;
      case PlayerActions.SPLIT:
        break;
      case PlayerActions.STAND:
        stand();
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
        toast.success("Game of blackjack finished!", {
          position: "bottom-left",
        });
        setBetSize(0);
        setGameState(GameState.Finished);
      };

  const handleChipClick = (amount: number) => {
    setBetSize(prevBetSize => prevBetSize + amount);
  };

  const multiplyBet = (amount: number) => {
    setBetSize(prevBetSize => prevBetSize * amount);
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
          <div className="w-4/6 bg-[#5A554B] h-[72vh] py-4">
            <div className="flex flex-col justify-center items-center py-40">
              <div>{gameStatus}</div>
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
        }
      </div>
    </div>
  );
};

export default BlackJackTable;

