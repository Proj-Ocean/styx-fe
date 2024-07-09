import { useCallback, useState} from "react";

import Chips from './Chips'
const ChipsControls: React.FC = ({

}) => {
  const [betSize, setBetSize] = useState(0);
  const CLEAR = "Clear";
  const PLACE_BET = "Place Bet";

  const handleClear = () => {
    setBetSize(0);
  };

  const handleChipClick = (amount: number) => {
    setBetSize(prevBetSize => prevBetSize + amount);
  };

  return (
    <>
    <div className="hidden h-[102px] w-full items-center justify-between gap-1 rounded-xl bg-[#141414] p-5 sm:flex">
      <button onClick={handleClear}>
        {CLEAR}
      </button>
      <Chips onChipClick={handleChipClick} />
      <button>
        {PLACE_BET}({betSize})
      </button>
    </div>

    </>
  );
};

export default ChipsControls;
