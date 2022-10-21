// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./Player.sol";
import "./GameBoard.sol";
import "./Tile.sol";
import "./MeepMeep.sol";

// TODO the gamestate and the player need to be polished so that they can scale more.
//
// @title The GameState for all MeepMeep game sessions.
// @author Devneck
// @notice The game state holds all information related to each individual game session and ties 
//         together all of the other objects into a single instance, including players, board layout,
//         tiles and all other data needed to play the game on chain.
// @dev This contract holds all game state information, tiles to be garbage collected after ended = true.
contract GameState {
    // @notice the id for this game state.
    // @dev the auto-increment meepmeep assigned id for this game state.
    uint256 public gameId;

    // @notice the  epoch we are currently in out of max epochs (epochCount).
    // @dev 0 <= currentEpoch <= epochCount, 0 until start() is called.
    uint256 public currentEpoch;

    // @notice the total number of epochs in this game.
    // @dev sets the number of rounds for this game.
    uint256 public epochCount;
    
    // @notice timestamp of when the game was started.
    // @dev block.timestamp when this game was started.
    uint256 public epochStart;

    // @notice length, in miliseconds, of each epoch.
    // @dev block.timestamp delta.
    uint256 public epochLength;

    // @notice whether or not this game was started.
    // @dev false until start() is called.
    bool public started;

    // @notice whether or not this game has ended.
    // @dev false until currentEpoch == epochCount, which will update with each update() call.
    bool public ended;

    // @notice the board layout, and valid moves template for this game state.
    // @dev false until currentEpoch == epochCount, which will update with each update() call.
    GameBoard public board;

    // @notice the tiles that represent the player aggregations, swipes and moves on the game state's board layout.
    // @dev represents all tiles of the board and contains all players related to the board state.
    Tile[] public tiles;

    // @notice the current number of players who paid to join this game.
    // @dev represents all tiles of the board and contains all players related to the board state.
    uint256 public numPlayers;

    // @notice the mapping of address to player.
    // @dev for specific access when a user interacts directly with the GameState.
    mapping(address => Player) public players;

    // @notice the keyset of players.
    // @dev the keyset of players.
    address[] public wallets;

    constructor(uint256 id, GameBoard gb, uint256 eLength, uint256 eCount) {
        gameId = id;
        board = gb;
        currentEpoch = 0;
        started = false;
        ended = false;
        epochLength = eLength;
        epochCount = eCount;
        tiles = new Tile[](0);
        numPlayers = 0;
        for (uint256 i = 0; i < tiles.length; i++) {
            tiles.push(new Tile(i));
        }
    }

    // @dev fails if the game is started.
    modifier isNotStarted {
        require(!started, "Cannot perform this action on an in-progress game.");
        _;
    }

    // @dev fails if the game is not started or is ended.
    modifier isStarted {
        require(started && !ended, "Cannot perform this action on a new game / ended game.");
        _;
    }

    // @dev fails if the game is not ended.
    modifier isEnded {
        require(ended, "Cannot perform this action on a ended game.");
        _;
    }

    // STATE FUNCTIONS
    function join(Player p) public isNotStarted {
        players[p.getWallet()] = p;
        numPlayers++;
        wallets.push(msg.sender);
    }

    // @notice the main driving function of meep meep, performs an epoch swapover and updates all tiles.
    //         All players can call this function from outside of the contract using the UI when epochs are swapping to reveal.
    // @dev Calls updateo n tiles, resets player moves, swaps over epoch, all game state updates aggregate up to this method.
    // TODO potentially implement a rebat method for players who spend gas on the update method, refunding their entry cost.
    function update() external isStarted {
        require (epochStart + epochLength < block.timestamp, "Can't update, epoch not over.");
        require (currentEpoch <= epochCount, "All epochs completed, game should be finalized.");


        // Handles board, tiles, egg mechanic, etc...
        // Resets tiles for next epoch. 
        for (uint256 i = 0; i < tiles.length; i++) {
            tiles[i].update();
        }

        // Essentially called to cleanup player moves, reset everything.
        for (uint256 x = 0; x < tiles.length; x++) {
            Player[] memory p = tiles[x].getPlayers();
            for (uint256 y = 0; y < p.length; y++) {
                uint256 move = p[y].getMove();
                if (move > 0) {
                    tiles[move - 1].setMove(p[y]);
                } else {
                    // TODO decide if we want to do something special on AFK scenarios.
                }
                p[y].update();
            }
        }

        // increase epoch.
        currentEpoch++;

        // note when this next epoch has started.
        epochStart = block.timestamp;

        // if the epoch has surpassed the maximum number of epochs, that was it, end the game.
        if (currentEpoch > epochCount) {
            finalize();
        }
    }


    // @notice starts the game.
    // @dev sets epoch to 1 and sets current timestamp, sets started to true.
    function start() public isNotStarted {
        currentEpoch = 1;
        epochStart = block.timestamp;
        started = true;
    }

    // @notice gets the game board of this game state.
    // @dev the game board object of this game state.
    // @return game state's game board.
    function getBoard() public view returns (GameBoard) {
        return board;
    }

    // @notice adds a booster at the specified index.
    // @dev alters the tile state of this game state, unused.
    function addBooster(uint256 index, Booster b) public {
        tiles[index].addBooster(b);
    }

    // @notice returns the id of this game.
    // @dev returns the auto-increment id of this game state as assigned by meep meep.
    // @returns the game id.
    function getId() external view returns (uint256) {
        return gameId;
    }

    // @notice returns the player object assigned to the wallet provided.
    // @dev returns the player at index (a) of this game state.
    // @param a the address of the wallet of the player to grab.
    // @returns player belonging to the proviided address.
    function getPlayer(address a) external view returns (Player) {
        return players[a];
    }

    // @notice returns all wallets that have joined the game.
    // @dev returns all wallets that have joined the game.
    // @returns all wallets that have joined the game.
    function getWallets() external view returns (address[] memory) {
        return wallets;
    }

    // @notice returns true if move is in the list of valid moves for the from tile.
    // @dev valid moves must be set on board after constructor call.
    // @param from the tile we want to move from.
    // @param to the tile we want to move to.
    // @returns true if the move is valid, false otherwise.
    function isMoveValid(uint256 from, uint256 to) public view returns (bool) {
        uint256[] memory arr = board.getValidMoves(from);
        for (uint i = 0; i < arr.length; i++) {
            if (arr[i] > 0 && to == arr[i]) {
                return true;
            }
        }
        return false;
    }

    // @notice returns the tile object at the passed index.
    // @dev returns the tile object which holds the link between player and game state.
    // @param i the index of the tile to grab.
    // @returns the tile object at the passed index.
    function getTile(uint256 i) public view returns (Tile) {
        return tiles[i];
    }

    // @notice returns all tile objects.
    // @dev returns the tile objects tied to this game state.
    // @returns an array of game tiles.
    function getTiles() public view returns (Tile[] memory) {
        return tiles;
    }

    // @notice returns the starting tile.
    // @dev returns the starting tile as a uint256 index.
    // @returns the starting tile.
    function getStartTile() public view returns (uint256) {
        return board.getStartTile();
    }
 
    // @dev nukes the tiles, they're not needed after the game is ended.
    //      should decrease the weight of some of the other calls for aggregation.
    function gc() internal {
        // Clear unessecary gamestate data.
        delete tiles;
    }  

    // @notice finalizes the game state.
    // @dev can only be called when currentEpoch >= epochCount.
    function finalize() internal isStarted {
        require (currentEpoch >= epochCount, "All epochs not completed yet.");
        ended = true;
        gc();
    }
}