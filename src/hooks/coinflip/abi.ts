export const ABI = {
    "address": "0x316ad7540d54bc09cf81d2da0446fdfcbf49c4866d6eb51254249fd8332a6ee8",
    "name": "coinflip",
    "friends": [],
    "exposed_functions": [
      {
        "name": "add_coins",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer",
          "address",
          "u64"
        ],
        "return": []
      },
      {
        "name": "create_vault",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer"
        ],
        "return": []
      },
      {
        "name": "play",
        "visibility": "private",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer",
          "u64",
          "address"
        ],
        "return": []
      },
      {
        "name": "play_V2",
        "visibility": "private",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [
          {
            "constraints": []
          }
        ],
        "params": [
          "&signer",
          "u64",
          "address"
        ],
        "return": []
      },
      {
        "name": "withdraw_coins",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [],
        "params": [
          "&signer",
          "u64"
        ],
        "return": []
      },
      {
        "name": "withdraw_coins_V2",
        "visibility": "public",
        "is_entry": true,
        "is_view": false,
        "generic_type_params": [
          {
            "constraints": []
          }
        ],
        "params": [
          "&signer",
          "u64"
        ],
        "return": []
      }
    ],
    "structs": [
      {
        "name": "FlipEvent",
        "is_native": false,
        "abilities": [
          "drop",
          "store"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "player",
            "type": "address"
          },
          {
            "name": "is_won",
            "type": "bool"
          },
          {
            "name": "amount_bet",
            "type": "u64"
          }
        ]
      },
      {
        "name": "FlipEventV2",
        "is_native": false,
        "abilities": [
          "drop",
          "store"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "player",
            "type": "address"
          },
          {
            "name": "is_won",
            "type": "bool"
          },
          {
            "name": "coin_name",
            "type": "0x1::string::String"
          },
          {
            "name": "amount_bet",
            "type": "u64"
          }
        ]
      },
      {
        "name": "Vault",
        "is_native": false,
        "abilities": [
          "store",
          "key"
        ],
        "generic_type_params": [],
        "fields": [
          {
            "name": "vault_address",
            "type": "0x1::account::SignerCapability"
          }
        ]
      }
    ]
  } as const