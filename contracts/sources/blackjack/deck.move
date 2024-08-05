module styx::deck {
    use std::vector;
    
    use aptos_framework::randomness;
    use styx::card;

    use styx::card::Card;

    // ERRORS
    
    const EDeckIsEmpty: u64 = 1;
    const ENotEnoughCards: u64 = 2;
    
    // STRUCTS
    
    struct Deck has copy, drop, store {
        cards: vector<Card>
    }

    // CONSTRUCTORS
    
    public fun build_deck(): Deck {
        let cards: vector<Card> = vector[];
        for (suit in card::min_suit()..(card::max_suit() + 1)) {
            for (rank in card::min_rank()..(card::max_rank() + 1)) {
                vector::push_back(&mut cards, card::create(rank, suit));
            }
        };
        Deck {
            cards,
        }
    }

    // ACCESSORS

    // TODO: fix these lint warnings, in a testable way (good luck)
    
    #[lint::allow_unsafe_randomness]
    public fun shuffle_deck(deck: &mut Deck) {
        let cards_length = vector::length(&deck.cards);
        let permutation = randomness::permutation(cards_length);
        let new_cards: vector<Card> = vector[];
        for (i in 0..cards_length) {
            vector::push_back(
                &mut new_cards, 
                *vector::borrow(&deck.cards, *vector::borrow(&permutation, i))
            );
        };
        deck.cards = new_cards;
    }
    
    public fun draw_card(deck: &mut Deck): Card {
        assert!(vector::length(&deck.cards) > 0, EDeckIsEmpty);
        vector::pop_back(&mut deck.cards)
    }
    
    public fun draw_cards(deck: &mut Deck, n: u64): vector<Card> {
        assert!(vector::length(&deck.cards) >= n, ENotEnoughCards);
        let cards: vector<Card> = vector[];
        for (i in 0..n) {
            vector::push_back(&mut cards, draw_card(deck));
        };
        cards
    }
    
    public fun get_cards(deck: &Deck): vector<Card> {
        deck.cards
    }
}
