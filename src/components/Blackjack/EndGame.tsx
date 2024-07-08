import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { type BlackjackGameData } from "./types";
import BlackjackNextGame from "./BlackjackNextGame";

type BlackjackEndGameProps = {
  gameData: BlackjackGameData;
  resetGame: Function;
};

const EndGame: React.FC<BlackjackEndGameProps> = ({ gameData, resetGame }) => {
  const [seconds, setSeconds] = useState(8);
  const [playerWon, setPlayerWon] = useState<boolean>(false);

  const startNewGame = () => {
    resetGame();
  };

  useEffect(() => {
    setPlayerWon(gameData.playerWinnings > 0);
  }, [gameData.playerWinnings]);

  // Initiate timer to auto start new game
  useEffect(() => {
    const intervalId: ReturnType<typeof setInterval> = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (seconds < 0) {
      startNewGame();
    }
  }, [seconds]);

  return (
    <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-end bg-black fade-in">
      {playerWon ? (
        <Confetti
          className="absolute h-full w-full"
          colors={[
            "#00FF19", // Green (default)
            "#00FF19E6", // Green opacity-90%
            "#00FF19CC", // Green opacity-80%
            "#00FF19B3", // Green opacity-70%
            "#00FF199E", // Green opacity-62%
            "#00FF1980", // Green opacity-50%
          ]}
        />
      ) : (
        <></>
      )}
      <div className="flex h-[102px] w-full items-center justify-center p-5">
        <BlackjackNextGame
          progress={seconds}
          total={8}
          handleReset={startNewGame}
        >
          <div className="relative flex h-full w-full items-center justify-center text-center text-xl font-bold text-black">
            <div>Play Again</div>
          </div>
        </BlackjackNextGame>
      </div>
    </div>
  );
};

export default EndGame;
