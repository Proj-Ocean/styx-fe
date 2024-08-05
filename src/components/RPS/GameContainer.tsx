"use client";
import React, { useContext, useEffect, useRef, useState, ReactNode } from "react";
import Rock from "./Rock";
import Paper from "./Paper";
import Scissors from "./Scissors";
import { GameContext } from "./GameContext";
import { motion } from "framer-motion";

interface Props {
    selection?: ReactNode
    // any props that come into the component
}

function GameContainer({ selection, ...props }: Props) {
  const { onSelect, houseSelection, result, show, playAgain } =
    useContext(GameContext);
  const [animate, setAnimate] = useState(false);
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      onSelect();
    }
    setTimeout(() => {
      setAnimate(true);
    }, 3500);
  }, []);
  return (
    <main className="flex flex-col">
      <div className="flex flex-row justify-between text-center mb-8 px-8 -mt-20">
        <span className="text-md uppercase text-white">You Picked</span>
        <span className="text-md text-white uppercase">The house picked</span>
      </div>
      <div
        className={`grid ${
          result ? "grid-cols-3" : "grid-cols-2 space-x-8"
        } items-center`}
      >
        <div className="flex flex-col items-center">
          {selection === 2 ? (
            <>
              <Rock />
            </>
          ) : selection === 1 ? (
            <>
              <Paper />
            </>
          ) : selection === 0 ? (
            <Scissors />
          ) : (
            <></>
          )}
        </div>
        {result ? (
          <div className="relative scale-150 flex-row -bottom-64 items-center justify-center sm:flex sm:bottom-auto sm:scale-90 mr-4">
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl text-white font-bold tracking-widest uppercase">
                {result}
              </span>
              <button
                className="bg-white w-28 rounded-md uppercase text-xs font-medium h-7 tracking-wide text-gray-800 hover:text-[#dc2e4e]"
                onClick={(e) => playAgain(e)}
              >
                play again
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}

        <div
          className={
            "flex flex-col items-center bg-black/10 w-32 h-32 rounded-full self-center"
          }
        >
          <div className="absolute -top-6">
            {show === true ? (
              houseSelection === 2 ? (
                <>
                  <Rock />
                </>
              ) : houseSelection === 1 ? (
                <>
                  <Paper />
                </>
              ) : houseSelection === 0 ? (
                <Scissors />
              ) : (
                <></>
              )
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex flex-row w-full ">
            {show === true && result === "You Win" ? (
              <motion.div
                className={`${
                  animate === true ? "absolute" : "hidden"
                } bg-white/10 w-52 h-52 rounded-full -z-20 -top-12 -left-12 sm:-left-6`}
                animate={{
                  scaleX: animate === true ? 1 : 0,
                  scaleY: animate === true ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="absolute bg-white/5 w-64 h-64 rounded-full -z-30 -top-6 -left-6"></div>
                <div className="absolute bg-white/5 w-80 h-80 rounded-full -z-40 -top-14 -left-14"></div>
              </motion.div>
            ) : result === "Tie" ? (
              <></>
            ) : result === "You Lose" ? (
              <motion.div
                className={`${
                  animate === true ? "absolute" : "hidden"
                } bg-white/10 w-52 h-52 rounded-full -z-20 -top-12 -right-12 sm:-right-2`}
                animate={{
                  scaleX: animate === true ? 1 : 0,
                  scaleY: animate === true ? 1 : 0,
                }}
                transition={{ type: "spring", stiffness: 100 }}
              >
                <div className="absolute bg-white/5 w-64 h-64 rounded-full -z-30 -top-6 -left-6"></div>
                <div className="absolute bg-white/5 w-80 h-80 rounded-full -z-40 -top-14 -left-14"></div>
              </motion.div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default GameContainer;