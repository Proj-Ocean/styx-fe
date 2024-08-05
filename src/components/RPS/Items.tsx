"use client";
import { GameRules } from "@/shared/rules";
import React, { createContext, useState } from "react";
export const GameContext = createContext({});
function GameProvider({ children }) {
  const [isSelect, setIsSelect] = useState(false);
  const [selection, setSelection] = useState(0);
  const [houseSelection, setHouseSelection] = useState(0);
  const [result, setResult] = useState("");
  const [score, setScore] = useState(0);
  const [show, setShow] = useState(false);

  const onSelect = () => {
    const userSelect = GameRules[selection].value;
    const number = Math.floor(Math.random() * 3);
    setHouseSelection(number);
    setTimeout(() => {
      setShow(true);
      if (GameRules[houseSelection].beats.includes(userSelect)) {
        setResult("You Lose");
        if (score > 0) {
          setScore((score) => (score ? score - 1 : 0));
        }
      } else {
        if (GameRules[number].value === userSelect) {
          setResult("Tie");
        } else {
          setResult("You Win");
          setScore((score) => score + 1);
        }
      }
    }, 3000);
  };
  const selectHandle = (index) => {
    setIsSelect(true);
    setSelection(index);
  };
  const playAgain = (e) => {
    e.preventDefault();
    if (e) {
      setIsSelect(false);
      setResult("");
      setShow(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        isSelect,
        selection,
        selectHandle,
        setIsSelect,
        setResult,
        setShow,
        playAgain,
        onSelect,
        houseSelection,
        score,
        result,
        show,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export default GameProvider;