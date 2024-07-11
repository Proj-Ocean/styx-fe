import React from "react";
import Card from "./Card";
import { CardProps, card as cardInterface } from './types'
import styles from './styles/Hand.module.css';

interface PlayerHandProps {
  // cards: cardInterface[]
  cards: CardProps[]
}
const PlayerHand: React.FC<PlayerHandProps> = ({ cards }) => {
  return (
    <>
      <div className={styles.cardContainer}>
      {cards &&
        cards.map((card, index) => {
          return (
            <li key={index}>
                <Card image={card.image} value={card.value} suit={card.suit} hidden={card.hidden}/>
            </li>
          )
        })}
      </div>
    </>
  );
};

export default PlayerHand;