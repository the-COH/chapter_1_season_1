// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

library AppStorage {
	struct Stage {
		string name;
		string description;
		string mapHash;
		string collisionMapHash;
	}

	struct Sprite {
		string name;
		string description;
		string imageHash;
	}

	struct Player {
		string name;
		string description;
		uint32 spriteId;
		mapping(uint32 => uint8) inventories;
		uint256 counter;
	}

	struct Item {
		string name;
		string description;
		string imageHash;
		uint256 price;
		bool consumable;
	}

	enum PokemonType {
		Bug,
		Dark,
		Dragon,
		Electric,
		Fairy,
		Fighting,
		Fire,
		Flying,
		Ghost,
		Grass,
		Ground,
		Ice,
		Normal,
		Poison,
		Psychic,
		Rock,
		Steel,
		Water
	}

	struct Pokemon {
		string name;
		string description;
		string imageHash;
		PokemonType type1;
		PokemonType type2;
		uint8 captureOdds;
		uint256 price;
	}

	enum Terrain {
		Grassland,
		Forest,
		WaterEdge,
		Sea,
		Cave,
		Mountain,
		RoughTerrain,
		Urban
	}

	struct State {
		//  Artwork
	    uint32 stageId;
		mapping(uint32 => Stage) stages;

		mapping(address => Player) players;
		mapping(uint32 => Item) items;
		mapping(uint256 => Pokemon) pokemons;
		mapping(uint32 => Sprite) sprites;

		string tokenBaseExternalUrl;
		string contractLevelImageUrl;
		string contractLevelExternalUrl;
	}

	bytes32 constant APP_STORAGE_POSITION = keccak256('diamond.standard.kanto.storage');

	function getState() internal pure returns (State storage s) {
		bytes32 position = APP_STORAGE_POSITION;
		assembly {
			s.slot := position
		}
	}
}
