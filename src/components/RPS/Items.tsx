"use client";
import React, { useContext } from "react";
import Rock from "./Rock";
import Paper from "./Paper";
import Scissors from "./Scissors";
import { GameContext } from "./GameContext";
import GameContainer from "./GameContainer";

function Items() {
  const { isSelect, selectHandle, selection } = useContext(GameContext);
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-row mt-32 scale-90 sm:scale-125">
        {!isSelect ? (
          <>
            <div
              className="absolute z-10 -mx-48 -my-12 transition hover:scale-125 duration-300 cursor-grab"
              onClick={() => selectHandle(1)}
            >
              <Paper />
            </div>
            <div
              className="absolute z-10 mx-8 -my-12 transition hover:scale-125 duration-300"
              onClick={() => selectHandle(0)}
            >
              <Scissors />
            </div>
            <div
              className="absolute z-10 -mx-20 my-32 transition hover:scale-125 duration-300 cursor-grabbing"
              onClick={() => selectHandle(2)}
            >
              <Rock />
            </div>
          </>
        ) : (
          <div>
            <GameContainer selection={selection} />
          </div>
        )}
      </div>
      <div className="scale-90 -z-10 sm:scale-120">
        {!isSelect ? (
          <svg width="313" height="278" xmlns="http://www.w3.org/2000/svg">
            <path
              stroke="#000"
              strokeWidth="15"
              fill="none"
              opacity=".2"
              d="M156.5 262 300 8H13z"
            />
          </svg>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Items;