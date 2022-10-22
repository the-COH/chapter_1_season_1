// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { IERC1155Base } from '@solidstate/contracts/token/ERC1155/base/IERC1155Base.sol';
import { AppStorage } from '../libraries/AppStorage.sol';
import { Constants } from '../libraries/Constants.sol';
import { BaseFacet } from './BaseFacet.sol';

contract GameFacet is
	BaseFacet
{
	function setStage(uint32 stageId)
		public onlyOwner
	{
		getState().stageId = stageId;
	}

	function updateStage(
        uint32 stageId,
        string calldata name,
        string calldata description,
        string calldata mapHash,
		string calldata collisionMapHash
    )
    	public onlyOwner
    {
        AppStorage.Stage storage stage = getState().stages[stageId];
        stage.name = name;
        stage.description = description;
        stage.mapHash = mapHash;
		stage.collisionMapHash = collisionMapHash;
    }

    function updateSprite(
        uint32 spriteId,
        string calldata name,
        string calldata description,
        string calldata imageHash
    )
    	public onlyOwner
    {
        AppStorage.Sprite storage sprite = getState().sprites[spriteId];
        sprite.name = name;
        sprite.description = description;
        sprite.imageHash = imageHash;
    }

	function updatePlayer(
		address playerId,
        string calldata name,
        string calldata description,
        uint32 spriteId
    )
    	public
    {
		require(playerId == msg.sender || msg.sender == owner(), 'You can only update your own settings');

        AppStorage.Player storage player = getState().players[playerId];
        player.name = name;
        player.description = description;
        player.spriteId = spriteId;
    }

	function updatePokemon(
        uint32 pokemonId,
        string calldata name,
        string calldata description,
        string calldata imageHash,
		uint8 type1,
		uint8 type2
    )
    	public onlyOwner
    {
		require(type1 >= 0 && type1 < 18, '`type1` is out of range');
		require(type2 >= 0 && type2 < 18, '`type2` is out of range');

        AppStorage.Pokemon storage pokemon = getState().pokemons[pokemonId];
        pokemon.name = name;
        pokemon.description = description;
        pokemon.imageHash = imageHash;
		pokemon.type1 = AppStorage.PokemonType(type1);
		pokemon.type2 = AppStorage.PokemonType(type2);
    }

	function updateItem(
		uint32 itemId,
		string calldata name,
		string calldata description,
		string calldata imageHash,
		uint256 price,
		bool consumable
	)
		public onlyOwner
	{
		AppStorage.Item storage item = getState().items[itemId];
        item.name = name;
        item.description = description;
        item.imageHash = imageHash;
		item.price = price;
		item.consumable = consumable;
	}

	function purchase(
		uint32[] calldata itemIds,
		uint8[] calldata quantities
	)
		public payable
	{
		require(itemIds.length == quantities.length, '`itemIds` and `quantities` must have the same length');

		AppStorage.Player storage player = getState().players[msg.sender];

		// Check if transaction can proceed
		{
			uint256 totalPrice;
			mapping(uint32 => AppStorage.Item) storage items = getState().items;

			for (uint256 i; i < itemIds.length;) {
				totalPrice += (items[itemIds[i]].price * quantities[i]);
				// Ensure we don't exceed max inventory
				require(player.inventories[itemIds[i]] + quantities[i] <= Constants.MAX_INVENTORY, 'Exceed maximum inventory');
				unchecked { ++i; }
			}

			require(totalPrice <= msg.value, 'Insufficient fund sent');
		}
		
		// Update inventory
		{
			for (uint256 i; i < itemIds.length;) {
				player.inventories[itemIds[i]] += quantities[i];
				unchecked { ++i; }
			}
		}
	}

	function encounter(uint8 terrainId, uint256 randomSeed)
		external
		pure
		returns (uint256)
	{
		require(terrainId >= 0 && terrainId < 18, '`terrainId` is out of range');

		AppStorage.Terrain terrain = AppStorage.Terrain(terrainId);

		uint256 pokemonId;
		uint256 randomNumber = randomSeed % 1_000_000;

		if (terrain == AppStorage.Terrain.Grassland) {
			if(0 < randomNumber && randomNumber <= 14) pokemonId = 24;
			else if(14 < randomNumber && randomNumber <= 27) pokemonId = 59;
			else if(27 < randomNumber && randomNumber <= 2708) pokemonId = 1;
			else if(2708 < randomNumber && randomNumber <= 2711) pokemonId = 85;
			else if(2711 < randomNumber && randomNumber <= 4969) pokemonId = 84;
			else if(4969 < randomNumber && randomNumber <= 324865) pokemonId = 96;
			else if(324865 < randomNumber && randomNumber <= 326895) pokemonId = 23;
			else if(326895 < randomNumber && randomNumber <= 329470) pokemonId = 125;
			else if(329470 < randomNumber && randomNumber <= 329502) pokemonId = 83;
			else if(329502 < randomNumber && randomNumber <= 330386) pokemonId = 44;
			else if(330386 < randomNumber && randomNumber <= 331957) pokemonId = 58;
			else if(331957 < randomNumber && randomNumber <= 341940) pokemonId = 97;
			else if(341940 < randomNumber && randomNumber <= 341976) pokemonId = 2;
			else if(341976 < randomNumber && randomNumber <= 362401) pokemonId = 39;
			else if(362401 < randomNumber && randomNumber <= 362453) pokemonId = 115;
			else if(362453 < randomNumber && randomNumber <= 363241) pokemonId = 108;
			else if(363241 < randomNumber && randomNumber <= 363308) pokemonId = 34;
			else if(363308 < randomNumber && randomNumber <= 363358) pokemonId = 31;
			else if(363358 < randomNumber && randomNumber <= 381457) pokemonId = 29;
			else if(381457 < randomNumber && randomNumber <= 397939) pokemonId = 32;
			else if(397939 < randomNumber && randomNumber <= 398732) pokemonId = 30;
			else if(398732 < randomNumber && randomNumber <= 399560) pokemonId = 33;
			else if(399560 < randomNumber && randomNumber <= 399575) pokemonId = 38;
			else if(399575 < randomNumber && randomNumber <= 416286) pokemonId = 43;
			else if(416286 < randomNumber && randomNumber <= 419849) pokemonId = 77;
			else if(419849 < randomNumber && randomNumber <= 419857) pokemonId = 78;
			else if(419857 < randomNumber && randomNumber <= 453756) pokemonId = 20;
			else if(453756 < randomNumber && randomNumber <= 995457) pokemonId = 19;
			else if(995457 < randomNumber && randomNumber <= 996217) pokemonId = 123;
			else if(996217 < randomNumber && randomNumber <= 997664) pokemonId = 114;
			else if(997664 < randomNumber && randomNumber <= 997680) pokemonId = 128;
			else if(997680 < randomNumber && randomNumber <= 997685) pokemonId = 3;
			else if(997685 < randomNumber && randomNumber <= 997722) pokemonId = 45;
			else if(997722 < randomNumber && randomNumber <= 999715) pokemonId = 37;
			else if(999715 < randomNumber && randomNumber <= 1000000) pokemonId = 40;
		} else if (terrain == AppStorage.Terrain.Forest) {
			if(0 < randomNumber && randomNumber <= 1263) pokemonId = 15;
			else if(1263 < randomNumber && randomNumber <= 11093) pokemonId = 69;
			else if(11093 < randomNumber && randomNumber <= 11426) pokemonId = 12;
			else if(11426 < randomNumber && randomNumber <= 53170) pokemonId = 10;
			else if(53170 < randomNumber && randomNumber <= 54193) pokemonId = 102;
			else if(54193 < randomNumber && randomNumber <= 54198) pokemonId = 103;
			else if(54198 < randomNumber && randomNumber <= 64172) pokemonId = 14;
			else if(64172 < randomNumber && randomNumber <= 66758) pokemonId = 11;
			else if(66758 < randomNumber && randomNumber <= 127337) pokemonId = 46;
			else if(127337 < randomNumber && randomNumber <= 128016) pokemonId = 47;
			else if(128016 < randomNumber && randomNumber <= 132995) pokemonId = 18;
			else if(132995 < randomNumber && randomNumber <= 173041) pokemonId = 17;
			else if(173041 < randomNumber && randomNumber <= 808197) pokemonId = 16;
			else if(808197 < randomNumber && randomNumber <= 809760) pokemonId = 25;
			else if(809760 < randomNumber && randomNumber <= 810250) pokemonId = 127;
			else if(810250 < randomNumber && randomNumber <= 810263) pokemonId = 26;
			else if(810263 < randomNumber && randomNumber <= 811059) pokemonId = 49;
			else if(811059 < randomNumber && randomNumber <= 838412) pokemonId = 48;
			else if(838412 < randomNumber && randomNumber <= 838440) pokemonId = 71;
			else if(838440 < randomNumber && randomNumber <= 999505) pokemonId = 13;
			else if(999505 < randomNumber && randomNumber <= 1000000) pokemonId = 70;
		} else if (terrain == AppStorage.Terrain.WaterEdge) {
			if(0 < randomNumber && randomNumber <= 424) pokemonId = 9;
			else if(424 < randomNumber && randomNumber <= 1362) pokemonId = 148;
			else if(1362 < randomNumber && randomNumber <= 1369) pokemonId = 149;
			else if(1369 < randomNumber && randomNumber <= 18761) pokemonId = 147;
			else if(18761 < randomNumber && randomNumber <= 132833) pokemonId = 118;
			else if(132833 < randomNumber && randomNumber <= 136518) pokemonId = 55;
			else if(136518 < randomNumber && randomNumber <= 136601) pokemonId = 130;
			else if(136601 < randomNumber && randomNumber <= 143899) pokemonId = 99;
			else if(143899 < randomNumber && randomNumber <= 384021) pokemonId = 98;
			else if(384021 < randomNumber && randomNumber <= 611577) pokemonId = 129;
			else if(611577 < randomNumber && randomNumber <= 730775) pokemonId = 60;
			else if(730775 < randomNumber && randomNumber <= 737754) pokemonId = 61;
			else if(737754 < randomNumber && randomNumber <= 738201) pokemonId = 62;
			else if(738201 < randomNumber && randomNumber <= 856115) pokemonId = 54;
			else if(856115 < randomNumber && randomNumber <= 863267) pokemonId = 119;
			else if(863267 < randomNumber && randomNumber <= 864967) pokemonId = 80;
			else if(864967 < randomNumber && randomNumber <= 927517) pokemonId = 79;
			else if(927517 < randomNumber && randomNumber <= 996289) pokemonId = 7;
			else if(996289 < randomNumber && randomNumber <= 1000000) pokemonId = 8;
		} else if (terrain == AppStorage.Terrain.Sea) {
			if(0 < randomNumber && randomNumber <= 4205) pokemonId = 91;
			else if(4205 < randomNumber && randomNumber <= 8266) pokemonId = 87;
			else if(8266 < randomNumber && randomNumber <= 269587) pokemonId = 116;
			else if(269587 < randomNumber && randomNumber <= 274382) pokemonId = 140;
			else if(274382 < randomNumber && randomNumber <= 274549) pokemonId = 141;
			else if(274549 < randomNumber && randomNumber <= 276413) pokemonId = 131;
			else if(276413 < randomNumber && randomNumber <= 281351) pokemonId = 138;
			else if(281351 < randomNumber && randomNumber <= 281486) pokemonId = 139;
			else if(281486 < randomNumber && randomNumber <= 289235) pokemonId = 117;
			else if(289235 < randomNumber && randomNumber <= 435402) pokemonId = 86;
			else if(435402 < randomNumber && randomNumber <= 691945) pokemonId = 90;
			else if(691945 < randomNumber && randomNumber <= 695568) pokemonId = 121;
			else if(695568 < randomNumber && randomNumber <= 944927) pokemonId = 120;
			else if(944927 < randomNumber && randomNumber <= 992593) pokemonId = 72;
			else if(992593 < randomNumber && randomNumber <= 1000000) pokemonId = 73;
		} else if (terrain == AppStorage.Terrain.Cave) {
			if(0 < randomNumber && randomNumber <= 569300) pokemonId = 50;
			else if(569300 < randomNumber && randomNumber <= 569423) pokemonId = 51;
			else if(569423 < randomNumber && randomNumber <= 638104) pokemonId = 92;
			else if(638104 < randomNumber && randomNumber <= 638365) pokemonId = 94;
			else if(638365 < randomNumber && randomNumber <= 649439) pokemonId = 42;
			else if(649439 < randomNumber && randomNumber <= 653664) pokemonId = 93;
			else if(653664 < randomNumber && randomNumber <= 656617) pokemonId = 95;
			else if(656617 < randomNumber && randomNumber <= 1000000) pokemonId = 41;
		} else if (terrain == AppStorage.Terrain.Mountain) {
			if(0 < randomNumber && randomNumber <= 489) pokemonId = 142;
			else if(489 < randomNumber && randomNumber <= 597) pokemonId = 6;
			else if(597 < randomNumber && randomNumber <= 87726) pokemonId = 4;
			else if(87726 < randomNumber && randomNumber <= 87998) pokemonId = 5;
			else if(87998 < randomNumber && randomNumber <= 88487) pokemonId = 36;
			else if(88487 < randomNumber && randomNumber <= 275247) pokemonId = 35;
			else if(275247 < randomNumber && randomNumber <= 388629) pokemonId = 104;
			else if(388629 < randomNumber && randomNumber <= 606261) pokemonId = 74;
			else if(606261 < randomNumber && randomNumber <= 607022) pokemonId = 76;
			else if(607022 < randomNumber && randomNumber <= 615229) pokemonId = 75;
			else if(615229 < randomNumber && randomNumber <= 615773) pokemonId = 68;
			else if(615773 < randomNumber && randomNumber <= 623274) pokemonId = 67;
			else if(623274 < randomNumber && randomNumber <= 786389) pokemonId = 66;
			else if(786389 < randomNumber && randomNumber <= 900858) pokemonId = 126;
			else if(900858 < randomNumber && randomNumber <= 989618) pokemonId = 56;
			else if(989618 < randomNumber && randomNumber <= 990325) pokemonId = 105;
			else if(990325 < randomNumber && randomNumber <= 990596) pokemonId = 57;
			else if(990596 < randomNumber && randomNumber <= 1000000) pokemonId = 143;
		} else if (terrain == AppStorage.Terrain.RoughTerrain) {
			if(0 < randomNumber && randomNumber <= 172224) pokemonId = 22;
			else if(172224 < randomNumber && randomNumber <= 401708) pokemonId = 81;
			else if(401708 < randomNumber && randomNumber <= 406455) pokemonId = 82;
			else if(406455 < randomNumber && randomNumber <= 407020) pokemonId = 112;
			else if(407020 < randomNumber && randomNumber <= 441063) pokemonId = 111;
			else if(441063 < randomNumber && randomNumber <= 453909) pokemonId = 27;
			else if(453909 < randomNumber && randomNumber <= 453933) pokemonId = 28;
			else if(453933 < randomNumber && randomNumber <= 1000000) pokemonId = 21;
		} else if (terrain == AppStorage.Terrain.Urban) {
			if(0 < randomNumber && randomNumber <= 37173) pokemonId = 63;
			else if(37173 < randomNumber && randomNumber <= 37234) pokemonId = 65;
			else if(37234 < randomNumber && randomNumber <= 37502) pokemonId = 113;
			else if(37502 < randomNumber && randomNumber <= 37541) pokemonId = 132;
			else if(37541 < randomNumber && randomNumber <= 382531) pokemonId = 133;
			else if(382531 < randomNumber && randomNumber <= 383973) pokemonId = 101;
			else if(383973 < randomNumber && randomNumber <= 384012) pokemonId = 136;
			else if(384012 < randomNumber && randomNumber <= 394360) pokemonId = 88;
			else if(394360 < randomNumber && randomNumber <= 420479) pokemonId = 107;
			else if(420479 < randomNumber && randomNumber <= 430705) pokemonId = 106;
			else if(430705 < randomNumber && randomNumber <= 430743) pokemonId = 135;
			else if(430743 < randomNumber && randomNumber <= 688968) pokemonId = 124;
			else if(688968 < randomNumber && randomNumber <= 690778) pokemonId = 64;
			else if(690778 < randomNumber && randomNumber <= 763153) pokemonId = 109;
			else if(763153 < randomNumber && randomNumber <= 897570) pokemonId = 52;
			else if(897570 < randomNumber && randomNumber <= 910181) pokemonId = 122;
			else if(910181 < randomNumber && randomNumber <= 910572) pokemonId = 89;
			else if(910572 < randomNumber && randomNumber <= 911155) pokemonId = 53;
			else if(911155 < randomNumber && randomNumber <= 922823) pokemonId = 137;
			else if(922823 < randomNumber && randomNumber <= 924725) pokemonId = 134;
			else if(924725 < randomNumber && randomNumber <= 997668) pokemonId = 100;
			else if(997668 < randomNumber && randomNumber <= 1000000) pokemonId = 110;
		}

		return pokemonId;
	}

	function capture(uint256 pokemonId, uint32 ballId, uint256 randomSeed)
		external
		view
		returns (bool)
	{
		require(pokemonId > 0 && pokemonId <= 151, '`pokemonId` is out of range');

		uint8 captureOdds = getState().pokemons[pokemonId].captureOdds;

		if (ballId == 1) {
			// Poké Ball 1/100
			captureOdds /= 1;

		} else if (ballId == 2) {
			// Great Ball 2/100
			captureOdds /= 2;

		} else if (ballId == 3) {
			// Ultra Ball 10/100
			captureOdds /= 10;
			
		} else if (ballId == 4) {
			// Master Ball 100/100
			captureOdds /= 100;
		}

		captureOdds = captureOdds == 0 ? 1 : captureOdds;

		return randomSeed % captureOdds == 0;
	}

	function getInventoryQuantities(uint32[] calldata inventoryIds)
		external
		view
		returns (uint8[] memory)
	{
		AppStorage.Player storage player = getState().players[msg.sender];

		uint8[] memory inventoryQuantities = new uint8[](inventoryIds.length);
		for (uint256 i = 0; i < inventoryIds.length;) {
			inventoryQuantities[i] = player.inventories[inventoryIds[i]];

			unchecked { ++i; }
		}

		return inventoryQuantities;
	}
}