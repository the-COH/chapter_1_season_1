// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./Tile.sol";

/// @title The game board object which holds all valid moves, and all booster locations.
/// @author Devneck
/// @notice The game board object which holds all valid moves, start location, and all booster locations.
/// @dev Game board tiles are not part of the game board itself, the game board is simply a template to
///      build a default gamestate from a list of stored game board values. This board object allows us
///      to dynamically add new board shapes later in the life cycle of the game if we want to. It also
///      should allows for anyone who wants to extend this contract for their own uses to launch boards.
contract GameBoard {
    // @notice The board ID of this board.
    // @dev Static auto-increment assigned by Meep Meep.
    uint256 public boardId;

    // @notice The board starting tile, where all palyers start.
    // @dev Must be less than tiles length.
    uint256 public startTile;
    
    // @notice List of booster IDs for each tile providing the board layout.
    // @dev Also provides number of tiles.
    uint256[] public tiles;

    // @notice List of adjacent tiles to each booster tile.
    // @dev Must have an array linked to each tile or else that tile cannot be moved from (this is bad, if people can move to it).
    mapping(uint256 => uint256[]) adjacentTiles;

    constructor(uint256 id, uint256 start) {
        boardId = id;
        startTile = start;
        tiles = new uint256[](0);
    }

    // @notice Adds a single valid move to the board.
    // @dev The board state will be updated to include this move as valid.
    function addValidMove(uint256 from, uint256 to) public {
        adjacentTiles[from].push(to);
    }

    // @notice Allows the user to change the layout of the boosters.
    // @dev The board state will be updated to this new layout.
    function setTileLayout(uint256[] memory layout) public {
        tiles = layout;
    }

    // @notice Adds a many valid moves to the board.
    // @dev The board state will be updated to this new set of valid moves.
    function setValidMoves(uint256 from, uint256[] memory to) public {
        while (adjacentTiles[from].length > 0) {
            adjacentTiles[from].pop();
        }
        for (uint i = 0; i < to.length; i++) {
            adjacentTiles[from].push(to[i]);
        }
    }

    // @notice Sets ALL valid moves on the board.
    // @dev The board state will be updated to this new set of valid moves.
    function setAllValidMoves(uint256[][] memory adjacents) public {
        for (uint i = 0; i < adjacents.length; i++) {
            adjacentTiles[i] = adjacents[i];
        }
    }

    // @notice returns the set of valid moves for the provided tile.
    // @dev the valid moves must be set before hand.
    // @param tile the tile to get the valid moves for.
    // @return the valid moves for this tile to be used on the UI.
    function getValidMoves(uint256 tile) public view returns (uint256[] memory) {
        return adjacentTiles[tile];
    }

    // @notice returns the starting tile.
    // @dev the tile all players are intiialized on in the game state.
    // @return the start tile for this board to be used on the UI.
    function getStartTile() public view returns (uint256) {
        return startTile;
    }

    // @notice returns the layout of tiles.
    // @dev the layout is created using booster ids.
    // @return the layout of the tiles.
    function getTiles() external view returns (uint256[] memory) {
        return tiles;
    }

    // @notice returns the nubmer of tiles.
    // @dev the length of tiles.
    // @return the nubmer of the tiles.
    function numTiles() external view returns (uint256) {
        return tiles.length;
    }
}