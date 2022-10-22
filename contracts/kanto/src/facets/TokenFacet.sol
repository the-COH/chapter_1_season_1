// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { Base64Upgradeable as Base64 } from '@openzeppelin/contracts-upgradeable/utils/Base64Upgradeable.sol';
import { StringsUpgradeable as Strings } from '@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol';
import { IERC1155Base } from '@solidstate/contracts/token/ERC1155/base/IERC1155Base.sol';
import { SolidStateERC1155 } from '@solidstate/contracts/token/ERC1155/SolidStateERC1155.sol';
import { IERC1155Metadata } from '@solidstate/contracts/token/ERC1155/metadata/IERC1155Metadata.sol';
import { AppStorage } from '../libraries/AppStorage.sol';
import { Constants } from '../libraries/Constants.sol';
import { BaseFacet } from './BaseFacet.sol';
import { GameFacet } from './GameFacet.sol';

contract TokenFacet is
	BaseFacet,
	SolidStateERC1155
{
	event PokemonCapture(uint256 pokemonId, bool captured);

	// Mint function to play
	function mint(uint8 terrainId, uint32 ballId)
		public
		returns (uint256, bool)
	{
		AppStorage.Player storage player = getState().players[msg.sender];

		require(player.inventories[ballId] > 0, 'You do not have this type of pokeball');
		player.inventories[ballId] -= 1;

		uint256 counter = getState().players[msg.sender].counter++;
		uint256 seed = uint256(keccak256(abi.encodePacked(
			block.timestamp,
			terrainId,
			ballId,
			counter
		)));

		uint256 pokemonId = GameFacet(address(this)).encounter(terrainId, seed);
		bool captured = GameFacet(address(this)).capture(pokemonId, ballId, seed / (2 ** 128));

		if (captured) {
			_safeMint(msg.sender, pokemonId, 1, '');
		}

		emit PokemonCapture(pokemonId, captured);

		return (pokemonId, captured);
	}

	function tradeBack(address payable destination, uint256[] calldata pokemonIds, uint8[] calldata quantities)
		external
		payable
	{
		require(pokemonIds.length == quantities.length, '`pokemonIds` and `quantities` must have the same length');
		require(msg.sender == destination, '`destination` must be the same as `msg.sender`');

		address[] memory senderAddresses = new address[](pokemonIds.length);
		for (uint256 i = 0; i < pokemonIds.length;) {
			senderAddresses[i] = msg.sender;
			unchecked { ++i; }
		}

		uint256[] memory pokemonQuantities = IERC1155Base(address(this)).balanceOfBatch(senderAddresses, pokemonIds);

		uint256 balance = 0;

		for (uint256 i = 0; i < pokemonIds.length;) {
			uint256 pokemonId = pokemonIds[i];
			require(pokemonId > 0 && pokemonId <= 151, 'Invalid `pokemonIds`');
			require(pokemonQuantities[i] >= quantities[i], 'Not enough pokemon to trade back');
			_burn(msg.sender, pokemonId, quantities[i]);
			balance += (getState().pokemons[pokemonId].price * quantities[i]);

			unchecked { ++i; }
		}

		bool sent = destination.send(balance);
		require(sent, 'Failed to send Canto');
	}

	// =================================
	// Image
	// =================================

	function uri(uint256 tokenId)
		public
		view
		override(IERC1155Metadata)
		returns (string memory)
	{
		// require(_exists(tokenId), 'Invalid tokenId');
		AppStorage.State storage s = getState();
		AppStorage.Stage storage stage = s.stages[s.stageId];
		
		return string(
			abi.encodePacked(
				'data:application/json;base64,',
				Base64.encode(
					abi.encodePacked(
						'{',
							'"name": "', stage.name, ' #', Strings.toString(tokenId), '", ',
							'"description": "', stage.description, '", ',
							'"image": "https://ipfs.io/ipfs/', getState().pokemons[tokenId].imageHash, '", ',
							'"external_url": "', s.tokenBaseExternalUrl, Strings.toString(tokenId), '", ',
							'"attributes": [',
							']',
						'}'
					)
				)
			)
		);
	}

	function contractURI()
		public
		view
		returns (string memory)
	{
		AppStorage.State storage s = getState();
		AppStorage.Stage storage stage = s.stages[s.stageId];

        return string(
			abi.encodePacked(
				'data:application/json;base64,',
				Base64.encode(
					abi.encodePacked(
						'{',
							'"name": "', stage.name, '", ',
							'"description": "', stage.description, '", ',
							'"image": "', s.contractLevelImageUrl, '", ',
							'"external_url": "', s.contractLevelExternalUrl, '", ',
						'}'
					)
				)
			)
		);
    }
}