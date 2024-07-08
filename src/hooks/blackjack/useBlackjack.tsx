import { TLoadState } from "../../../type";
import axios from "axios";
import { randomBytes } from "crypto";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  checkCardDoubleAvailable,
  checkCardSplitAvailable,
  checkGameSettled,
  getCardSums,
  PlayerActions,
} from "@/components/Games/Blackjack/utils";
import { AuthType, useAuth } from "@/lib/auth";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEnokiFlow } from "@mysten/enoki/react";
import { SuiEvent } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import {
  BLACKJACK_CORE_PACKAGE_ID,
  BLACKJACK_MODULE_NAME,
  BLACKJACK_INIT_GAME_TARGET,
  BLACKJACK_PLAYER_MOVE_TARGET,
  BLACKJACK_VERIFIER_OBJ,
  UNI_HOUSE_OBJ,
  RECORD_LEADERBOARD_TARGET,
  BLACKJACK_GAME_TYPE,
  LEADERBOARD_OBJ,
  REDEEM_VOUCHER_TARGET,
  CLOCK_OBJ,
  PROVE_VOUCHER_IS_USED_AND_RECORD_LEADERBOARD_TARGET,
  PROVE_VOUCHER_IS_USED_TARGET,
} from "@/utils/apiConstantsMainnet";
import {
  CoinInfos,
  getCoinTypeBySymbol,
  getInputCoins,
  VALID_LEADERBOARD_COIN_LIST,
  ACCEPT_ASSETS_SYMBOL,
  isAcceptedCoinType,
} from "@/utils/coinHelpers";
import { provider } from "@/client/suiClient";
import {
  NewGameProps,
  PlayerHandProps,
  MoveCompletedProps,
  GameOutcomeProps,
  BlackjackGameData,
  DealerHandData,
  PlayerHandData,
} from "@/components/Games/Blackjack/types";
import {
  setSavedGameId,
  clearSavedGameId,
  getSavedGameSession,
  addPastHands,
} from "../../components/Games/Blackjack/utilsSavedData";
import { useRouter, useSearchParams } from "next/navigation";
import useVoucher from "@/hooks/useVoucher";
import { useCoinTypeStore } from "@/store/coinTypeStore";
import { useBalances } from "../useBalances";
import useGameHistory from "../bethistory/useGameHistory";
import {
  EVENTS,
  GAMES,
  BET_TYPE,
  GAME_OUTCOME,
} from "@/constants/metricsConstants";
import { MetricsTracker } from "@/utils/metricsTracker";
import { useUserInfoStore } from "@/store/userInfoStore";
import { bcs } from "@mysten/sui/bcs";

enum GameEmitEvents {
  NEW_GAME = "NewGame",
  MOVE_COMPLETED = "MoveCompleted",
  GAME_OUTCOME = "GameOutcome",
}

enum ErrorEvents {
  GAME_INIT_ERROR = "Error occurred during Blackjack game initialization.",
  INSUFFICIENT_BALANCE = "Not enough coins in the wallet.",
  PLAYER_MOVE_ERROR = "Error occurred processing the player move.",
}

type GasCoinParams = {
  digest?: string;
  objectId?: string;
  version?: string;
};

export const BLACKJACK_TIMEOUT = 5_000;
export const UNSETTLED_GAME_WIN_LOSS = -1;

export const useBlackjack = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadState, setLoadState] = useState<TLoadState>(false);
  const [gasCoinParams, setGasCoinParams] = useState<GasCoinParams>({});
  const initialGameData: BlackjackGameData = {
    activeGame: false,
    gameId: "",
    gameSeed: "",
    gameBetSize: 0,
    totalBetSize: 0,
    playerWinnings: UNSETTLED_GAME_WIN_LOSS,
    playerLosses: UNSETTLED_GAME_WIN_LOSS,
    gameCompleted: false,
  };
  const initialDealerHandData: DealerHandData = {
    cards: [],
    points: [0],
  };
  const initialPlayerHandData: PlayerHandData = {
    cards: [],
    bet: 0,
    splitAvailable: false,
    doubleAvailable: false,
    isDoubled: false,
    isNaturalBlackjack: false,
    points: [0],
    indicator: false,
    status: "100",
  };
  const { voucherId, usingVoucher } = useVoucher();

  const [gameData, setGameData] = useState(initialGameData);
  const [dealerHandData, setDealerHandData] = useState<DealerHandData>(
    initialDealerHandData,
  );
  const [playerHandsData, setPlayerHandsData] = useState<Array<PlayerHandData>>(
    [initialPlayerHandData],
  );

  const [originalBetSize, setOriginalBetSize] = useState(0);
  let { currentCoinSymbol, setCurrentCoin } = useCoinTypeStore();
  const { refetchBalances } = useBalances();
  const { refetchGameHistory: refetchGameHistory } =
    useGameHistory("blackjack");
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) => {
      return await provider.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });
    },
  });
  const auth = useAuth();
  const enokiFlow = useEnokiFlow();
  const address = auth?.address || "";
  const username = useUserInfoStore((state) => state.username);

  ////////////////////////////
  // State Change Listeners //
  ////////////////////////////

  useEffect(() => {
    // Handle game recovery
    syncGame();
  }, []);

  useEffect(() => {
    // Handle game completion fallback
    if (gameData.gameCompleted) return;
    if (!checkGameSettled(gameData.playerLosses, gameData.playerWinnings)) {
      return;
    }

    const fallbackDelay = 10_000;

    const timeoutId = setTimeout(triggerEndGame, fallbackDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [gameData.playerWinnings, gameData.playerLosses, gameData.gameCompleted]);

  ////////////////////
  // Event Handlers //
  ////////////////////

  const handleGameStart = async (betSize: number) => {
    if (!auth) {
      toast.warning("Please connect your wallet.");
      return;
    }
    if (loadState) return;
    // Reset just in case
    setGasCoinParams({});

    // Setup transaction block
    const txb = new Transaction();
    const userRandomness = randomBytes(512);
    let targetBetSize =
      betSize *
      (CoinInfos.find((coin) => coin.symbol === currentCoinSymbol)?.factor ??
        1) *
      10 **
        (CoinInfos.find((coin) => coin.symbol === currentCoinSymbol)?.decimal ??
          9);
    const coinType = getCoinTypeBySymbol(currentCoinSymbol);

    let stakeCoins;
    if (!usingVoucher) {
      stakeCoins = await getInputCoins(txb, address, coinType, [targetBetSize]);
    }
    let stakeCoin;
    let voucherReceipt;
    if (usingVoucher) {
      let [voucherCoin, voucherReceiptArg] = txb.moveCall({
        target: REDEEM_VOUCHER_TARGET,
        typeArguments: [coinType],
        arguments: [
          txb.object(UNI_HOUSE_OBJ),
          txb.object(voucherId),
          txb.object(CLOCK_OBJ),
          txb.pure.u64(targetBetSize),
          // txb.pure(targetBetSize),
        ],
      });
      stakeCoin = voucherCoin;
      voucherReceipt = voucherReceiptArg;
    } else {
      if (!stakeCoins) {
        executePlayerMoveFailure("", ErrorEvents.INSUFFICIENT_BALANCE);
        return;
      }
      stakeCoin = stakeCoins[0];
    }

    if (stakeCoin) {
      let [_, receipt] = txb.moveCall({
        target: `${BLACKJACK_INIT_GAME_TARGET}`,
        typeArguments: [coinType],
        arguments: [
          txb.object(UNI_HOUSE_OBJ),
          txb.object(BLACKJACK_VERIFIER_OBJ),
          txb.pure.u64(targetBetSize),
          // txb.pure(targetBetSize, "u64"),
          stakeCoin,
          txb.pure(bcs.vector(bcs.U8).serialize(Array.from(userRandomness))), // seed
          // txb.pure(Array.from(userRandomness), "vector<u8>"), // seed
        ],
      });
      // Record in leaderboard only for valid assets
      if (VALID_LEADERBOARD_COIN_LIST.includes(coinType)) {
        if (usingVoucher && voucherReceipt) {
          txb.moveCall({
            target: PROVE_VOUCHER_IS_USED_AND_RECORD_LEADERBOARD_TARGET,
            typeArguments: [coinType, BLACKJACK_GAME_TYPE],
            arguments: [
              txb.object(LEADERBOARD_OBJ),
              voucherReceipt,
              receipt,
              txb.pure.address(address),
            ],
          });
        } else {
          txb.moveCall({
            target: RECORD_LEADERBOARD_TARGET,
            typeArguments: [coinType, BLACKJACK_GAME_TYPE],
            arguments: [
              txb.object(LEADERBOARD_OBJ),
              receipt,
              txb.pure.address(address),
            ],
          });
        }
      } else {
        if (usingVoucher && voucherReceipt) {
          txb.moveCall({
            target: PROVE_VOUCHER_IS_USED_TARGET,
            typeArguments: [coinType, BLACKJACK_GAME_TYPE],
            arguments: [voucherReceipt, receipt],
          });
        }
      }
    }

    MetricsTracker.track(EVENTS.CLICK_PLACE_BET, {
      game_type: GAMES.BLACKJACK,
      asset_type: currentCoinSymbol,
      selected_asset_balance: currentCoinSymbol,
      bet_amount: targetBetSize,
      bet_number: 1,
      bet_type: BET_TYPE.BLACKJACK,
    });

    // Prepare for execution
    setLoadState("Confirming");

    if (auth?.type === AuthType.WALLET) {
      // Execute using the browser extension wallet
      signAndExecuteTransaction(
        {
          transaction: txb as any,
        },
        {
          onSuccess: async (res) => {
            setLoadState("Executing");

            setGasCoinParams(
              res.effects?.gasObject?.reference as GasCoinParams,
            );
            if (res.effects?.status.status == "failure") {
              setLoadState(false);
              executePlayerMoveFailure(
                res.effects.status.error,
                ErrorEvents.INSUFFICIENT_BALANCE,
              );
              return;
            }

            MetricsTracker.track(EVENTS.EXECUTE_BET_TXN, {
              asset_type: currentCoinSymbol,
              game_type: GAMES.BLACKJACK,
              bet_amount: targetBetSize,
              transaction_success: res.effects?.status.status === "success",
              username,
            });

            toast.success("Bet placed successfully. Game starting!");
            refetchBalances();
            const payload = res.events?.filter(
              (value) =>
                value.type ===
                `${BLACKJACK_CORE_PACKAGE_ID}::${BLACKJACK_MODULE_NAME}::NewGame<${coinType}>`,
            )[0]?.parsedJson as NewGameProps;
            const game_id = payload.game_id;
            setSavedGameId(router, searchParams, game_id);
            const seed = Buffer.from(userRandomness).toString("hex");
            executePlayerMoveSuccess(
              game_id,
              seed,
              betSize,
              gameData.totalBetSize + betSize,
            );
          },
          onError: (err) => {
            console.log(err);
            setLoadState(false);
            executePlayerMoveFailure(err, err.message);
          },
        },
      );
    } else {
      // Execute using the Enoki keypair flow
      const keypair = await enokiFlow.getKeypair();
      let res = await provider.signAndExecuteTransaction({
        signer: keypair,
        transaction: txb as any,
        options: {
          showRawEffects: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });
      setGasCoinParams(res.effects?.gasObject?.reference as GasCoinParams);

      if (res.effects?.status.status == "failure") {
        setLoadState(false);
        executePlayerMoveFailure(
          res.effects.status.error,
          ErrorEvents.INSUFFICIENT_BALANCE,
        );
        return;
      }

      MetricsTracker.track(EVENTS.EXECUTE_BET_TXN, {
        asset_type: currentCoinSymbol,
        game_type: GAMES.BLACKJACK,
        bet_amount: targetBetSize,
        transaction_success: res.effects?.status.status === "success",
        username,
      });

      toast.success("Bet placed successfully. Game starting!");
      setLoadState("Executing");
      refetchBalances();
      const payload = res.events?.filter(
        (value) =>
          value.type ===
          `${BLACKJACK_CORE_PACKAGE_ID}::${BLACKJACK_MODULE_NAME}::NewGame<${coinType}>`,
      )[0]?.parsedJson as NewGameProps;
      const game_id = payload.game_id;
      setSavedGameId(router, searchParams, game_id);
      const seed = Buffer.from(userRandomness).toString("hex");
      executePlayerMoveSuccess(
        game_id,
        seed,
        betSize,
        gameData.totalBetSize + betSize,
      );
    }
  };

  const syncGame = async (gameId?: string) => {
    const savedGameData = await getSavedGameSession(
      router,
      searchParams,
      gameId,
    );
    if (savedGameData.gameSeed !== undefined) {
      if (
        savedGameData.coinType &&
        isAcceptedCoinType(savedGameData.coinType)
      ) {
        setCurrentCoin(savedGameData.coinType as ACCEPT_ASSETS_SYMBOL);
        // the above is not enough, the change won't register.
        currentCoinSymbol = savedGameData.coinType;
      } else
        console.warn(
          "During reload coin was not parsed correctly from Game type!",
        );
      setGameData({
        ...gameData,
        activeGame: true,
        gameId: savedGameData.gameId,
        gameSeed: savedGameData.gameSeed,
        gameBetSize: savedGameData.gameBetSize,
        totalBetSize: savedGameData.totalBetSize,
      });

      setOriginalBetSize(savedGameData.gameBetSize);
      updatePlayerHands(savedGameData.player_hands);
      updateDealerCards(savedGameData.dealer_cards);

      if (isDealerTurn(savedGameData.player_hands)) {
        setLoadState("Executing");
        executePlayerMoveSuccess(
          savedGameData.gameId,
          savedGameData.gameSeed,
          savedGameData.gameBetSize,
          savedGameData.totalBetSize,
        );
      }
    }
  };

  const handlePlayerMove = async (action: string, betSize: number) => {
    if (!Object.values<string>(PlayerActions).includes(action)) return;

    // Setup transaction block
    const tx = new Transaction();
    const playerAction = getPlayerAction(action);
    const coinType = getCoinTypeBySymbol(currentCoinSymbol);

    // Setup Optional<Coin> argument
    let coin_opt = undefined;
    if (betSize === 0) {
      [coin_opt] = tx.moveCall({
        target: "0x1::option::none",
        typeArguments: [`0x2::coin::Coin<${coinType}>`],
      });
    } else {
      // TODO: make generic for other coins
      let targetBetSize =
        betSize *
        (CoinInfos.find((coin) => coin.symbol === currentCoinSymbol)?.factor ??
          1) *
        10 **
          (CoinInfos.find((coin) => coin.symbol === currentCoinSymbol)
            ?.decimal ?? 9);

      const stakeCoins = await getInputCoins(tx, address, coinType, [
        targetBetSize,
      ]);
      if (!stakeCoins) {
        executePlayerMoveFailure("", ErrorEvents.INSUFFICIENT_BALANCE);
        return;
      }
      [coin_opt] = tx.moveCall({
        target: "0x1::option::some",
        typeArguments: [`0x2::coin::Coin<${coinType}>`],
        arguments: [stakeCoins[0]],
      });
    }

    tx.moveCall({
      target: `${BLACKJACK_PLAYER_MOVE_TARGET}`,
      typeArguments: [coinType],
      arguments: [
        tx.object(BLACKJACK_VERIFIER_OBJ),
        tx.pure.id(gameData.gameId),
        tx.pure.u64(playerAction),
        coin_opt,
      ],
    });

    if (
      gasCoinParams.digest &&
      gasCoinParams.objectId &&
      gasCoinParams.version
    ) {
      let item = [
        {
          digest: gasCoinParams.digest,
          objectId: gasCoinParams.objectId,
          version: gasCoinParams.version,
        },
      ];
      tx.setGasPayment(item);
    }

    // Prepare for execution
    // tx.setGasBudget(20_000_000);
    setLoadState("Confirming");
    if (auth?.type === AuthType.WALLET) {
      // Execute using the browser extension wallet
      signAndExecuteTransaction(
        {
          transaction: tx as any,
        },
        {
          onSuccess: async (res) => {
            provider.waitForTransaction({ digest: res.digest }).then(() => {
              setGasCoinParams(
                res.effects?.gasObject?.reference as GasCoinParams,
              );
              toast.success(`Successful ${action}`);
              setLoadState("Executing");
              executePlayerMoveSuccess(
                gameData.gameId,
                gameData.gameSeed,
                betSize,
                gameData.totalBetSize + betSize,
              );
            });
          },
          onError: (err) => {
            setLoadState(false);
            executePlayerMoveFailure(err, ErrorEvents.PLAYER_MOVE_ERROR);
          },
        },
      );
    } else {
      // Execute using the Enoki keypair flow
      const keypair = await enokiFlow.getKeypair();
      let res = await provider.signAndExecuteTransaction({
        signer: keypair,
        transaction: tx,
        options: {
          showRawEffects: true,
          showEffects: true,
          showEvents: true,
          showObjectChanges: true,
        },
      });

      setGasCoinParams(res.effects?.gasObject?.reference as GasCoinParams);

      // TODO: check response is valid
      if (res.effects?.status.status === "failure") {
        setLoadState(false);
        executePlayerMoveFailure({}, ErrorEvents.PLAYER_MOVE_ERROR);
        return;
      }
      toast.success(`Successful ${action}`);
      setLoadState("Executing");
      executePlayerMoveSuccess(
        gameData.gameId,
        gameData.gameSeed,
        betSize,
        gameData.totalBetSize + betSize,
      );
    }
  };

  const handleDealerMove = async (gameId: string, seed: string) => {
    const coinType = getCoinTypeBySymbol(currentCoinSymbol);

    const blackjackApi = async () => {
      try {
        const response = await axios.post("/api/blackjack/move", {
          coinType: coinType,
          gameId: gameId,
          seed: seed,
        });

        if (response.data.events as SuiEvent[]) {
          const events = response.data.events;
          const newGameEvent = events.filter(
            (e: SuiEvent) =>
              e.type ===
              `${BLACKJACK_CORE_PACKAGE_ID}::${BLACKJACK_MODULE_NAME}::${GameEmitEvents.NEW_GAME}`,
          );
          const moveCompletedEvent = events.filter(
            (e: SuiEvent) =>
              e.type ===
              `${BLACKJACK_CORE_PACKAGE_ID}::${BLACKJACK_MODULE_NAME}::${GameEmitEvents.MOVE_COMPLETED}`,
          );
          const gameOutcomeEvent = events.filter(
            (e: SuiEvent) =>
              e.type ===
              `${BLACKJACK_CORE_PACKAGE_ID}::${BLACKJACK_MODULE_NAME}::${GameEmitEvents.GAME_OUTCOME}<${coinType}>`,
          );
          return {
            newGameEvents: newGameEvent,
            moveCompletedEvents: moveCompletedEvent,
            gameOutcomeEvents: gameOutcomeEvent,
          };
        } else {
          return false;
        }
      } catch (e) {
        return false;
      }
    };

    const pollBlackjackApi = async (ms = 2000) => {
      let result = await blackjackApi();
      while (!result) {
        await wait(ms);
        result = await blackjackApi();
      }
      return result;
    };

    const wait = function (ms = 2000) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    };

    return await pollBlackjackApi(2000);
  };

  ///////////////////////
  // Private Functions //
  ///////////////////////

  const executePlayerMoveSuccess = async (
    gameId: string,
    seed: string,
    gameBetSize: number,
    totalBetSize: number,
  ) => {
    const dealerMoveResponse = await handleDealerMove(gameId, seed);

    if (
      dealerMoveResponse?.gameOutcomeEvents &&
      dealerMoveResponse?.gameOutcomeEvents.length > 0
    ) {
      setGameData({
        ...gameData,
        activeGame: true,
        gameId: gameId,
        gameSeed: seed,
        gameBetSize,
        totalBetSize,
      });
      updateGameOutcome(
        gameBetSize,
        totalBetSize,
        dealerMoveResponse.gameOutcomeEvents[0].parsedJson,
      );
    } else if (
      dealerMoveResponse?.moveCompletedEvents &&
      dealerMoveResponse?.moveCompletedEvents.length > 0
    ) {
      setGameData({
        ...gameData,
        activeGame: true,
        gameId: gameId,
        gameSeed: seed,
        gameBetSize,
        totalBetSize,
      });
      updateMoveCompleted(dealerMoveResponse.moveCompletedEvents[0].parsedJson);
    } else {
      executePlayerMoveFailure("", "Something went wrong. Please try again.");
      // TODO: fails to execute move too often and "Transaction Failed" when in
      // reality, it didn't really fail but just isn't able to get the data
      // fast enough? can take anywhere from 1 refresh to like 8. and can make
      // it seem like game is broken.

      // Goes in line with the error of if game doesn't return dealer move outcome
      // in the active game, refreshing will not work as game data was deleted for gas
      // rebate right after game so it will seem to user that game broke.
    }
    setLoadState(false);
  };

  const executePlayerMoveFailure = (err: any, message?: string) => {
    console.log("Transaction failed: ", err);
    if (message) toast.error(message);
  };

  const updateMoveCompleted = (data: MoveCompletedProps) => {
    const { player_hands, dealer_cards } = data;
    updateGame(player_hands, dealer_cards);
  };

  const updateGameOutcome = (
    gameBetSize: number,
    totalBetSize: number,
    data: GameOutcomeProps,
  ) => {
    const { dealer_cards, player_hands, player_lost, player_won } = data;
    updateGame(player_hands, dealer_cards);
    if (Number(player_won) > 0) addPastHands(player_hands); // BJ TODO: Add losing hands too
    setGameData({
      ...gameData,
      activeGame: true,
      gameBetSize,
      totalBetSize,
      playerWinnings: Number(player_won),
      playerLosses: Number(player_lost),
    });
  };

  const updateGame = (
    player_hands: Array<PlayerHandProps>,
    dealer_cards?: Array<number> | undefined,
  ) => {
    if (player_hands) updatePlayerHands(player_hands);
    if (dealer_cards) updateDealerCards(dealer_cards);
  };

  const updatePlayerHands = async (player_hands: Array<PlayerHandProps>) => {
    const handsData: Array<PlayerHandData> = [];
    let firstIndicator = true;

    const divisiveFactor =
      (CoinInfos.find((coin) => coin.symbol === currentCoinSymbol)?.factor ??
        1) *
      10 **
        (CoinInfos.find((coin) => coin.symbol === currentCoinSymbol)?.decimal ??
          9);

    player_hands.map((hand) => {
      handsData.push({
        cards: hand.cards,
        bet: +hand.bet_size / divisiveFactor,
        splitAvailable: checkCardSplitAvailable(
          hand.cards,
          player_hands.length,
        ),
        doubleAvailable: checkCardDoubleAvailable(hand.cards),
        isDoubled: hand.is_doubled,
        isNaturalBlackjack: hand.is_natural_blackjack,
        points: getCardSums(hand.cards),
        indicator:
          (hand.status === getPlayerAction("Player Move").toString() ||
            hand.status === getPlayerAction(PlayerActions.SPLIT).toString()) &&
          firstIndicator,
        status: hand.status,
      });
      firstIndicator &&= !handsData.at(-1)?.indicator; // toggle off after first indicator set
    });

    setPlayerHandsData(handsData);
  };

  const updateDealerCards = (dealer_cards: Array<number>) => {
    const handData: DealerHandData = {
      cards: [...dealer_cards],
      points: getCardSums(dealer_cards),
    };
    setDealerHandData(handData);
  };

  const getPlayerAction = (action: string) => {
    if (action == PlayerActions.HIT) {
      return 101;
    } else if (action == PlayerActions.STAND) {
      return 102;
    } else if (action == PlayerActions.DOUBLE) {
      return 103;
    } else if (action == PlayerActions.SPLIT) {
      return 104;
    } else {
      return 100; // PLAYER_ACTION
    }
  };

  const triggerEndGame = () => {
    setGameData({
      ...gameData,
      gameId: "",
      gameSeed: "",
      gameCompleted: true, // transition to end game screen
    });

    MetricsTracker.track(EVENTS.GAME_OUTCOME, {
      game_type: GAMES.BLACKJACK,
      asset_type: currentCoinSymbol,
      bet_amount: gameData.totalBetSize,
      bet_number: 1,
      bet_type: BET_TYPE.BLACKJACK,
      game_outcome:
        gameData.playerWinnings > gameData.playerLosses
          ? GAME_OUTCOME.PLAYER_WIN
          : gameData.playerWinnings < gameData.playerLosses
            ? GAME_OUTCOME.PLAYER_LOSE
            : GAME_OUTCOME.PUSH,
      pnl: gameData.playerLosses - gameData.playerWinnings,
    });
  };

  const resetGame = () => {
    refetchBalances();
    refetchGameHistory();
    setGameData(initialGameData);
    setLoadState(false);
    setDealerHandData(initialDealerHandData);
    setPlayerHandsData([initialPlayerHandData]);
    clearSavedGameId(router, searchParams);
  };

  return {
    loadState,
    originalBetSize,
    setOriginalBetSize,
    gameData,
    setGameData,
    dealerHandData,
    playerHandsData,
    handleGameStart,
    handlePlayerMove,
    executePlayerMoveSuccess,
    syncGame,
    triggerEndGame,
    resetGame,
  };
};

function isDealerTurn(playerHandsData: PlayerHandProps[]) {
  return (
    playerHandsData.some((hand) => hand.status !== "100") ||
    playerHandsData.length === 0
  );
}
