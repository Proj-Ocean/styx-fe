import React from "react";
import Card from "./Card";
import { card, CardProps as cardInterface } from './types'
import styles from './styles/Hand.module.css';

interface DealerHandProps {
    cards: cardInterface[]
}

const DealerHand: React.FC<DealerHandProps> = ({ cards }) => {
    const renderCards = (card: any, index: any) => {
      
        if (card.isHoleCard) {
          return <Card key={`hole-card-${index}`} image={card.image} value="Hole Card" suit="" hidden={card.hidden}/>;
        }
        return <Card key={index} value={card.value} image={card.image} suit={card.suit} hidden={card.hidden}/>;
      };
      return (
        <div className={styles.cardContainer}>
          {cards.map(renderCards)}
        </div>
      )
  };
  
  export default DealerHand;