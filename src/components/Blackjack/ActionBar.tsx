"use client";



interface ActionBarProps {
  gameStarted: boolean;
  betSize: number;
  playAgain: () => void;
}

const SPLIT = "SPLIT"
const STAND = "STAND"
const HIT = "HIT"
const DOUBLE = "DOUBLE"

const ActionBar: React.FC<ActionBarProps> = ({ betSize, playAgain}) => {


  return (
    <>
      <div className="hidden h-[102px] w-full items-center justify-between gap-3 rounded-xl bg-[#141414] p-5 font-semibold sm:flex">
        <button
        >
          {SPLIT}
        </button>
        <button
        >
          {STAND}
        </button>
        <p>Current Bet Size: {betSize}</p>

        <button
        >
          {HIT}
        </button>
        <button
        >
          {DOUBLE}
        </button>

        <button onClick={playAgain}
        >
          Play Again
        </button>
      </div>


    </>
  );
};

export default ActionBar;


