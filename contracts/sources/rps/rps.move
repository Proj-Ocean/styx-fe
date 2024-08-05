// module rps {
//     use std::signer;
//     use std::vector;

//     use aptos_framework::event;
//     use aptos_framework::randomness;
//     use aptos_framework::object::{Self, Object};

//     // CONSTANTS 
    
//     const ROCK: u8 = 1;
//     const PAPER: u8 = 2;
//     const SCISSORS: u8 = 3;

//     // GAME TYPE
//     struct RPSGame has drop {}

//     // STRUCTS
//     #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
//     struct RPS has key {
//         player: address,
//         bet_amount: u64,
//         player_move: u8,
//         house_move: u8,
//         result: u8,
//     }

//    // EVENTS
    
//     #[event]
//     struct GameCreated has store, drop {
//         player: address,
//         bet_amount: u64,
//         player_move: u8,
//         house_move: u8,
//         result: u8,
//     }

//     #[event]
//     struct GameResolved has store, drop {
//         player: address,
//         bet_amount: u64,
//         player_move: u8,
//         house_move: u8,
//         result: u8,
//     }

//     public entry fun start_game(account: &signer, bet_amount: u64) acquires RPSGame {
//         start_game_impl(
//             account,
//             bet_amount,
//             0,
//             0,
//             0
//         );
//     }

//     public entry fun set_player_move(account: &signer, player_move: u8) acquires RPSGame {
//         let game = borrow_global_mut<RPSGame>(signer::address_of(account));
//         game.player_move = player_move;
//     }

//     #[randomness]
//     entry fun randomly_set_house_move(account: &signer) acquires RPSGame {
//         randomly_set_house_move_internal(account);
//     }

//     public(friend) fun randomly_set_house_move_internal(account: &signer) acquires RPSGame {
//         let game = borrow_global_mut<RPSGame>(signer::address_of(account));
//         let random_number = randomness::u8_range(1, 4);
//         game.house_move = random_number;
//     }

//     public entry fun finalize_game_results(account: &signer) acquires RPSGame {
//         let game = borrow_global_mut<RPSGame>(signer::address_of(account));
//         game.result = determine_winner(game.player_move, game.house_move);
//     }

//     fun determine_winner(player_move: u8, house_move: u8): u8 {
//         if (player_move == ROCK && house_move == SCISSORS) {
//             2 // player wins
//         } else if (player_move == PAPER && house_move == ROCK) {
//             2 // player wins
//         } else if (player_move == SCISSORS && house_move == PAPER) {
//             2 // player wins
//         } else if (player_move == house_move) {
//             1 // draw
//         } else {
//             3 // computer wins
//         }
//     }

//     // IMPL
    
//     fun start_game_impl(
//         account: &signer, 
//         bet_amount: u64, 
//         player_move: u8,
//         house_move: u8,
//         result: u8
//     ) {
//     // : Object<RPSGame> acquires RPSGame {
//         let player = signer::address_of(account);

//         let game = RPSGame {
//             player,
//             bet_amount,
//             player_move: 0,
//             house_move: 0,
//             result: 0,
//         };

//         move_to(account, game);
        
//         event::emit(GameCreated {
//             player,
//             bet_amount,
//             player_move,
//             house_move,
//             result,
//         });
        
//         // game
//     }

//     #[view]
//     public fun get_player_move(account_addr: address): u8 acquires RPSGame {
//         borrow_global<RPSGame>(account_addr).player_move
//     }

//     #[view]
//     public fun get_house_move(account_addr: address): u8 acquires RPSGame {
//         borrow_global<RPSGame>(account_addr).house_move
//     }

//     #[view]
//     public fun get_game_results(account_addr: address): u8 acquires RPSGame {
//         borrow_global<RPSGame>(account_addr).result
//     }

// }