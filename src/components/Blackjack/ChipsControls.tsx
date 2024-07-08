import { useCallback } from "react";
import { TLoadState } from "@/../type";
import Chips from "./Chips";
// import Loading from "@/components/Loading/Loading";

interface BlackjackChipsControlsProps {
  loadState: TLoadState;
  handleGameStart: Function;
  originalBetSize: number;
  setOriginalBetSize: Function;
}

// Note: handleGameStart function changes due to auth initialization on each re-render,
// so the ChipsControls component should not and can not be memoized
const ChipsControls: React.FC<BlackjackChipsControlsProps> = ({
  loadState,
  handleGameStart,
  originalBetSize,
  setOriginalBetSize,
}) => {
  const CLEAR = "Clear";
  const PLACE_BET = "Place Bet";

  const inactive = originalBetSize <= 0;

  const updateOriginalBetSize = useCallback(
    (val: number) => {
      setOriginalBetSize(val);
    },
    [setOriginalBetSize],
  );
  return (
    <>
      {/* Desktop Chip Control Bar */}
      <div className="hidden h-[102px] w-full items-center justify-between gap-1 rounded-xl bg-[#141414] p-5 sm:flex">
        <button
          className="mr-6 h-full w-1/5 min-w-24 flex-none rounded-full bg-neutral-700 px-2 transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-40"
          disabled={inactive || loadState !== false}
          onClick={() => setOriginalBetSize(0)}
        >
          {CLEAR}
        </button>
        <Chips
          setOriginalBetSize={updateOriginalBetSize}
          loadState={loadState}
        />
        <button
          className="ml-6 h-full w-1/5 min-w-24 flex-none rounded-full bg-win px-2 text-black transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-40"
          disabled={inactive || loadState !== false}
          onClick={async () => {
            handleGameStart(originalBetSize);
          }}
        >
          {PLACE_BET} ({originalBetSize})
        </button>
        {/* {loadState !== false && <Loading />} */}
        {loadState !== false && "Loading..."}
      </div>

      {/* Mobile Chip Control Bar */}
      <div className="xs:gap-3 xs:py-3 flex h-[136px] w-full flex-col items-start justify-between gap-2 rounded-xl bg-[#141414] px-5 py-2 sm:hidden">
        <div className="flex w-full items-center justify-center gap-2">
          <Chips
            setOriginalBetSize={updateOriginalBetSize}
            loadState={loadState}
          />
        </div>
        <div className="flex h-full w-full items-center justify-center gap-8 text-sm">
          <button
            className="h-full w-2/5 min-w-24 flex-none rounded-full bg-neutral-700 px-2 transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-40"
            disabled={inactive || loadState !== false}
            onClick={() => setOriginalBetSize(0)}
          >
            {CLEAR}
          </button>
          <button
            className="h-full w-2/5 min-w-24 flex-none rounded-full bg-win px-2 text-black transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 md:min-w-40"
            disabled={inactive || loadState !== false}
            onClick={async () => {
              handleGameStart(originalBetSize);
            }}
          >
            {PLACE_BET} ({originalBetSize})
          </button>
        </div>
        {/* {loadState !== false && <Loading />} */}
        {loadState !== false && "Loading..."}

      </div>
    </>
  );
};

export default ChipsControls;
