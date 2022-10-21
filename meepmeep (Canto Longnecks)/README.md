# Meep Meep
## _The First On-chain Game on CANTO_

Meep Meep is an on-chain game featuring emus where the goal is to lay (and steal) as many eggs as possible.

- Owner creates a lobby.
- Players join up, paying a fee.
- Owner starts up the game.
- Players move and swipe repeatedly.
- At the end, one player has the most eggs.
- They win (and so does the house).

### Developer Notes (Things to Keep in Mind)
- For the purpose of the hackathon, we focused on having enough to viably explain the idea, not complete it.
- Visibility of internal items was not prioritized and most were left public for testing.
- We realize these are obviously exploitable, and will review, optimize and slash for final implementation.
- We will revisit and add whitelist capabilities for inter-contract interaction.
- Tests have yet to be written for this, and will be written after visibility issues are addressed.
- UI current implementation is minimal, however we've created endless plans and mockups for the UI.
- All mockups were done, professionally, in illustrator and are labeled with viable IDs.
- These can be exported as SVGs and imported directly into React to create easy game assets.

## Current Features
### Contract Summary
- Contract consists of six parts: MeepMeep, GameState, Player, Tile, GameBoard, Booster
- MeepMeep stitches all parts together and allows for a static reference for the UI to use.
- GameState is the aggregation of all player states and tile states, allows for the game to update all tiles at once.
- Tile holds two different sets of players, one set being the swipers for the tile and the other being the producers.
- Player objects are tied to both GameStates and wallets and hold the status of the wallet for each game state.
- GameBoard/Booster are tied together to store both the layout of the board and allow for customizable booster rates.
- GameBoards can be added using accessor methods, and consist of a single integer array + a 2d integer array.
- This allows for us to continually add new boards for custom games at any time and change booster rates, all on chain.
- Please note, once again, that method visibility is not finalized and we will implement whitelisting between contracts.
- Interactable.sol is unused, but is an extension of Ownable which will be used for game control in next steps.

### Storing Boards On-Chain
- Boards can feature tiles of any shape and any size.
- The base board shape is in that of an egg as [shown below, and in the image here.](https://i.imgur.com/uprzGkt.png)
     ```
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
     ```
 - The starting cell for our default board is 20 (the cell in the center) the cells are labeled sequentially (1,2,3,4,5,6...)
 - It also has a maximum/minimum adjacency of 6 (they are hexagaons). 
 - For instance, if we wanted to define the possible moves from the central hexagon of `21` we'd assign `[13,14,15,20,22,28]` for our moves at index `21`. 
 - This means if you are on tile 21, you can move to tiles `[13,14,15,20,22,28]`.
 - If you wanted to create a simple square map (no boosters) `[0,0,0,0]` and `[[2,3],[1,4],[1,4],[2,3]]` would do it.
 - Finally the numbers in the board layout represent booster IDs. 
 - The owner can add more boosters with different rates and then update the boards to use them.

### UI Summary
- The UI will consist of 5 major panels: GameBoard, GameChat, GameLeaderboard, GameHeatmap, GameLogs
- GameBoard will obviously hold all the movement of players, swipes and display information about where people are.
- GameHeatmaps show data used to decide moves including swiped cells, where players are currently and your swipes.
- GameChat is just chat, it will likely be tied to the current game state only, so people can only talk to each other.
- GameLeaderboards are an aggregation of all players sorted by who has the most eggs (who is in first).
- GameLogs are a list of all previous moves, swipes and other things that occurred in the previous round.
- There will be additional utility pages including a landing page, game list and a few more pages.

## Planned Features
### MEEP MEEP Cosmetic Items (subject to change):
- Cosmetic items will be the main purpose of the NFTs, and the way we integrate them into the game.
- Being the holder of 1 NFT (or multiple) unlocks all the meta-data traits your NFT owns for use in the game.
- You can mix-and-match any of the traits you've unlocked in the cosmetic editor in your profile.
- For those who don't have enough canto to afford a longneck, you can also unlock cosmetic items.
- Cosmetic items are unlocked via the in-game currency eggs, which are earned through playing.
- The main way to get a lot of cosmetic items without playing for hours is to own many NFTs!

### Testing Plan
- MEEP MEEP is currently just a prototype, and was developed in under 2 weeks.
- Testing plan is what will come next immediately following hackathon.
- Rudimentary testing has been completed, with a full GameState having been progressed manually.
- Will create hardhat tests/foundry test suites to mimic many players (even loads up to 100).
- Plan to also have code audited when finished, and will scale using subgraph to eliminate infinitely growing storage.

### UI Plan
- UI prototype is already being developed in react, barely in the infant stages.
- Plan to use sub-graph and (possibly) host a public sub-graph is required for the UI to function.
- All mockups shown in the video are exported as SVGs and will serve as the UI.
- We've essentially made nearly all art assets at the same time as our presentation.
- Layers are functionally named, and can be adapted to import directly as react components.
- Will likely use MUI, MOBX store, ether-js, and a combination of other react plugins.


_There is a lot more to this idea than listed above, but I tried to keep each topic to 5-7 bullet points._

_If you have any questions reach out to DevNeck in the Longnecks Discord._