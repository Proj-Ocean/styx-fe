import React from "react";
import Card from "./Card";
import { CardProps, card as cardInterface } from './types'
import styles from './styles/Hand.module.css';
import {card52} from "./utilsCards";

interface PlayerHandProps {
  // cards: cardInterface[]
  cards: CardProps[]
}
const Deck: React.FC = () => {
  return (
    <>
      <div className={styles.cardContainer}>
        <img className={styles.deckSize} src={card52.src} alt="deck" />
      </div>
    </>
  );
};

export default Deck;