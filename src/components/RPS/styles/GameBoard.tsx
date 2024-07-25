"use client"
import { useEffect, useState, Fragment } from "react";

type RPSChoice = "rock" | "paper" | "scissors";

interface RPSTableProps {
    dealerChoice: RPSChoice[],
    playerChoice: RPSChoice[],
    playerRecord: number|string|null,
}

const GameBoard: React.FC<RPSTableProps> = ({ dealerChoice, playerChoice, playerRecord }) => {
    return (
        <>
        </>
    )
}

export default GameBoard