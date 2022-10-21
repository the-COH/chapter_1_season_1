// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./Player.sol";

/// @title An object representation of the Boosters you can acquire on the game board tiles.
/// @author Devneck
/// @notice To be used for the boosters on the boards.
/// @dev Static class, immutable and auto indexed by ids, should not be created from anywhere but meepmeep.
contract Booster {
    // @notice static booster id, auto increment as passed by meepmeep.
    // @dev the booster id as passed from meepmeep.
    uint256 public boosterId;

    // @notice the amount to boost user swiping by.
    // @dev the amount to boost user swiping by.
    uint256 public swipeBoost;

    // @notice the amount to boost user productivity by.
    // @dev the amount to boost user productivity by.
    uint256 public productivityBoost;

    // @notice the amount to boost user productivity by.
    // @dev the amount to boost user productivity by.
    constructor(uint256 id, uint256 swipe, uint256 productivity) {
        boosterId = id;
        swipeBoost = swipe;
        productivityBoost = productivity;
    }

    // @notice the amount to boost user productivity by.
    // @dev the amount to boost user productivity by.
    // @returns the amount to boost user productivity by.
    function getProductivityBoost() external view returns (uint256) {
        return productivityBoost;
    }

    // @notice the amount to boost user swiping by.
    // @dev the amount to boost user swiping by.
    // @returns the amount to boost user swiping by.
    function getSwipeBoost() external view returns (uint256) {
        return swipeBoost;
    }

    // @notice the booster ID for async referencing in meep meep.
    // @dev the booster ID for async referencing in meep meep.
    // @returns the booster ID.
    function getBoosterId() external view returns (uint256) {
        return boosterId;
    }
}