module styx::card {
    use std::vector;
    use aptos_framework::randomness;

    // CONSTANTS 
    
    const MIN_RANK: u8 = 1;
    const MAX_RANK: u8 = 13;
    
    const MIN_SUIT: u8 = 0;
    const MAX_SUIT: u8 = 3;
    
    // ERRORS
    
    const ERankIsInvalid: u64 = 1;
    const ESuitIsInvalid: u64 = 2;

    // STRUCTS

    struct Card has copy, drop, store {
        rank: u8,
        suit: u8,
    }
    
    // CONSTRUCTORS 
    
    public fun create(rank: u8, suit: u8): Card {
        assert!(rank >= MIN_RANK && rank <= MAX_RANK, ERankIsInvalid);
        assert!(suit >= MIN_SUIT && suit <= MAX_SUIT, ESuitIsInvalid);
        Card { rank, suit }
    }

    // TODO: fix these lint warnings, in a testable way (good luck)
    
    #[lint::allow_unsafe_randomness]
    public fun create_random_card(): Card {
        create(randomness::u8_range(MIN_RANK, MAX_RANK + 1), randomness::u8_range(MIN_SUIT, MAX_SUIT + 1))
    }
    
    #[lint::allow_unsafe_randomness]
    public fun create_random_cards(n: u32): vector<Card> {
        let cards = vector::empty<Card>();
        for (i in 0..n) {
            vector::push_back(&mut cards, create_random_card());
        };
        cards
    }
    
    // ACCESSORS

    public fun get_suit(card: &Card): u8 {
        card.suit
    }

    public fun get_rank(card: &Card): u8 {
        card.rank
    }
    
    public fun min_rank(): u8 {
        MIN_RANK
    }
    
    public fun max_rank(): u8 {
        MAX_RANK
    }
    
    public fun min_suit(): u8 {
        MIN_SUIT
    }
    
    public fun max_suit(): u8 {
        MAX_SUIT
    }
}
