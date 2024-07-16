"use client";
import { GameState } from "./BlackJackTable";
import { PlayerActions } from "./BlackJackTable";
import styles  from './BlackJackTable.module.css'
interface ActionBarProps {
  gameState: GameState;
  betSize: number;
  playAgain: () => void;
  finishGame: () => void;
  handlePlayerAction: (any: PlayerActions) => any;
  playerScore: number;
}



const ActionBar: React.FC<ActionBarProps> = ({ handlePlayerAction, gameState, betSize, playAgain, finishGame, playerScore}) => {

  return (
    <div className="flex flex-no-wrap justify-center items-center gap-3 rounded-xl p-5 font-semibold">
      {gameState !== GameState.Finished ? (
        <>
          <div className="flex w-full justify-center gap-3">
            <button  onClick={() => handlePlayerAction(PlayerActions.SPLIT)} className={`${styles.split} bj-button flex-1`}>
              {PlayerActions.SPLIT}
            </button>
            <button onClick={() => handlePlayerAction(PlayerActions.STAND)} className={`${styles.stand} bj-button flex-1`}>
              {PlayerActions.STAND} 
            </button>
          </div>
          <p className="w-full text-center"> Total Points: {playerScore}</p>
          <div className="flex w-full justify-center gap-3">
            <button onClick={() => handlePlayerAction(PlayerActions.HIT)} className={`${styles.hit} bj-button flex-1`}>
              {PlayerActions.HIT}
            </button>
            <button  onClick={() => handlePlayerAction(PlayerActions.DOUBLE)} className={`${styles.double} bj-button flex-1`}>
              {PlayerActions.DOUBLE}
            </button>
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
