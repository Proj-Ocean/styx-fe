import { UNSETTLED_GAME_WIN_LOSS } from "@/hooks/blackjack/useBlackjack";
import { ACCEPT_ASSETS_SYMBOL, CoinInfos } from "@/utils/coinHelpers";
import { getCardSourceByValue } from "./utilsCards";
import { type PlayerHandData } from "./types";
import { randomBytes } from "crypto";
import cardBack from "@/../public/Blackjack/CardBack.svg";
import cardPosition from "@/../public/Blackjack/CardPosition.png";
import CardHandHistory from "./CardHandHistory";

export enum PlayerActions {
  HIT = "HIT",
  SPLIT = "SPLIT",
  DOUBLE = "DOUBLE",
  STAND = "STAND",
}

export enum PlayerHandResults {
  WIN = "WIN",
  LOSE = "LOSE",
  PUSH = "PUSH",
}

export const checkGameSettled = (
  playerLosses: number,
  playerWinnings: number,
) => {
  return (
    playerLosses !== UNSETTLED_GAME_WIN_LOSS ||
    playerWinnings !== UNSETTLED_GAME_WIN_LOSS
  );
};

export const checkCardSplitAvailable = (
  cards: Array<number>,
  hands: number,
) => {
  if (hands >= 4) return false;

  let valueOne = (cards[0] % 13) + 1;
  let valueTwo = (cards[1] % 13) + 1;
  if (valueOne > 10) valueOne = 10;
  if (valueTwo > 10) valueTwo = 10;
  return cards.length === 2 && valueOne === valueTwo;
};

export const checkCardDoubleAvailable = (cards: Array<number>) => {
  return cards.length === 2;
};

export const getCardSums = (cards: Array<number>) => {
  const cardSums = [];
  let cardSum = 0;
  let hasAce = false;

  for (let index = 0; index < cards.length; index++) {
    /*
            1 = Ace
            2 = 2
            3 = 3
            ...
            10 = 10
            11 = J (value 10)
            12 = Q (value 10)
            13 = K (value 10)
        */
    let cardValue = (cards[index] % 13) + 1; // this constraints index to the space [1-13]

    if (cardValue == 1) hasAce = true;
    if (cardValue > 10) cardValue = 10;
    cardSum += cardValue;
  }

  // We need to take care of the Aces case where value = 1 or 11 depending on the sum
  if (hasAce && cardSum + 10 <= 21) {
    cardSums.push(cardSum + 10);
  }

  cardSums.push(cardSum);

  return cardSums;
};

export const getPlayerHandResult = (
  dealerPoints: number,
  playerPoints: number,
  isNaturalBlackjack: boolean,
): PlayerHandResults => {
  // Order of these conditionals matters
  if (isNaturalBlackjack) {
    if (dealerPoints === 21) {
      return PlayerHandResults.PUSH;
    } else {
      return PlayerHandResults.WIN;
    }
  } else if (playerPoints > 21) {
    return PlayerHandResults.LOSE;
  } else if (
    playerPoints > dealerPoints ||
    (playerPoints <= 21 && dealerPoints > 21)
  ) {
    return PlayerHandResults.WIN;
  } else if (playerPoints === dealerPoints) {
    return PlayerHandResults.PUSH;
  } else {
    return PlayerHandResults.LOSE;
  }
};

export const calculateTotalWin = (
  playerHandsData: PlayerHandData[],
  dealerPoints: number[],
  playerWinnings: number,
  currentCoinSymbol: ACCEPT_ASSETS_SYMBOL,
) => {
  // Calculate total win with user bet included
  // TODO: Change accordingly when you change bet size to be
  // as its factor on site wide coin symbol bet refactor
  const multiFactor =
    CoinInfos.find((coin) => coin.symbol === currentCoinSymbol)?.factor ?? 1;
  const divisiveFactor =
    10 **
    (CoinInfos.find((coin) => coin.symbol === currentCoinSymbol)?.decimal ?? 9);
  let totalWin = playerWinnings / divisiveFactor;

  for (const hand of playerHandsData) {
    const handResult = getPlayerHandResult(
      dealerPoints[0],
      hand.points[0],
      hand.isNaturalBlackjack,
    );

    if (
      handResult === PlayerHandResults.WIN ||
      handResult === PlayerHandResults.PUSH
    ) {
      totalWin += hand.bet * multiFactor;
    }
  }

  return totalWin;
};

export const dealCardFaceDown = (
  cardIndex: number,
  cards: Array<React.JSX.Element>,
  setCards: Function,
): void => {
  const newDealerCardsState = cards.map((card, index) => {
    return cardIndex !== index ? (
      card
    ) : (
      <img key={index} src={cardBack.src} alt="" />
    );
  });
  setCards(newDealerCardsState);
};

export const getCardPlacements = (index: number): React.JSX.Element => {
  return (
    <img
      className="hover:bg-green-400 md:mx-1 lg:mx-2 xl:mx-3"
      src={cardPosition.src}
      alt=""
    />
  );
};

export const getCardByValue = (value: number): React.JSX.Element => {
  const cardSource = getCardSourceByValue(value);
  return (
    <div className="group ease-in perspective md:mx-1 lg:mx-2 xl:mx-3">
      <div className="relative h-full w-full duration-1000 preserve-3d group-hover:rotate-y-180">
        <div className="relative h-full w-full backface-hidden">
          <img key={value} src={cardSource} alt={`${value}`} />
        </div>
        <div
          key={value}
          className="absolute top-0 h-full w-full rotate-y-180 backface-hidden"
        >
          <img key={value} src={getCardSourceByValue(52)} alt={`${value}`} />
        </div>
      </div>
    </div>
  );
};

export const getPlainCardByValue = (value: number): React.JSX.Element => {
  const cardSource = getCardSourceByValue(value);
  return <img src={cardSource} alt={`${value}`} />;
};

export const getDialogHands = (
  hands: Array<Array<number>>,
): Array<React.JSX.Element> => {
  const dom = [];
  const rows = [];
  for (let handIndex = 0; handIndex < hands.length; handIndex++) {
    rows.push(
      <CardHandHistory
        key={handIndex}
        separator={20}
        cards={hands[handIndex]}
      />,
    );
  }
  dom.push(
    <div
      key={randomBytes(6).toString()}
      className="flex h-16 w-full flex-col gap-[70px] px-5"
    >
      {rows}
    </div>,
  );
  return dom;
};
