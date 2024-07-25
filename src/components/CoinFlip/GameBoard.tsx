"use client"
import { useEffect, useState, Fragment } from "react";

type CoinFlipChoice = "heads" | "tails";

interface CoinFlipProps {
    gameResult: CoinFlipChoice,
    playerChoice: CoinFlipChoice,
    playerRecord: number|string|null,
}

const GameBoard: React.FC<CoinFlipProps> = ({ gameResult, playerChoice, playerRecord }) => {
    return (
        <>
        </>
    )
}

export default GameBoard