// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./Booster.sol";
import "./Player.sol";

/// @title An object representation of a single board tile.
/// @author Devneck
/// @notice This holds all players which will be moving to this tile, and all players who will be swiping from it.
/// @dev This is the heart of all the egg generation for players. Based on who is doing what on which tile they
///      will either gain or lose large amounts of eggs. Sometimes even small amounts if they're on a single tile.
///      At the end of the update call on each of these objects all players should be moved, their egg balances updated
///      and all swipers should have stolen eggs from the people on this tile as well.
contract Tile {
    // @notice The ID of the tile, matches current board square index.
    // @dev The ID of the tile, matches current board square index.
    uint256 tileId;

    // @notice The booster on the tile.
    // @dev The booster that this tile has present.
    Booster public booster;

    // @notice The array of players currently on the tile.
    // @dev Represents all players currently residing on the tile for swipe calculations + productivity calcs.
    Player[] public players;

    // @notice The array of swipers currently on the tile.
    // @dev Represents all swipers currently residing on the tile for swipe calculations + productivity calcs.
    Player[] public swipers;

    // @notice The total swipe rating of this tile.
    // @dev The aggregate swipe rating of all tile.swipers for calculation of stolen eggs.
    uint256 public swipeRating;

    // @notice The total productivity rating of this tile.
    // @dev The aggregate productivity rating of all tile.players for calculation of produced eggs.
    uint256 public productivityRating;

    constructor (uint256 id) {
        tileId = id;
    }

    // @dev by the end of this call, players egg balances are updated, players is empty, swipers is empty
    // @dev ratings updated, players have NOT been moved, this is handled after in aggregate at GameState level.
    function update() public {
        // Update all player data w/ new boosters.
        // Required if there is a booster on this tile, otherwise no.
        if (booster.getBoosterId() > 0) {
            for (uint256 i = 0; i < players.length; i++) {
                bool boost = true;
                uint256[] memory boosters = players[i].getBoosters();
                for (uint256 j = 0; j < boosters.length; j++) {
                    if (boosters[j] == booster.getBoosterId()) {
                        boost = false;
                    }
                }
                if (boost) {
                    players[i].applyBoost(booster);
                }
            }
        }

        // Calculate the productivity and swipe ratings on the tiles.
        // Cache them for later use on the UI for the reveal stage.
        swipeRating = calculateSwipeRating();
        productivityRating = calculateProductivityRating();

        // Calculate num eggs to be added / removed.
        // TODO replace all the calcs with actual calcs.
        // TODO balance these calcs, and get them audited.
        // Left out for the purpose of hackathon.
        uint256 eggsAdded = 1 * productivityRating;
        uint256 eggsSwiped = 1 * swipeRating;

        // Update the players egg balance (ones in current tile).
        // Remove all players from current tile to set up next epoch.
        // Could just call clearPlayers() but this saves gas.
        while (players.length > 0) {
            players[0].addEggs(eggsAdded);
            players[0].removeEggs(eggsSwiped);
            players.pop();
        }

        // Update swiper egg balance, ones swiping on this tile.
        // Remove all swipers from current tile to set up next epoch.
        // Could just call clearSwipers() but this saves gas.
        while (swipers.length > 0) {
            players[0].addEggs(eggsSwiped);
            swipers.pop();
        }
    }

    // @notice Returns the number of people moving to this tile.
    // @dev Returns the number of people moving to this tile.
    // @return number of people moving here.
    function numPlayers() external view returns (uint256) {
        return players.length;
    }

    // @notice Returns the number of people swiping on this tile.
    // @dev Returns the number of people swiping on this tile.
    // @return number of people swiping here.
    function numSwipers() external view returns (uint256) {
        return swipers.length;
    }

    // @notice Returns the ID of this tile.
    // @dev returns the ID (which is also the board index) of the tile.
    // @return the ID of the tile.
    function getId() external view returns (uint256) {
        return tileId;
    }

    // @notice Returns the players (producers) tied to this specific tile.
    // @dev returns the swipers on the tile as Player entities in an array.
    // @return the people moving to this tile.
    function getPlayers() external view returns (Player[] memory) {
        return players;
    }

    // @notice Returns the players (swipers) tied to this specific tile.
    // @dev returns the swipers on the tile as Player entities in an array.
    // @return the swipers on this tile.
    function getSwipers() external view returns (Player[] memory) {
        return swipers;
    }

    // @notice Returns the booster tied to this specific tile.
    // @dev returns the booster on the tile.
    // @return the booster tied to this specific tile.
    function getBooster() external view returns (Booster) {
        return booster;
    }

    // @notice Returns a cached version of the tiles productivity rating for the previous turn.
    // @dev returns the sum, not average, of player swipes ratings (last turn) or null.
    function getProductivityRating() external view returns (uint256) {
        return productivityRating;
    }

    // @notice Returns a cached version of the tiles swipe rating for the previous turn.
    // @dev returns the sum, not average, of player swipes ratings (last turn) or null.
    function getSwipeRating() external view returns (uint256) {
        return swipeRating;
    }

    // @notice Calculates the total swipe rating for all swipers in the tile.
    // @dev returns the sum, not average, of player swipes ratings.
    function calculateSwipeRating() internal view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < swipers.length; i++) {
            sum += swipers[i].getSwipeRating();
        }
        return sum;
    }

    // @notice Calculates the total productivity rating for all players in the tile.
    // @dev returns the sum, not average, of player productivity ratings.
    function calculateProductivityRating() internal view returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < players.length; i++) {
            sum += players[i].getProductivityRating();
        }
        return sum;
    }

    // @notice Adds a swipers to the internal tile queue, used for turns.
    // @dev alters the tile state.
    function setMove(Player p) public {
        p.setMove(tileId);
        players.push(p);
    }

    // @notice Adds a swipers to the internal tile queue, used for turns.
    // @dev alters the tile state.
    function setSwipe(Player p) public {
        p.setSwipe(tileId);
        swipers.push(p);
    }

    // @notice Pops all swipers from the internal tile queue, used for turns.
    // @dev alters the tile state.
    function clearSwipers() internal {
        while (swipers.length > 0) {
            swipers.pop();
        }
    }

    // @notice Pops all players from the internal tile queue, used for turns.
    // @dev alters the tile state.
    function clearPlayers() internal {
        while (players.length > 0) {
            players.pop();
        }
    }

    // @notice Allows the internal contract to add a booster to this tile.
    // @dev alters the tile state.
    // @param b the booster to add.
    function addBooster(Booster b) public {
        booster = b;
    }
}