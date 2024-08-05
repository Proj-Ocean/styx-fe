module styx::game {
    use std::signer;

    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::event;
    
    use styx::house;
    
    // ERRORS
    
    const EGameNotApproved: u64 = 101;
    const EBetAmountIsZero: u64 = 102;
    const EBetAmountLessThanMinimum: u64 = 103;
    const EBetAmountGreaterThanMaximum: u64 = 104;
    const EPlayerInsufficientBalance: u64 = 105;
    
    // STRUCTS

    struct Game has store {
        player_address: address,
        bet: Coin<AptosCoin>
    }
    
    // EVENTS 

    #[event]
    struct GameResolved has drop, store {
        player_address: address,
        payout: u64
    }

    // CONSTRUCTORS
    
    public fun create_game<GameType: drop>(player: &signer, bet_amount: u64, _witness: GameType): Game {
        assert_game_is_approved<GameType>();
        assert_bet_is_valid(bet_amount);
        
        let player_address = signer::address_of(player);
        assert_player_has_enough_balance(player_address, bet_amount);
        
        Game {
            player_address,
            bet: coin::withdraw<AptosCoin>(player, bet_amount)
        }
    }

    // ACCESSORS

    public fun resolve_game<GameType: drop>(
        game: Game, 
        payout_numerator: u64, 
        payout_denominator: u64, 
        witness: GameType
    ) {
        let Game {
            player_address,
            bet,
        } = game;
        
        let player_balance_before = coin::balance<AptosCoin>(player_address);

        house::pay_out(player_address, bet, payout_numerator, payout_denominator, witness);

        let player_balance_after = coin::balance<AptosCoin>(player_address);
        let payout = if(player_balance_after > player_balance_before) {
            player_balance_after - player_balance_before
        } else {
            0
        };
        
        event::emit(GameResolved {
            player_address,
            payout
        });
    }
    
    public fun get_player_address(game: &Game): address {
        game.player_address
    }
    
    public fun get_bet_amount(game: &Game): u64 {
        coin::value(&game.bet)
    }

    // ASSERTIONS
    
    fun assert_game_is_approved<GameType: drop>() {
        assert!(house::is_game_approved<GameType>(), EGameNotApproved);
    }
    
    fun assert_bet_is_valid(amount: u64) {
        assert!(amount > 0, EBetAmountIsZero);
        assert!(amount >= house::get_min_bet(), EBetAmountLessThanMinimum);
        assert!(amount <= house::get_max_bet(), EBetAmountGreaterThanMaximum);
    }

    fun assert_player_has_enough_balance(player_address: address, amount: u64) {
        assert!(coin::balance<AptosCoin>(player_address) >= amount, EPlayerInsufficientBalance);
    }
}
