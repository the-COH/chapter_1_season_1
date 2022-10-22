// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { ReentrancyGuard } from '@solidstate/contracts/utils/ReentrancyGuard.sol';
import { SafeOwnable } from '@solidstate/contracts/access/ownable/SafeOwnable.sol';
import { AppStorage } from '../libraries/AppStorage.sol';

contract BaseFacet is
	ReentrancyGuard,
	SafeOwnable
{
	function getState()
		internal pure returns (AppStorage.State storage s)
	{
		return AppStorage.getState();
	}
}