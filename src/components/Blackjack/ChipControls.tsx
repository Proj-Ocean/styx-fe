import { useCallback, useState} from "react";
import { GameState } from "./BlackJackTable";

import Chips from './Chips'
interface ChipsControlsProps {
  gameState: GameState;
  startGame: () => void;
  betSize: number;
  handleClear: () => void;
  handleChipClick: (amount: number) => void;

}
const ChipsControls: React.FC<ChipsControlsProps> = ({ gameState, startGame, betSize, handleClear, handleChipClick

}) => {
  const CLEAR = "Clear";
  const PLACE_BET = "Place Bet";
  const [inputValue, setInputValue] = useState(betSize.toString());

  const handlePlaceBet = () => {
    startGame();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === '') {
      handleChipClick(-betSize); // Reset betSize to 0
    } else if (!isNaN(parseInt(value, 10))) {
      handleChipClick(parseInt(value, 10) - betSize);
    }
  };

  return (
    <>
    <div className="items-center justify-between gap-3 rounded-xl sm:flex">
      <button className="bj-button" onClick={handleClear}>
        {CLEAR}
      </button>
      <Chips onChipClick={handleChipClick} />
      <div className="flex flex-col gap-2">
      <input 
          type="number"
          value={betSize}
          onChange={handleInputChange}
          className="bj-button border rounded px-2 py-1 w-24 h-14"
        />
      <button className="bj-button" onClick={handlePlaceBet}
      disabled={betSize === 0}>
        {PLACE_BET}({betSize})
      </button>
      </div>

    </div>

    </>
  );
};

export default ChipsControls;