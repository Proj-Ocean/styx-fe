// import { useEffect, useState } from "react";
// import { DealerHandData, BlackjackGameData, PlayerHandData } from "./types";
// import { useGetOldGames } from "@/hooks/blackjack/useGetOldGames";
// import { PlayerHandResults, calculateTotalWin } from "./utils";
// import { useCoinTypeStore } from "@/store/coinTypeStore";
// import { formatAmount } from "@/utils/formatAmount";
// import { useUserInfoStore } from "@/store/userInfoStore";
// import { formatAddress } from "@mysten/sui/utils";
// import { useAuth } from "@/lib/auth";
// import Neutral from "@/../public/Blackjack/Hosts/XX/Neutral-overlay.png";
// import Happy from "@/../public/Blackjack/Hosts/XX/Happy1-overlay.png";
// import Sad from "@/../public/Blackjack/Hosts/XX/Sad-overlay.png";
// import BigNumber from "bignumber.js";
// import Image from "next/image";
// import RecoveryDropdown from "./RecoveryDropdown";
// import GameLayout from "./GameLayout";
// import PastWinningHands from "./PastWinningHands";

// type BlackjackTableProps = {
//   gameData: BlackjackGameData;
//   originalBetSize: number;
//   dealerHandData: DealerHandData;
//   playerHandsData: Array<PlayerHandData>;
//   syncGame: Function;
//   triggerEndGame: Function;
// };

// const gameOutcomeText = {
//   WIN: { header: "You rock!", text: "Congratulations you won" },
//   LOSE: { header: "Uh oh!", text: "Better luck next time!" },
//   PUSH: {
//     header: "The game ended in a tie!",
//     text: "Your bet pushes, and you can use it for the next game.",
//   },
// };

// const Table: React.FC<BlackjackTableProps> = ({
//   gameData,
//   originalBetSize,
//   dealerHandData,
//   playerHandsData,
//   syncGame,
//   triggerEndGame,
// }) => {
//   const { currentCoinSymbol } = useCoinTypeStore();
//   const { oldGames } = useGetOldGames();
//   const auth = useAuth();
//   const address = auth?.address;
//   const username = useUserInfoStore((state) => state.username);
//   const name =
//     username !== address && username
//       ? username
//       : address
//         ? formatAddress(address)
//         : "Player";

//   const [gameOutcome, setGameOutcome] = useState<PlayerHandResults | null>(
//     null,
//   );
//   const [totalPlayerWin, setTotalPlayerWin] = useState<number>(0);

//   useEffect(() => {
//     if (!gameData.gameCompleted) {
//       setGameOutcome(null);
//       setTotalPlayerWin(0);
//       return;
//     }

//     if (gameData.playerWinnings === 0 && gameData.playerLosses === 0) {
//       setGameOutcome(PlayerHandResults.PUSH);
//     } else if (gameData.playerWinnings > 0) {
//       setGameOutcome(PlayerHandResults.WIN);
//       setTotalPlayerWin(
//         calculateTotalWin(
//           playerHandsData,
//           dealerHandData.points,
//           gameData.playerWinnings,
//           currentCoinSymbol,
//         ),
//       );
//     } else {
//       setGameOutcome(PlayerHandResults.LOSE);
//     }
//   }, [gameData.gameCompleted, gameData.playerWinnings, gameData.playerLosses]);

//   return (
//     <div className="relative min-h-fit w-full">
//       {/* Top Left Box */}
//       {/* <div className="absolute left-5 top-5">
//         <PastWinningHands />
//       </div> */}
//       <RecoveryDropdown oldGames={oldGames} syncGame={syncGame} />

//       <div className="relative flex flex-col items-center">
//         {/* Dealer */}
//         <div className="pointer-events-none relative top-[8px] z-20 flex w-full select-none justify-start sm:top-[12px] sm:justify-center">
//           <Image
//             src={
//               gameOutcome === PlayerHandResults.WIN
//                 ? Happy.src
//                 : gameOutcome === PlayerHandResults.LOSE
//                   ? Sad.src
//                   : Neutral.src
//             }
//             alt="Host"
//             width={328}
//             height={320}
//             className="relative left-[-25px] z-10 h-auto w-[248px] sm:left-0 sm:w-[328px]"
//           />
//           <div className="absolute left-[175px] top-0 top-[10%] flex min-h-24 w-[calc(100%-200px)] items-center justify-center rounded-lg bg-[#2e2e2e] text-center text-xs xs:text-sm sm:left-[calc(50%+80px)] sm:w-1/3 sm:max-w-80 sm:text-base">
//             <div className="space-y-2 p-2 font-sans">
//               {!gameData.activeGame ? (
//                 <>
//                   <h4>Welcome {name}!</h4>
//                   <p>
//                     Select the chips you want to wager and then place your bet
//                     to get started :{")"}
//                   </p>
//                 </>
//               ) : gameData.gameCompleted && gameOutcome ? (
//                 <>
//                   <h3>{gameOutcomeText[gameOutcome].header}</h3>
//                   <div className="flex flex-col items-center justify-center">
//                     <span>{gameOutcomeText[gameOutcome].text}</span>
//                     {gameOutcome === PlayerHandResults.WIN && (
//                       <span className="font-semibold">
//                         {" "}
//                         {totalPlayerWin > 10000
//                           ? formatAmount(BigNumber(totalPlayerWin))
//                           : totalPlayerWin}{" "}
//                         {currentCoinSymbol}
//                       </span>
//                     )}
//                   </div>
//                 </>
//               ) : (
//                 <h4>What would you like to do now, {name}?</h4>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="bg-table relative flex h-[342px] w-full max-w-[1100px] flex-col items-center justify-center border-y-[10px] border-[#311D0B] shadow-[inset_0_4px_8px_0_rgba(0,0,0,0.64)] sm:rounded-full sm:border-[21px]">
//           <div className="relative h-full w-full py-2 sm:w-9/12">
//             <GameLayout
//               gameData={gameData}
//               dealerHandData={dealerHandData}
//               playerHandsData={playerHandsData}
//               originalBetSize={originalBetSize}
//               triggerEndGame={triggerEndGame}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Table;
