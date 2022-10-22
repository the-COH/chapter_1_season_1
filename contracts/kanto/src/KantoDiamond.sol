
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { IERC1155 } from '@solidstate/contracts/token/ERC1155/IERC1155.sol';
import { IERC1155Metadata } from '@solidstate/contracts/token/ERC1155/metadata/IERC1155Metadata.sol';
import { IERC1155Enumerable } from '@solidstate/contracts/token/ERC1155/enumerable/IERC1155Enumerable.sol';
import { ERC165Storage } from '@solidstate/contracts/introspection/ERC165Storage.sol';
import { SolidStateDiamond } from '@solidstate/contracts/proxy/diamond/SolidStateDiamond.sol';
import { Constants } from './libraries/Constants.sol';
import { AppStorage } from './libraries/AppStorage.sol';
import { TokenFacet } from './facets/TokenFacet.sol';

contract KantoDiamond is SolidStateDiamond {
	constructor()
		SolidStateDiamond() payable 
	{
		ERC165Storage.Layout storage erc165 = ERC165Storage.layout();

		// Add ERC165 data
		erc165.supportedInterfaces[type(IERC1155).interfaceId] = true;
		erc165.supportedInterfaces[type(IERC1155Metadata).interfaceId] = true;
		erc165.supportedInterfaces[type(IERC1155Enumerable).interfaceId] = true;
	}
}