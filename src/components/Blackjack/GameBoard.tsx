import Card from "./Card";
import DealerHand from "./DealerHand";
import PlayerHand from "./PlayerHand";
import { CardProps, card as cardInterface } from './types'
import { useEffect, useState, Fragment } from "react";

interface BlackjackTableProps {
    // dealerCards: cardInterface[],
    // playerCards: cardInterface[],
    dealerCards: CardProps[],
    playerCards: CardProps[],
    dealerScore: number|string|null,
    playerScore: number|string|null,
}

const GameBoard: React.FC<BlackjackTableProps> = ({ dealerCards, playerCards, dealerScore, playerScore }) => {
    return (
        <div>
            <Fragment>
              <ul className="half-board banker-half">
                  {/* {dealerCards.map((card, index) => 
                      <li key={index}>
                          <Card
                              image={card.image}
                              value={card.value}
                              suit={card.suit}
                            //   code={card.code}
                              hidden={card.hidden}
                          ></Card>
                      </li>
                  )} */}
                  <DealerHand cards={dealerCards} />
                  { (dealerCards.length) ? <p className="text-center text-gray-700 text-[12px] mt-1">Dealer Score: {dealerScore}</p> : null }

              </ul>
              <ul className="half-board player-half">
              <p className="text-center text-gray-700 text-[12px] my-10">Blackjack pays 3 to 2 - ♠ ♣ ♥ ♦ - Dealer hits on soft 17</p>
                <PlayerHand cards={playerCards} />
                { (playerCards.length) ? <p className="text-center text-gray-700 text-[12px] mt-1">Player Score: {playerScore}</p> : null }
                  {/* {playerCards.map((card, index) => 
                      <li key={index}>
                          <Card
                              image={card.image}
                              value={card.value}
                              suit={card.suit}
                            //   code={card.code}
                              hidden={card.hidden}
                          ></Card>
                      </li>
                  )} */}
              </ul>
            </Fragment>
        </div>
    )
}
export default GameBoard