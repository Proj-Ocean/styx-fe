"use client";
import { GameState } from "./BlackJackTable";
import { PlayerActions } from "./BlackJackTable";
import styles from './styles/BlackJackTable.module.css'
import { createSurfClient, createEntryPayload } from "@thalalabs/surf";
import { useSubmitTransaction } from "@thalalabs/surf/hooks";
import { Aptos, AptosConfig, Network, Account} from "@aptos-labs/ts-sdk";
import { ABI } from "../../hooks/blackjack/abi";
import { NextResponse } from "next/server";

interface ActionBarProps {
  gameState: GameState;
  betSize: number;
  playAgain: () => void;
  finishGame: () => void;
  handlePlayerAction: (any: PlayerActions) => any;
  playerScore: number;
}

const ActionBar: React.FC<ActionBarProps> = ({ handlePlayerAction, gameState, betSize, playAgain, finishGame, playerScore}) => {
  const {
    isIdle,
    reset,
    isLoading,
    error,
    submitTransaction,
    data,
  } = useSubmitTransaction();

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {gameState !== GameState.Finished ? (
        <>
        <div className="flex flex-col">
        <div className="flex">
            <p className="w-full text-center"> Total Points: {playerScore}</p>
          </div>        
          <div className="flex flex-col mt-1">
            <div className="flex w-full justify-center gap-3">
            <button onClick={() => handlePlayerAction(PlayerActions.HIT)} className={`${styles.hit} bj-button flex-1`}>
                {PlayerActions.HIT}
              </button>
              <button onClick={() => handlePlayerAction(PlayerActions.STAND)} className={`${styles.stand} bj-button flex-1`}>
                {PlayerActions.STAND} 
              </button>
            </div>
            <div className="flex w-full justify-center gap-3 mt-2">
              <button  onClick={() => handlePlayerAction(PlayerActions.SPLIT)} className={`${styles.split} bj-button flex-1`}>
                {PlayerActions.SPLIT}
              </button>
              <button  onClick={() => handlePlayerAction(PlayerActions.DOUBLE)} className={`${styles.double} bj-button flex-1`}>
                {PlayerActions.DOUBLE}
              </button>
            </div>
          </div>       
        </div>
        </>
      ) : (
        <button onClick={playAgain} className={` ${styles['bet-action']} bj-button`}>
          Play Again
        </button>
      )}
    </div>
  );
};


export default ActionBar;
