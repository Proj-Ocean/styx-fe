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
