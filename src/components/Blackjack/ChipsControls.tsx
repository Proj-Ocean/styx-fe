import { useCallback, useState} from "react";

import Chips from './Chips'
interface ChipsControlsProps {
  gameStarted: boolean;
  startGame: () => void;
  betSize: number;
  handleClear: () => void;
  handleChipClick: (amount: number) => void;

}
const ChipsControls: React.FC<ChipsControlsProps> = ({ gameStarted, startGame, betSize, handleClear, handleChipClick

}) => {
  const CLEAR = "Clear";
  const PLACE_BET = "Place Bet";

  const handlePlaceBet = () => {
    startGame();
  };

  return (
    <>
    <div className="hidden h-[102px] w-full items-center justify-between gap-1 rounded-xl bg-[#141414] p-5 sm:flex">
      <button onClick={handleClear}>
        {CLEAR}
      </button>
      <Chips onChipClick={handleChipClick} />
      <button onClick={handlePlaceBet}
      disabled={betSize === 0}>
        {PLACE_BET}({betSize})
      </button>
    </div>

    </>
  );
};

export default ChipsControls;
