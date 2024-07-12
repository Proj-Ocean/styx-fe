"use client";
import { GameState } from "./BlackJackTable";
import { PlayerActions } from "./BlackJackTable";
interface ActionBarProps {
  gameState: GameState;
  betSize: number;
  playAgain: () => void;
  finishGame: () => void;
  handlePlayerAction: (any: PlayerActions) => any;
}

// const SPLIT = "SPLIT"
// const STAND = "STAND"
// const HIT = "HIT"
// const DOUBLE = "DOUBLE"

const ActionBar: React.FC<ActionBarProps> = ({ handlePlayerAction, gameState, betSize, playAgain, finishGame}) => {

  return (
    <div className="flex flex-wrap justify-center items-center gap-3 rounded-xl p-5 font-semibold">
      {gameState !== GameState.Finished ? (
        <>
          <div className="flex w-full justify-center gap-3">
            <button  onClick={() => handlePlayerAction(PlayerActions.SPLIT)} className=" bj-button flex-1">
              {PlayerActions.SPLIT}
            </button>
            <button onClick={() => handlePlayerAction(PlayerActions.STAND)} className=" bj-button flex-1">
              {PlayerActions.STAND}
            </button>
          </div>
          <div className="flex w-full justify-center gap-3">
            <button onClick={() => handlePlayerAction(PlayerActions.HIT)} className="bj-button flex-1">
              {PlayerActions.HIT}
            </button>
            <button  onClick={() => handlePlayerAction(PlayerActions.DOUBLE)} className=" bj-button flex-1">
              {PlayerActions.DOUBLE}
            </button>
          </div>
        </>
      ) : (
        <button onClick={playAgain} className="bj-button w-full mt-3">
          Play Again
        </button>
      )}
      <p className="w-full text-center">Current Bet Size: {betSize}</p>
    </div>
  );
};


export default ActionBar;
