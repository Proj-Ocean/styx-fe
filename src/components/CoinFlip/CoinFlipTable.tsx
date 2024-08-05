"use client"
import { useEffect, useState, Fragment } from "react";
import ChipsControls from "../Blackjack/ChipControls";
import { ToastContainer, toast } from "react-toastify";
import { WalletSelector as ShadcnWalletSelector } from "../../app/WalletSelector";

import Image from "next/image";
import GameBoard from "./GameBoard";
import styles from './styles/BlackJackTable.module.css'
import { createSurfClient, createEntryPayload } from "@thalalabs/surf";
import { useSubmitTransaction } from "@thalalabs/surf/hooks";
import { Aptos, AptosConfig, Network, Account} from "@aptos-labs/ts-sdk";
import { ABI } from "../../hooks/coinflip/abi";
import { NextResponse } from "next/server";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

export enum PlayerActions {
  HEADS = 'heads',
  TAILS= 'tails',
}

export enum GameState {
  NotStarted = 'notStarted',
  Started = 'started',
  Finished = 'finished'
}

interface CoinFlipProps {
    playerChoice?: number;
    result?: string;
}

export const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
export const surfClient = createSurfClient(aptos).useABI(ABI);

const CoinFlipTable: React.FC<CoinFlipProps> = ({ }) => {
  const { account, connected, network, wallet, changeNetwork } = useWallet();
  const {
    isIdle,
    reset,
    isLoading,
    error,
    submitTransaction,
    data,
  } = useSubmitTransaction();

  const userAddress = account?.address;

  if (network?.name !== Network.TESTNET) {
    changeNetwork(Network.TESTNET);
  }
  const [betSize, setBetSize] = useState(0);
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  

  const startGame = () => {
    toast.success("Coinflip started!", {
      position: "bottom-left",
    });
    handleGameStart(betSize);
    setGameState(GameState.Started);
  };

  const onSelect = () => {
    const userSelect = GameRules[selection].value;
    const number = Math.floor(Math.random() * 3);
    setHouseSelection(number);
    setTimeout(() => {
      setShow(true);
      if (GameRules[houseSelection].beats.includes(userSelect)) {
        setResult("You Lose");
      } else {
        if (GameRules[number].value === userSelect) {
          setResult("Tie");
        } else {
          setResult("You Win");
        }
      }
    }, 3000);
  };
  const selectHandle = (index: any) => {
    setIsSelect(true);
    setSelection(index);
  };
  const playAgain = (e) => {
    setGameState(GameState.NotStarted);
    e.preventDefault();
    if (e) {
      setIsSelect(false);
      setResult("");
      setShow(false);
    }
  };


  const handlePlayerAction = (action: PlayerActions) => {
    switch (action) {
      case PlayerActions.HEADS:
        generateCard();
        doubleBet();
        startDealerTurn();
        toast.success("Chose Heads!", {
          position: "bottom-left",
        });
        break;
      case PlayerActions.TAILS:
        toast.success("Chose Tails!", {
          position: "bottom-left",
        });
        hit();
        generateCard(); // merge with hit function?
        break;
    }
  };

  const handleClear = () => {
    setBetSize(0);
  };

  const finishGame = () => {
    toast.success("Coinflip finished!", {
      position: "bottom-left",
  });
  setBetSize(0);
  setGameState(GameState.Finished);
};

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

  // choose contract call
  const choose = async () => {
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


  const generateDealerCard = () => {
    const randomNumber = Math.floor(Math.random() * 11) + 1;
    const randomCard = { image: `/cards/${randomNumber}-H.png`, value: randomNumber, suit: 'hearts' };
    return randomCard;
  };

  const calculateScore = (cards: Card[]) => {
    return cards.reduce((total: number, card: Card) => total + card.value, 0);
  };

  const handleChipClick = (amount: number) => {
    setBetSize(prevBetSize => prevBetSize + amount);
  };

  const multiplyBet = (amount: number) => {
    setBetSize(prevBetSize => prevBetSize * amount);
  };

  useEffect(() => {
    if (gameState === GameState.Started) {
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
        <div className="py-4 w-[96vw] h-[72vh] bg-tableBg border-[12px] border-tableBorder rounded-[36px] flex flex-col justify-center items-center">
          <div className="flex flex-row justify-center items-center w-full">
          <div className="w-2/6">
          {!userAddress ?
          <div className="items-center flex justify-center">
            <ShadcnWalletSelector /> 
          </div>
          : 
              <>
              {gameState === GameState.NotStarted ? 
                <ChipsControls 
                  gameState={gameState}
                  startGame={startGame}
                  betSize={betSize}
                  handleClear={handleClear}
                  handleChipClick={handleChipClick}
                  multiplyBet={multiplyBet}
                  />
                : (
                <ActionBar handlePlayerAction={handlePlayerAction} playAgain={playAgain} betSize={betSize} gameState={gameState} playerScore={playerScore} finishGame={finishGame}/>
              ) } 
              </>
              }
          </div>
          <div className="w-4/6">
            <div className="border-l-2">
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
        </div>
      </div>
    </div>
  );
};

export default BlackJackTable;

