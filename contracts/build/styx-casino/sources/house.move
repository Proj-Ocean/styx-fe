module styx::house {
    use std::option;
    use std::signer;
    use std::string;
    use aptos_std::math64;

    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin::{Self, Coin, MintCapability, BurnCapability, FreezeCapability};
    
    friend styx::game;

    // CONSTANTS 

    const ACCOUNT_SEED: vector<u8> = b"styx";
    const FEE_BPS_DIVISOR: u64 = 10000;
    
    // ERRORS 

    const ESignerNotDeployer: u64 = 101;
    const ESignerNotAdmin: u64 = 102;
    const EInsufficientBalance: u64 = 103;
    const EAmountInvalid: u64 = 104;
    const EGameNotApproved: u64 = 105;
    const EGameAlreadyApproved: u64 = 106;
    const EHouseInsufficientBalance: u64 = 107;
    const EBetLessThanMinBet: u64 = 108;
    const EBetExceedsMaxBet: u64 = 109;
    const EBetExceedsMaxMultiplier: u64 = 110;

    // STRUCTS

    struct House has key {
        admin_address: address,
        signer_cap: SignerCapability,
        min_bet: u64,
        max_bet: u64,
        max_multiplier: u64,
    }
    
    struct ApprovedGame<phantom GameType: drop> has key {
        // vig basis points
        fee_bps: u64,
    }
    
    struct HouseShares has drop {}
    
    struct HouseSharesCaps has key {
        mint_cap: MintCapability<HouseShares>,
        burn_cap: BurnCapability<HouseShares>,
        freeze_cap: FreezeCapability<HouseShares>,
    }
    
    // CONSTRUCTORS

    public entry fun init(
        deployer: &signer,
        initial_coins: u64,
        min_bet: u64,
        max_bet: u64,
        max_multiplier: u64,
    )
    acquires HouseSharesCaps {
        assert_signer_is_deployer(deployer);

        let (resourse_acc, signer_cap) = account::create_resource_account(deployer, ACCOUNT_SEED);

        coin::register<AptosCoin>(&resourse_acc);
        
        let (burn_cap, freeze_cap, mint_cap) = coin::initialize<HouseShares>(
            deployer,
            string::utf8(b"House Stake"),
            string::utf8(b"STAKE"),
            8,
            true
        );

        move_to(&resourse_acc, House {
            admin_address: signer::address_of(deployer),
            signer_cap,
            min_bet,
            max_bet,
            max_multiplier,
        });
        
        move_to(&resourse_acc, HouseSharesCaps {
            mint_cap,
            burn_cap,
            freeze_cap
        });

        deposit(deployer, initial_coins);
    }
    

    // ACCESSORS

    public(friend) fun pay_out<GameType: drop>(
        bettor: address,
        bet: Coin<AptosCoin>,
        payout_numerator: u64,
        payout_denominator: u64,
        _witness: GameType
    )
    acquires House, ApprovedGame {
        assert_game_is_approved<GameType>();
        
        let house = borrow_global_mut<House>(get_house_address());
        
        let bet_amount = coin::value(&bet);
        assert_bet_is_valid(house, bet_amount);
        assert_payout_is_valid(house, payout_numerator, payout_denominator);
        
        coin::deposit(get_house_address(), bet);
        assert_house_has_enough_balance(bet_amount, payout_numerator, payout_denominator);
        
        let approved_game = borrow_global<ApprovedGame<GameType>>(get_house_address());
        
        let fee = bet_amount * approved_game.fee_bps / FEE_BPS_DIVISOR;
        
        if(payout_numerator > 0) {
            let payout = math64::mul_div(bet_amount, payout_numerator, payout_denominator) - fee;
            coin::deposit(
                bettor, 
                coin::withdraw<AptosCoin>(&account::create_signer_with_capability(&house.signer_cap), payout)
            );
        }
    }

    // ADMIN 

    public fun approve_game<GameType: drop>(signer: &signer, fee_bps: u64, _witness: GameType) acquires House {
        assert_signer_is_admin(signer);
        assert_game_is_not_approved<GameType>();
        let house = borrow_global<House>(get_house_address());
        move_to(&account::create_signer_with_capability(&house.signer_cap), ApprovedGame<GameType> {
            fee_bps
        });
    }
    
    public entry fun revoke_game<GameType: drop>(signer: &signer) acquires House, ApprovedGame {
        assert_signer_is_admin(signer);
        assert_game_is_approved<GameType>();
        let ApprovedGame<GameType> { fee_bps: _} = move_from<ApprovedGame<GameType>>(get_house_address());
    }
    
    // house stuff
    public entry fun deposit(signer: &signer, amount: u64) acquires HouseSharesCaps {
        assert_coin_amount_valid(amount);
        let player_address = signer::address_of(signer);
        assert_signer_has_sufficient_balance<AptosCoin>(player_address, amount);
        if(!coin::is_account_registered<HouseShares>(player_address)) {
            coin::register<HouseShares>(signer);
        };
        coin::deposit(player_address, coin::mint(
            get_house_shares_amount_from_deposit_amount(amount),
            &borrow_global<HouseSharesCaps>(get_house_address()).mint_cap
        ));
        coin::transfer<AptosCoin>(signer, get_house_address(), amount);
    }

    public entry fun withdraw(signer: &signer, shares_amount: u64) acquires House, HouseSharesCaps {
        assert_coin_amount_valid(shares_amount);
        let signer_address = signer::address_of(signer);
        assert_signer_has_sufficient_balance<HouseShares>(signer_address, shares_amount);
        let house_address = get_house_address();
        let house = borrow_global<House>(house_address);
        let house_signer = account::create_signer_with_capability(&house.signer_cap);
        coin::transfer<AptosCoin>(
            &house_signer,
            signer_address,
            get_withdraw_amount_from_shares_amount(shares_amount)
        );
        coin::burn(
            coin::withdraw<HouseShares>(signer, shares_amount),
            &borrow_global<HouseSharesCaps>(house_address).burn_cap
        );
    }

    public entry fun set_admin(signer: &signer, admin: address) acquires House {
        assert_signer_is_deployer(signer);
        borrow_global_mut<House>(get_house_address()).admin_address = admin;
    }

    public entry fun set_min_bet(signer: &signer, min_bet: u64) acquires House {
        assert_signer_is_admin(signer);
        borrow_global_mut<House>(get_house_address()).min_bet = min_bet;
    }

    public entry fun set_max_bet(signer: &signer, max_bet: u64) acquires House {
        assert_signer_is_admin(signer);
        borrow_global_mut<House>(get_house_address()).max_bet = max_bet;
    }

    public entry fun set_fee_bps<GameType: drop>(signer: &signer, fee_bps: u64) acquires House, ApprovedGame {
        assert_signer_is_admin(signer);
        borrow_global_mut<ApprovedGame<GameType>>(get_house_address()).fee_bps = fee_bps;
    }

    public entry fun set_max_multiplier(signer: &signer, max_multiplier: u64) acquires House {
        assert_signer_is_admin(signer);
        borrow_global_mut<House>(get_house_address()).max_multiplier = max_multiplier;
    }
    
    #[view]
    public fun get_house_address(): address {
        account::create_resource_address(&@styx, ACCOUNT_SEED)
    }

    #[view]
    public fun get_admin_address(): address acquires House {
        borrow_global<House>(get_house_address()).admin_address
    }

    #[view]
    public fun get_min_bet(): u64 acquires House {
        borrow_global<House>(get_house_address()).min_bet
    }

    #[view]
    public fun get_max_bet(): u64 acquires House {
        borrow_global<House>(get_house_address()).max_bet
    }

    #[view]
    public fun get_max_multiplier(): u64 acquires House {
        borrow_global<House>(get_house_address()).max_multiplier
    }

    #[view]
    public fun get_fee_bps<GameType: drop>(): u64 acquires ApprovedGame {
        borrow_global<ApprovedGame<GameType>>(get_house_address()).fee_bps
    }

    #[view]
    public fun get_house_balance(): u64 {
        coin::balance<AptosCoin>(get_house_address())
    }
    
    #[view]
    public fun get_house_shares_supply(): u128 {
        *option::borrow(&coin::supply<HouseShares>())
    }
    
    #[view]
    public fun get_house_shares_amount_from_deposit_amount(deposit_amount: u64): u64 {
        let house_balance = get_house_balance();
        if(house_balance == 0) {
            deposit_amount
        } else {
            ((deposit_amount as u128) * get_house_shares_supply() / (house_balance as u128) as u64)
        }
    }

    #[view]
    public fun get_withdraw_amount_from_shares_amount(shares_amount: u64): u64 {
        let shares_supply = get_house_shares_supply();
        if(shares_supply == 0 || (shares_amount as u128) > shares_supply) {
            0
        } else {
            ((get_house_balance() as u128) * (shares_amount as u128) / shares_supply as u64)
        }
    }
    
    #[view]
    public fun get_fee_amount<GameType: drop>(bet_amount: u64): u64 acquires ApprovedGame {
        bet_amount * borrow_global<ApprovedGame<GameType>>(get_house_address()).fee_bps / FEE_BPS_DIVISOR
    }
    
    #[view]
    public fun is_game_approved<GameType: drop>(): bool {
        exists<ApprovedGame<GameType>>(get_house_address())
    }
    

    // ASSERTIONS

    fun assert_signer_is_deployer(signer: &signer) {
        assert!(signer::address_of(signer) == @styx, ESignerNotDeployer);
    }

    fun assert_signer_is_admin(signer: &signer) acquires House {
        assert!(signer::address_of(signer) == get_admin_address(), ESignerNotAdmin);
    }

    fun assert_signer_has_sufficient_balance<CoinType>(admin_address: address, amount: u64) {
        assert!(coin::balance<CoinType>(admin_address) >= amount, EInsufficientBalance);
    }
    
    fun assert_coin_amount_valid(amount: u64) {
        assert!(amount > 0, EAmountInvalid);
    }
    
    fun assert_game_is_approved<GameType: drop>() {
        assert!(is_game_approved<GameType>(), EGameNotApproved);
    }
    
    fun assert_game_is_not_approved<GameType: drop>() {
        assert!(!is_game_approved<GameType>(), EGameAlreadyApproved);
    }

    fun assert_house_has_enough_balance(
        bet_amount: u64, 
        multiplier_numerator: u64, 
        multiplier_denominator: u64
    ) {
        assert!(
            coin::balance<AptosCoin>(get_house_address()) >= bet_amount * multiplier_numerator / multiplier_denominator,
            EHouseInsufficientBalance
        );
    }

    fun assert_bet_is_valid(house: &House, bet_amount: u64) {
        assert!(bet_amount >= house.min_bet, EBetLessThanMinBet);
        assert!(bet_amount <= house.max_bet, EBetExceedsMaxBet);
        
    }
    
    fun assert_payout_is_valid(house: &House, payout_numerator: u64, payout_denominator: u64) {
        assert!(payout_numerator <= house.max_multiplier * payout_denominator, EBetExceedsMaxMultiplier);
    }
    
    #[test_only]
    public fun test_pay_out<GameType: drop>(
        bettor: address,
        bet: Coin<AptosCoin>,
        payout_numerator: u64,
        payout_denominator: u64,
        _witness: GameType
    ) acquires House, ApprovedGame {
        pay_out(bettor, bet, payout_numerator, payout_denominator, _witness);
    }
}
