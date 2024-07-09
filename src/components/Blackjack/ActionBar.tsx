"use client";

import { useEffect, useState } from "react";
// import { TLoadState } from "../../../../type";
// import { BlackjackGameData, PlayerHandData } from "./types";
// import { PlayerActions, checkGameSettled } from "./utils";
// import Loading from "@/components/Loading/Loading";
// export type TLoadState = "Confirming" | "Executing" | "Showing" | false;

// interface BlackjackActionBarProps {
//   loadState: TLoadState;
//   gameData: BlackjackGameData;
//   originalBetSize: number;
//   playerHandsData: Array<PlayerHandData>;
//   handlePlayerMove: Function;
//   executePlayerMoveSuccess: Function;
// }

const SPLIT = "SPLIT"
const STAND = "STAND"
const HIT = "HIT"
const DOUBLE = "DOUBLE"

const ActionBar: React.FC = ({}) => {

  return (
    <>
      {/* Desktop Action Bar*/}
      <div className="hidden h-[102px] w-full items-center justify-between gap-3 rounded-xl bg-[#141414] p-5 font-semibold sm:flex">
        <button
        >
          {SPLIT}
        </button>
        <button
        >
          {STAND}
        </button>

        <button
        >
          {HIT}
        </button>
        <button
        >
          {DOUBLE}
        </button>
      </div>


    </>
  );
};

export default ActionBar;


