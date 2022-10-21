// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./Player.sol";
import "./GameBoard.sol";
import "./GameState.sol";
import "./Booster.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title MeepMeep is the main game driving contract for all GameState lobbies and players.
/// @author Devneck
/// @notice The main game contract that stitches all game objects together.
/// @dev Global static object store for all immmutable game states.
contract MeepMeep is Ownable {
    // @notice holds all game states in a single array indexed by an auto increment ID.
    // @dev static immutable list of all game states accessible by ID.
    // TODO this is FOR testing purposes only, change to something that can scale.
    // TODO remove this after subgraph implementation.
    GameState[] public games = new GameState[](0);

    // @notice holds all boosters in a single array indexed by an auto increment ID.
    // @dev static immutable list of all boosters accessible by ID.
    Booster[] public boosters = new Booster[](0); 

    // @notice holds all boards in a single array indexed by an auto increment ID.
    // @dev static immutable list of all boards accessible by ID.
    GameBoard[] public boards = new GameBoard[](0);

    // @notice the board index to use as the default board.
    // @dev the board index to use as the default board, changable by owner after launch.
    uint256 public defaultBoard;

    // @notice the cost to join a game, paid to the contract.
    // @dev can be withdrawn with the withdraw function.
    // TODO test withdraw function around 7 or 8 times.
    uint256 public joinCost;

    // @notice the list of player states in each game the wallet has participated in.
    // @dev the board index to use as the default board, changable by owner after launch.
    // TODO possibly also remove this after subgraph implementation.
    mapping(address => Player[]) players;

    // @notice Allows users to create their own games with custom boards, and get the static ID in return.
    // @dev creates the custom game with board ID passed, and returns the static ID.
    // @param boardId ID of the board to use, will fetch from memory.
    // @param tile the tile id to move to.
    function startCustomGame(uint256 boardId, uint256 eLength, uint256 eCount) external onlyOwner {
        // Assign new static auto-increment ID to the game state.
        uint256 id = games.length;
        
        // Grab correct board.
        GameBoard board = boards[boardId];

        // Create game state with default board ID, epoch length and count.
        GameState newGame = new GameState(id, board, eLength, eCount);

        // Add game-state to array for aggregate GameStates for historical queries.
        games.push(newGame);
    }

    // @notice Allows the user to start a game.
    // @dev creates the game state using the default board.
    // @param id the game id.
    function startDefaultGame(uint256 eLength, uint256 eCount) external onlyOwner {
        // Assign new static auto-increment ID to the game state.
        uint256 id = games.length;

        // Grab correct board.
        GameBoard board = boards[defaultBoard];

        // Create game state with default board ID, epoch length and count.
        GameState newGame = new GameState(id, board, eLength, eCount);

        // Add game-state to array for aggregate GameStates for historical queries.
        games.push(newGame);
    }

    // @notice Allows owner to add a new game board.
    // @dev creates a new game board with the passed params.
    // @param tiles the list of game tiles (integers representing boosters 0 for no booster).
    function addBoard(uint256[] memory tiles, uint256 startTile) external onlyOwner {
        // Make sure start tile they're assigning for the board exists.
        require (startTile < tiles.length, "Start tile invalid.");

        // Create the board.
        GameBoard b = new GameBoard(boards.length, startTile);

        // Set the board layout, because contructors don't like arrays.
        b.setTileLayout(tiles);

        // Add board to global list of usable boards.
        boards.push(b);
    }

    // @notice Allows owner to edit a game board.
    // @dev udpates existing board with new set of valid moves.
    // @param boardId the board Id to update.
    // @param validMoves the list of game tile valid moves.
    function editBoardValidMoves(uint256 boardId, uint256[][] memory validMoves) external onlyOwner {
        // Create the board.
        GameBoard b = boards[boardId];

        // Set the board layout, because contructors don't like arrays.
        b.setAllValidMoves(validMoves);
    }

    // @notice Allows owner to edit a game board.
    // @dev udpates existing board with new layout of boosters.
    // @param boardId the board Id to update.
    // @param validMoves the list of game tile valid moves.
    function editBoardLayout(uint256 boardId, uint256[] memory layout) external onlyOwner {
        // Create the board.
        GameBoard b = boards[boardId];

        // Set the board layout, because contructors don't like arrays.
        b.setTileLayout(layout);
    }

    // @notice Allows the owner to add a new booster.
    // @dev creates a new booster with the passed params.
    // @param productivityBoost the boost for productivity.
    // @param swipeBoost the boost for swiping.
    function addBooster(uint256 productivityBoost, uint256 swipeBoost) external onlyOwner {
        // Add booster to global list of boosters, after creating it, assigning a static ID and boost values.
        boosters.push(new Booster(boosters.length, productivityBoost, swipeBoost));
    }

    // @notice Allows the user to join a game.
    // @dev fetches the game state, and player from the game state map and sets their next move.
    // @param id the game id.
    function joinGame(uint256 id) external payable {
        require(msg.value == joinCost * 1 ether, "It costs CANTO to play this game!");

        // Fetch game by ID.
        GameState game = games[id];
        
        // Double check it's not the person joining.
        require(address(game.getPlayer(msg.sender)) == address(0), "");

        // Add player to that specific game.
        Player p = new Player(
            msg.sender, 
            game.getId(), 
            game.getStartTile()
        );

        // Add the player created to the global list of players for historical stats.
        players[msg.sender].push(p);

        // Join that player to that game.
        game.join(p);
    }

    // @notice Allows the owner to start a game.
    // @dev Allows the owner to start a game that already has been created by id.
    // @param id the game id.
    function startGame(uint256 gameId) external onlyOwner {
        GameState state = games[gameId];
        require (state.numPlayers() > 1, "Can't start with less than 2 players!");
        state.start();
    }

    // @notice Allows the user to set move for the current epoch.
    // @dev fetches the game state, and player from the game state map and sets their next move.
    // @param id the game id.
    // @param tile the tile id to move to.
    function setMove(uint256 id, uint256 tile) external {
        // TODO need a way to calculate if the move is valid, otherwise this needs to be
        // locked down so that we have a front end layer between this and the end user.
        GameState state = games[id];
        Player player = state.getPlayer(msg.sender);
        uint256 current = player.getCurrent();
        require(state.isMoveValid(current, tile), "Invalid move.");
        player.setMove(tile);
    }

    // @notice Allows the user to set swipe move for the current epoch.
    // @dev fetches the game state, and player from the game state map and sets their next swipe.
    // @param id the game id.
    // @param tile the tile id to swipe from.
    function setSwipe(uint256 id, uint256 tile) external {
        GameState state = games[id];
        Player player = state.getPlayer(msg.sender);
        player.setSwipe(tile);
    }

    // @notice Allows the user to update a game state.
    // @dev fetches the game state, and updates it
    // @param id the game id.
    function update(uint256 id) external {
        GameState state = games[id];
        state.update();
    }

    // @notice Allows the user to get their game board object ref.
    // @dev returns ref representation of a game board.
    // @param index the index of the game board to fetch.
    // @return the ref representation of a game board.
    function getBoard(uint256 index) external view returns (GameBoard) {
        return boards[index];
    }

    // @notice Allows the user to get their game board as a list of numbers.
    // @dev returns int array representation of a game board.
    // @param index the index of the game board to fetch.
    // @return the int array representation of a game board.
    function getBoardLayout(uint256 index) external view returns (uint256[] memory) {
        return boards[index].getTiles();
    }

    // @notice Allows the user to get the valid moves for a tile.
    // @dev returns int array representation of the valid moves for a tile.
    // @param index the index of the game board to fetch.
    // @param tile the tile to fetch valid moves for.
    // @return the int array representation of the valid moves for a tile.
    function getValidMoves(uint256 index, uint256 tile) external view returns (uint256[] memory) {
        return boards[index].getValidMoves(tile - 1);
    }

    // @notice Allows the user to get their player history as a list of Player objects.
    // @dev returns Player array representation of a all games played by the address.
    // @param a the address of the player to fetch.
    // @return player array representation of a all games played by the address.
    function getPlayerHistory(address a) external view returns (Player[] memory) {
        return players[a];
    }

    // @notice Allows fetching the game state by index.
    // @dev returns gamestate fetched by array index, all players instances are tied to a gamestate.
    // @param id the ID of the GameState to fetch.
    // @return player array representation of a all games played by the address.
    function getGame(uint256 id) external view returns (GameState) {
        return games[id];
    }

    // @notice Initializes a basic game board for the base game, basic boosters and other variables.
    // @dev only to be used in the constructor, never again. You could run it again, but no point.
    function init() internal {
        // Add default boosters.
        // NONE booster, does nothing. Placeholder for null.
        boosters.push(new Booster(boosters.length, 0, 0));

        // Productivity booster (ID = 1).
        boosters.push(new Booster(boosters.length, 20, 0));

        // Swiping booster (ID = 2).
        boosters.push(new Booster(boosters.length, 0, 20));

        // Creates new game board b with ID 0.
        GameBoard b = new GameBoard(boards.length, 19);

        // Shape of this board: https://i.imgur.com/uprzGkt.png

        // Defines the layout of the boosters on the tiles.
        // Also defines basic information like how many tiles there are.
        uint8[40] memory baseLayout = [
              1,0,0,0,1, 
              0,0,0,0,0,
            2,0,0,0,0,0,2,
            0,0,0,0,0,0,0,
            0,0,0,0,0,0,0,
              1,0,0,0,1,
                0,0,0,
                  0
        ];
        
        // Defines which ways you can move off each tile.
        // When a player goes to assign their next move, these are the tiles that will 
        // be highlighted based on which cell they are on. Allowing us to store game board
        // shape on chain in a small foot-print. This should avoid any client-side cheating 
        // on movement verification because the contract KNOWS the shape of the board.
        // Shape of this board: https://i.imgur.com/uprzGkt.png
        uint8[6][40] memory validMoves = [
            [2,7,6,0,0,0],    // Valid moves from 1.
            [1,7,8,3,0,0],  // Valid moves from 2.
            [2,8,4,0,0,0],    // Valid moves from 3.
            [3,8,9,5,0,0],  // Valid moves from 4.
            [4,9,10,0,0,0],   // Valid moves from 5.
            [12,13,7,1,0,0], // Valid moves from 6.
            [1,2,8,14,13,6], // Valid moves from 7.
            [2,3,4,9,14,7], // Valid moves from 8.
            [8,4,5,14,15,10], // Valid moves from 9.
            [5,9,15,16,0,0], // Valid moves from 10.
            [18,19,12,0,0,0], // Valid moves from 11.
            [11,19,20,13,6,0], // Valid moves from 12.
            [6,7,14,12,20,21], // Valid moves from 13.
            [7,8,9,13,21,15], // Valid moves from 14.
            [14,9,10,21,22,16], // Valid moves from 15.
            [10,15,22,23,24,0], // Valid moves from 16.
            [16,23,24,0,0,0], // Valid moves from 17.
            [11,19,26,25,0,0], // Valid moves from 18.
            [11,12,20,18,26,27], // Valid moves from 19.
            [12,13,21,19,27,28], // Valid moves from 20.
            [13,14,15,20,28,22], // Valid moves from 21.
            [21,15,16,28,29,23], // Valid moves from 22.
            [22,16,17,29,30,24], // Valid moves from 23.
            [17,23,30,31,0,0], // Valid moves from 24.
            [18,26,32,0,0,0], // Valid moves from 25.
            [18,19,27,25,32,33], // Valid moves from 26.
            [19,20,28,26,33,34], // Valid moves from 27.
            [20,21,22,27,34,29], // Valid moves from 28.
            [28,22,23,34,35,30], // Valid moves from 29.
            [29,23,24,35,36,31], // Valid moves from 30.
            [24,30,36,0,0,0], // Valid moves from 31.
            [25,26,33,37,0,0], // Valid moves from 32.
            [26,27,34,32,37,38], // Valid moves from 33.
            [27,28,29,33,38,35], // Valid moves from 34.
            [34,29,30,38,39,36], // Valid moves from 35.
            [35,30,31,39,0,0], // Valid moves from 36.
            [32,33,38,40,0,0], // Valid moves from 37.
            [33,34,35,37,40,39], // Valid moves from 38.
            [38,35,36,40,0,0], // Valid moves from 39.
            [37,38,39,0,0,0]  // Valid moves from 40.
        ];

        // Convert staticly implemented board in constructor for base game
        // into 256 arrays, then convert to first static game board with
        // default id of zero. Board will have the booster layout stored
        // in memory along with the valid move sets from the provided tile.
        uint256[] memory converted = new uint256[](baseLayout.length);
        
        for (uint256 i = 0; i < baseLayout.length; i++) {
            converted[i] = ((uint256)(baseLayout[i]));
            for (uint256 j = 0; j < validMoves[i].length; j++) {
                if (validMoves[i][j] > 0) {
                    b.addValidMove(i, validMoves[i][j] - 1);
                }
            }
        }
        b.setTileLayout(converted);

        // Add the boards to the static list of boards (which can be added to later as well).
        boards.push(b);

        // Set default board to 0.
        defaultBoard = 0;

        // Set default join cost to 0.
        // TODO assign actual join cost after done testing.
        joinCost = 0;
    }

    constructor () {
        init();
    }

  function withdraw(address a) public payable onlyOwner {
      (bool success, ) = a.call{value: address(this).balance}("");
      require(success);
  }
}