// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

// @title Interactable is just an expanded ownership abstract class.
// @author Devneck
// @notice Allows for the owner to add whitelisted contracts for inter-contract interactions.
// @dev Should be on everything that needs to talk to Meep Meep (GameState, Player, Tile).
contract Interactable is Ownable {
    // @notice The operators allowed to operate this contract.
    // @dev These addresses can run arbitrary code, extremely powerful.
    //      only grant to valid verified 1st party contracts. NEVER a wallet.
    mapping(address => bool) operators;

    // @notice adds an operator to the contract.
    // @dev These addresses can run arbitrary code, extremely powerful.
    //      only grant to valid verified 1st party contracts. NEVER a wallet.
    // @param operator the operator to add.
    function addOperator(address operator) external onlyOwner {
        operators[operator] = true;
    }

    // @notice removes an operator from the contract.
    // @dev These addresses can run arbitrary code, extremely powerful.
    //      only grant to valid verified 1st party contracts. NEVER a wallet.
    // @param operator the operator to remove.
    function removeOperator(address operator) external onlyOwner {
        operators[operator] = false;
    }

    // @notice check an operator of the contract.
    // @dev returns true if the address is an operator.
    // @param operator the operator to check.
    function isOperator(address operator) public view returns (bool) {
        return operators[operator];
    }

    modifier onlyOperator {
        require(isOperator(msg.sender) || msg.sender == owner(), "Sender is not valid operator.");
        _;
    }
}