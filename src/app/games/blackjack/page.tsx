"use client";
import { ClientOnly } from "@/components/ui/client-only";
// import { useBlackjack } from "@/hooks/blackjack/useBlackjack";
// import { Blackjack } from "@/components/Games/Blackjack/Blackjack";
import { useState } from "react";
import ChipsControls from "@/components/Blackjack/ChipsControls";
import ActionBar from "@/components/Blackjack/ActionBar";

export default function BlackJackGame() {

    const [betSize, setBetSize] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const startGame = () => {
        setGameStarted(true);
      };

      const handleClear = () => {
        setBetSize(0);
      };

      const resetGame = () => {
        setGameStarted(false);
      };
    
      const handleChipClick = (amount: number) => {
        setBetSize(prevBetSize => prevBetSize + amount);
      };

      const playAgain = () => {
        setBetSize(0);
        setGameStarted(false);
      };
    return (
        <ClientOnly>
            {/* <BlackJack /> */}
            <main className="flex min-h-screen flex-col items-center p-24">
                <div className="z-10 w-full max-w-5xl items-center font-mono text-sm lg:flex">
                    <div className="text-heading1 font-extrabold leading-[105%]">
                        Blackjack
                     </div>
                </div>
                <div className="py-10 min-h-96">
                        Game sectionx
                </div>
                {gameStarted ? (
        <ActionBar           playAgain={playAgain}     betSize={betSize} gameStarted={gameStarted} />
      ) : (
        <ChipsControls           gameStarted={gameStarted}
        startGame={startGame}
        betSize={betSize}
        handleClear={handleClear}
        handleChipClick={handleChipClick} />
      )}

                <div className="h-32">
                        Game history
                </div>
            </main>
            
        </ClientOnly>
    )
}
