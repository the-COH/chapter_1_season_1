// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./Booster.sol";

/// @title Player state for a specific game state.
/// @author Devneck
/// @notice This is the player's current state for any provided game state id.
/// @dev All players are tied together in MeepMeep by the user's wallet. All GameStates
///      consist of a list of joined players which will then interact with Tiles to produce eggs.
///      Player objects are immutably aggregated at the main level so that we can keep track of
///      all earned eggs.
contract Player {
    // @notice the wallet of the player.
    // @dev used to link to meep meep.
    address public wallet;

    // @notice the id of this specific game state.
    // @dev used to link to meep meep.
    uint256 public gameId;

    // @notice the swipe rating of the player.
    // @dev used to swipe from players on tiles.
    uint256 public swipeRating;

    // @notice the productivity rating of the player.
    // @dev used to produce eggs with players on tiles.
    uint256 public productivityRating;

    // @notice the total egg count of the user for this game state.
    // @dev number of eggs user currently has for this game state.
    uint256 public eggs;

    // @notice the current tile the user is on.
    // @dev tiles are stored as integers because it takes less space.
    uint256 public current;

    // @notice the tile the user wishes to move to.
    // @dev tiles are stored as integers because it takes less space.
    uint256 public move;

    // @notice the tile the user wishes to swipe from.
    // @dev tiles are stored as integers because it takes less space.
    uint256 public swipe;

    // @notice the ids of the boosters currently applied to the player.
    // @dev tiles are stored as integers because it takes less space.
    uint256[] public boosters;

    // @notice whether or not this player game state instance was finalized yet.
    // @dev finalized instances should be garbage collected for final state.
    bool ended;

    constructor(address w, uint256 gId, uint256 t) {
        wallet = w; 
        gameId = gId;
        eggs = 0;
        current = t;
        ended = false;
    }

    // @dev used to make sure the game has not ended.
    modifier notEnded {
        require(!ended);
        _;
    }

    // @dev moves the user, resets move and swipe to nothing. Call after tile updates.
    function update() public notEnded {
        current = move;
        move = 0;
        swipe = 0;
    }

    // @notice sets the next move of the player.
    // @dev the next move of the player in integer format to save space.
    function setMove(uint256 t) public notEnded {
        move = t;
    }

    // @notice sets the next swipe of the player.
    // @dev the next swipe of the player in integer format to save space.
    function setSwipe(uint256 t) public notEnded {
        swipe = t;
    }

    // @dev adds a booster to the player. Not to be called externally.
    function applyBoost(Booster booster) public notEnded {
        boosters.push(booster.getBoosterId());
        productivityRating += booster.getProductivityBoost();
        swipeRating += booster.getSwipeBoost();
    }

    // @dev adds eggs to the player. Not to be called externally.
    function addEggs(uint256 amount) public notEnded {
        eggs += amount;
    }

    // @dev removes eggs from the player. Not to be called externally.
    function removeEggs(uint256 amount) public notEnded {
        if (amount > eggs) {
            eggs = 0;
        } else {
            eggs -= amount;
        }
    }

    // @notice returns productivity of player.
    // @dev returns the productivity rating of this single player for this game state.
    // @returns productivity rating of this player.
    function getProductivityRating() external view returns (uint256) {
        return productivityRating;
    }

    // @notice returns swipe rating of player.
    // @dev returns the swipe rating of this single player for this game state.
    // @returns swipe rating of this player.
    function getSwipeRating() external view returns (uint256) {
        return swipeRating;
    }

    // @notice returns wallet address of player.
    // @dev returns the wallet address of this single player for this game state.
    // @returns wallet address of this player.
    function getWallet() external view returns (address) {
        return wallet;
    }

    // @notice returns tile player is currently on.
    // @dev returns the id of the tile that the player is currently sitting on.
    // @returns returns tile player is currently on.
    function getCurrent() external view returns (uint256) {
        return current;
    }

    // @notice returns tile player is moving to.
    // @dev returns the id of the tile that the player is moving to.
    // @returns returns tile player is moving to.
    function getMove() external view returns (uint256) {
        return move;
    }

    // @notice returns tile player is swiping from.
    // @dev returns the id of the tile that the player is swiping from.
    // @returns returns tile player is swiping from.
    function getSwipe() external view returns (uint256) {
        return swipe;
    }

    // @notice gets boosters currently applied to the player.
    // @dev uint256 representation of all boosters on the player.
    // @returns boosters currently applied to the player.
    function getBoosters() external view returns (uint256[] memory) {
        return boosters;
    }

    // @dev garbage collects and finalizes object instance.
    function finalize() public notEnded() {
        // Garbage collect fields we won't need later.
        gc();

        // Mark as ended, prevent further interaction.
        ended = true;
    }

    // @dev garbage collects and finalizes object instance.
    function gc() internal notEnded {
        // Garbage collect.
        delete move;
        delete swipe;
        delete productivityRating;
        delete swipeRating;
		delete boosters;
    }
}