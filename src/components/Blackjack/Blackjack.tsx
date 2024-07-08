"use client";

import { useBlackjack } from "@/hooks/blackjack/useBlackjack";
import { ClientOnly } from "@/components/ui/client-only";
import Table from "./Table";
import ChipsControls from "./ChipsControls";
import ActionBar from "./ActionBar";
import EndGame from "./EndGame";

export function Blackjack() {
    const {
        loadState,
        originalBetSize,
        setOriginalBetSize,
        gameData,
        dealerHandData,
        playerHandsData,
        handleGameStart,
        handlePlayerMove,
        executePlayerMoveSuccess,
        syncGame,
        triggerEndGame,
        resetGame,
      } = useBlackjack();

      return (
        <ClientOnly>
        <div className="relative flex h-full min-h-[675px] w-full items-center justify-start">
            <div
            className="relative h-full min-h-[675px] w-full min-w-[300px] font-sf-pro-display"
            style={{
                backgroundImage: `url(/GameContainer/background.svg)`,
                backgroundSize: `cover`,
                backgroundPosition: `center`,
                backgroundRepeat: `no-repeat`,
            }}
            >
                <div className="relative mb-2">
                    <Table
                    gameData={gameData}
                    originalBetSize={originalBetSize}
                    dealerHandData={dealerHandData}
                    playerHandsData={playerHandsData}
                    syncGame={syncGame}
                    triggerEndGame={triggerEndGame}
                    />
                </div>
                <div className="relative mt-2">
                    {!gameData.activeGame ? (
                    <ChipsControls
                        // ChipsControls will re-render each time due to handleGameStart,
                        // so no need to memoize the other props
                        loadState={loadState}
                        handleGameStart={handleGameStart}
                        originalBetSize={originalBetSize}
                        setOriginalBetSize={setOriginalBetSize}
                    />
                    ) : (
                    <ActionBar
                        // ActionBar will re-render each time due to handlePlayerMove,
                        // so no need to memoize the other props
                        loadState={loadState}
                        gameData={gameData}
                        originalBetSize={originalBetSize}
                        playerHandsData={playerHandsData}
                        handlePlayerMove={handlePlayerMove}
                        executePlayerMoveSuccess={executePlayerMoveSuccess}
                    />
                    )}
                </div>
          {gameData.gameCompleted && (
            <EndGame gameData={gameData} resetGame={resetGame} />
          )}
            </div>
        </div>
        </ClientOnly>
      )

}