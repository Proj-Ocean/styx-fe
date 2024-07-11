export type NewGameProps = {
    game_id: string,
    player: string,
    bet_size: number
};

export type PlayerHandProps = {
    bet_size: number,
    cards: Array<number>,
    status: string,
    current_sum: number,
    is_settled: boolean,
    is_doubled: boolean,
    is_natural_blackjack: boolean,
};

export type MoveCompletedProps = {
    game_id: string,
    player_hands: Array<PlayerHandProps>,
    dealer_cards: Array<number>,
};

export type GameOutcomeProps = {
    game_id: string,
    player: string,
    player_hands: Array<PlayerHandProps>,
    dealer_cards: Array<number>,
    player_won: string,
    player_lost: string,
};

export type BlackjackGameData = {
    activeGame: boolean,
    gameId: string,
    gameSeed: string,
    gameBetSize: number,
    totalBetSize: number,
    playerWinnings: number,
    playerLosses: number,
    gameCompleted: boolean,
};

export type DealerHandData = {
    cards: Array<number>,
    points: number[],
};

export type PlayerHandData = {
    cards: Array<number>,
    bet: number,
    splitAvailable: boolean,
    doubleAvailable: boolean,
    isDoubled: boolean,
    isNaturalBlackjack: boolean,
    points: number[],
    indicator: boolean,
    status: string
};

interface card {
    "image": string,
    "value": string,
    "suit": string,
    "code": string,
}

type CardProps = {
    image: string;
    value: string;
    suit: string;
    hidden: boolean;
  };

interface link {
    label: string,
    path: string
}

export type { card, CardProps, link }