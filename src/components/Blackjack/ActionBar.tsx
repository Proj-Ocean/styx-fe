"use client";

import { useEffect, useState } from "react";
// import { TLoadState } from "../../../../type";
import { BlackjackGameData, PlayerHandData } from "./types";
import { PlayerActions, checkGameSettled } from "./utils";
// import Loading from "@/components/Loading/Loading";
export type TLoadState = "Confirming" | "Executing" | "Showing" | false;

interface BlackjackActionBarProps {
  loadState: TLoadState;
  gameData: BlackjackGameData;
  originalBetSize: number;
  playerHandsData: Array<PlayerHandData>;
  handlePlayerMove: Function;
  executePlayerMoveSuccess: Function;
}

const SPLIT = PlayerActions.SPLIT;
const STAND = PlayerActions.STAND;
const HIT = PlayerActions.HIT;
const DOUBLE = PlayerActions.DOUBLE;

const ActionBar: React.FC<BlackjackActionBarProps> = ({
  loadState,
  gameData,
  originalBetSize,
  playerHandsData,
  handlePlayerMove,
  executePlayerMoveSuccess,
}) => {
  const [doubleAvailable, setDoubleAvailable] = useState<boolean>(false);
  const [splitAvailable, setSplitAvailable] = useState<boolean>(false);
  const [splitBlackjack, setSplitBlackjack] = useState<boolean>(false);
  const [enableActionBar, setEnableActionBar] = useState<boolean>(false);

  const splitEvent = async () => {
    await handlePlayerMove(SPLIT, originalBetSize);
  };

  const standEvent = async () => {
    await handlePlayerMove(STAND, 0);
  };

  const hitEvent = async () => {
    await handlePlayerMove(HIT, 0);
  };

  const doubleEvent = async () => {
    await handlePlayerMove(DOUBLE, originalBetSize);
  };

  // See if double or split are available depending on the current hand you are on
  useEffect(() => {
    if (!gameData.activeGame) return;

    playerHandsData.forEach((hand) => {
      if (!hand.indicator) return;

      if (hand.points[0] === 21) {
        setSplitBlackjack(true);
      } else {
        setSplitBlackjack(false);
      }

      if (hand.doubleAvailable) {
        setDoubleAvailable(true);
      } else {
        setDoubleAvailable(false);
      }

      if (hand.splitAvailable) {
        setSplitAvailable(true);
      } else {
        setSplitAvailable(false);
      }
    });
  }, [gameData.activeGame, playerHandsData]);

  useEffect(() => {
    if (!gameData.activeGame) return;
    // If player losses or winnings are in gameData, dealer started his turn
    // and no more player actions are available
    const noMoreActions = checkGameSettled(
      gameData.playerLosses,
      gameData.playerWinnings,
    );

    setEnableActionBar(
      gameData.activeGame && loadState === false && !noMoreActions,
    );
  }, [
    gameData.activeGame,
    gameData.playerLosses,
    gameData.playerWinnings,
    loadState,
  ]);

  return (
    <>
      {/* Desktop Action Bar*/}
      <div className="hidden h-[102px] w-full items-center justify-between gap-3 rounded-xl bg-[#141414] p-5 font-semibold sm:flex">
        <button
          className="h-full w-1/5 rounded-full bg-neutral-700 tracking-wide text-neutral-50 transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!enableActionBar || !splitAvailable || splitBlackjack}
          onClick={splitEvent}
        >
          {SPLIT}
        </button>
        <button
          className="h-full w-1/5 rounded-full bg-win tracking-wide text-black transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!enableActionBar}
          onClick={standEvent}
        >
          {STAND}
        </button>
        {isDealerTurn(playerHandsData) && (
          <button
            className="h-full w-1/5 rounded-full border-2 border-win bg-black text-[10px] transition-all hover:scale-[1.03] hover:bg-[#262626] active:scale-100 active:bg-[#222222]"
            onClick={() => {
              executePlayerMoveSuccess(
                gameData.gameId,
                gameData.gameSeed,
                gameData.gameBetSize,
              );
            }}
          >
            Force Dealer Move
          </button>
        )}
        <button
          className="h-full w-1/5 rounded-full bg-win tracking-wide text-black transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!enableActionBar || splitBlackjack}
          onClick={hitEvent}
        >
          {HIT}
        </button>
        <button
          className="h-full w-1/5 rounded-full bg-neutral-700 tracking-wide text-neutral-50 transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!enableActionBar || !doubleAvailable || splitBlackjack}
          onClick={doubleEvent}
        >
          {DOUBLE}
        </button>
        {/* {loadState !== false && <Loading />} */}
        {loadState !== false && "Loading..."}
      </div>

      {/* Mobile Action Bar*/}
      <div className="flex h-[136px] w-full flex-col items-center justify-between gap-3 rounded-xl bg-[#141414] p-5 font-semibold sm:hidden">
        <div className="flex h-1/2 w-full items-center justify-evenly">
          <button
            className="h-full w-2/5 rounded-full bg-win tracking-widest text-black transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!enableActionBar}
            onClick={standEvent}
          >
            {STAND}
          </button>
          <button
            className="h-full w-2/5 rounded-full bg-win tracking-widest text-black transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!enableActionBar || splitBlackjack}
            onClick={hitEvent}
          >
            {HIT}
          </button>
        </div>
        {isDealerTurn(playerHandsData) ? (
          <button
            className="h-1/2 w-[86%] rounded-full border-2 border-win bg-black text-[10px] transition-all hover:scale-[1.03] hover:bg-[#262626] active:scale-100 active:bg-[#222222]"
            onClick={() => {
              executePlayerMoveSuccess(
                gameData.gameId,
                gameData.gameSeed,
                gameData.gameBetSize,
              );
            }}
          >
            Force Dealer Move
          </button>
        ) : (
          <div className="flex h-1/2 w-full items-center justify-evenly">
            <button
              className="h-full w-2/5 rounded-full bg-neutral-700 tracking-widest text-neutral-50 transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!enableActionBar || !splitAvailable || splitBlackjack}
              onClick={splitEvent}
            >
              {SPLIT}
            </button>
            <button
              className="h-full w-2/5 rounded-full bg-neutral-700 tracking-widest text-neutral-50 transition-all enabled:hover:scale-[1.03] enabled:active:scale-100 enabled:active:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!enableActionBar || !doubleAvailable || splitBlackjack}
              onClick={doubleEvent}
            >
              {DOUBLE}
            </button>
          </div>
        )}
        {/* {loadState !== false && <Loading />} */}
        {loadState !== false && "Loading..."}
        </div>
    </>
  );
};

export default ActionBar;

function isDealerTurn(playerHandsData: Array<PlayerHandData>) {
  return playerHandsData.some(
    (hand, index) =>
      playerHandsData.length - 1 === index && hand.status !== "100",
  );
}
