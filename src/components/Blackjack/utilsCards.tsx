// import cardPosition from '@/../public/Blackjack/CardPosition.png';
// import cardBack from '@/../public/Blackjack/CardBack.svg';
import cardPosition from '@/../public/deck/Hole-Card.png';
import holeCard from '@/../public/deck/hole-card.svg'; 
import card0 from '@/../public/deck/0.svg';
import card1 from '@/../public/deck/1.svg';
import card2 from '@/../public/deck/2.svg';
import card3 from '@/../public/deck/3.svg';
import card4 from '@/../public/deck/4.svg';
import card5 from '@/../public/deck/5.svg';
import card6 from '@/../public/deck/6.svg';
import card7 from '@/../public/deck/7.svg';
import card8 from '@/../public/deck/8.svg';
import card9 from '@/../public/deck/9.svg';
import card10 from '@/../public/deck/10.svg';
import card11 from '@/../public/deck/11.svg';
import card12 from '@/../public/deck/12.svg';
import card13 from '@/../public/deck/13.svg';
import card14 from '@/../public/deck/14.svg';
import card15 from '@/../public/deck/15.svg';
import card16 from '@/../public/deck/16.svg';
import card17 from '@/../public/deck/17.svg';
import card18 from '@/../public/deck/18.svg';
import card19 from '@/../public/deck/19.svg';
import card20 from '@/../public/deck/20.svg';
import card21 from '@/../public/deck/21.svg';
import card22 from '@/../public/deck/22.svg';
import card23 from '@/../public/deck/23.svg';
import card24 from '@/../public/deck/24.svg';
import card25 from '@/../public/deck/25.svg';
import card26 from '@/../public/deck/26.svg';
import card27 from '@/../public/deck/27.svg';
import card28 from '@/../public/deck/28.svg';
import card29 from '@/../public/deck/29.svg';
import card30 from '@/../public/deck/30.svg';
import card31 from '@/../public/deck/31.svg';
import card32 from '@/../public/deck/32.svg';
import card33 from '@/../public/deck/33.svg';
import card34 from '@/../public/deck/34.svg';
import card35 from '@/../public/deck/35.svg';
import card36 from '@/../public/deck/36.svg';
import card37 from '@/../public/deck/37.svg';
import card38 from '@/../public/deck/38.svg';
import card39 from '@/../public/deck/39.svg';
import card40 from '@/../public/deck/40.svg';
import card41 from '@/../public/deck/41.svg';
import card42 from '@/../public/deck/42.svg';
import card43 from '@/../public/deck/43.svg';
import card44 from '@/../public/deck/44.svg';
import card45 from '@/../public/deck/45.svg';
import card46 from '@/../public/deck/46.svg';
import card47 from '@/../public/deck/47.svg';
import card48 from '@/../public/deck/48.svg';
import card49 from '@/../public/deck/49.svg';
import card50 from '@/../public/deck/50.svg';
import card51 from '@/../public/deck/51.svg';
import card52 from '@/../public/deck/52.svg';

export const getCardSourceByValue = (
    value: number
) => {
    let cardSource = cardPosition.src;
    switch(value) {
        case 0:
            cardSource = card0.src;
            break;
        case 1:
            cardSource = card1.src;
            break;
        case 2:
            cardSource = card2.src;
            break;
        case 3:
            cardSource = card3.src;
            break;
        case 4:
            cardSource = card4.src;
            break;
        case 5:
            cardSource = card5.src;
            break;
        case 6:
            cardSource = card6.src;
            break;
        case 7:
            cardSource = card7.src;
            break;
        case 8:
            cardSource = card8.src;
            break;
        case 9:
            cardSource = card9.src;
            break;
        case 10:
            cardSource = card10.src;
            break;
        case 11:
            cardSource = card11.src;
            break;
        case 12:
            cardSource = card12.src;
            break;
        case 13:
            cardSource = card13.src;
            break;
        case 14:
            cardSource = card14.src;
            break;
        case 15:
            cardSource = card15.src;
            break;
        case 16:
            cardSource = card16.src;
            break;
        case 17:
            cardSource = card17.src;
            break;
        case 18:
            cardSource = card18.src;
            break;
        case 19:
            cardSource = card19.src;
            break;
        case 20:
            cardSource = card20.src;
            break;
        case 21:
            cardSource = card21.src;
            break;
        case 22:
            cardSource = card22.src;
            break;
        case 23:
            cardSource = card23.src;
            break;
        case 24:
            cardSource = card24.src;
            break;
        case 25:
            cardSource = card25.src;
            break;
        case 26:
            cardSource = card26.src;
            break;
        case 27:
            cardSource = card27.src;
            break;
        case 28:
            cardSource = card28.src;
            break;
        case 29:
            cardSource = card29.src;
            break;
        case 30:
            cardSource = card30.src;
            break;
        case 31:
            cardSource = card31.src;
            break;
        case 32:
            cardSource = card32.src;
            break;
        case 33:
            cardSource = card33.src;
            break;
        case 34:
            cardSource = card34.src;
            break;
        case 35:
            cardSource = card35.src;
            break;
        case 36:
            cardSource = card36.src;
            break;
        case 37:
            cardSource = card37.src;
            break;
        case 38:
            cardSource = card38.src;
            break;
        case 39:
            cardSource = card39.src;
            break;
        case 40:
            cardSource = card40.src;
            break;
        case 41:
            cardSource = card41.src;
            break;
        case 42:
            cardSource = card42.src;
            break;
        case 43:
            cardSource = card43.src;
            break;
        case 44:
            cardSource = card44.src;
            break;
        case 45:
            cardSource = card45.src;
            break;
        case 46:
            cardSource = card46.src;
            break;
        case 47:
            cardSource = card47.src;
            break;
        case 48:
            cardSource = card48.src;
            break;
        case 49:
            cardSource = card49.src;
            break;
        case 50:
            cardSource = card50.src;
            break;
        case 51:
            cardSource = card51.src;
            break;
        case 52:
            cardSource = card52.src;
            break;
        default:
            cardSource = holeCard.src;
            break;
    }
    return cardSource;
}

export {
    card0,
    card1,
    card2,
    card3,
    card4,
    card5,
    card6,
    card7,
    card8,
    card9,
    card10,
    card11,
    card12,
    card13,
    card14,
    card15,
    card16,
    card17,
    card18,
    card19,
    card20,
    card21,
    card22,
    card23,
    card24,
    card25,
    card26,
    card27,
    card28,
    card29,
    card30,
    card31,
    card32,
    card33,
    card34,
    card35,
    card36,
    card37,
    card38,
    card39,
    card40,
    card41,
    card42,
    card43,
    card44,
    card45,
    card46,
    card47,
    card48,
    card49,
    card50,
    card51,
    card52,
};
