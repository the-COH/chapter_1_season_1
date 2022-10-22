// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import { AppStorage } from '../libraries/AppStorage.sol';
import { Constants } from '../libraries/Constants.sol';

contract KantoInit {
	function init() external {
		AppStorage.State storage s = AppStorage.getState();

		s.tokenBaseExternalUrl = 'https://bulbapedia.bulbagarden.net';
		s.contractLevelImageUrl = 'https://openseauserdata.com/files/2672eeeeaa51eaa4bf32b5d0280c0e3d.png';
		s.contractLevelExternalUrl = 'https://bulbapedia.bulbagarden.net';

		// Attributes
		AppStorage.Stage storage stage = s.stages[0];
        stage.name = 'Kanto';
	}
}