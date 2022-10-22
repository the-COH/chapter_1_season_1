# Kanto

## On-chain NFT Game

Kanto is a pokemon-themed slot machine game that's fully on-chain. The players purchase pokeballs with Canto and use the pokeballs to make bets to capture pokemons. We've built in 4 types of pokeballs, each comes at a different price and give the players different odds of capturing pokemons.

The game is built on top of the ERC-1155 multi-token standard where each type of pokemon is represented as a type of token. The mint function of the ERC-1155 contract has been written calculate the probability of capturing a pokemon depending on the terrain that the player is walking on as well as the pokeball the player decides to use. If the capturing is successful, the \_safeMint function is called to capture a specific pokemon, if the capturing fails, an event is still fired to let the player know which pokemon they've just missed out on. Once a pokemon is captured, the players have the option to sell the pokemon back for Canto. Rarer pokemons sells back for higher prices.

## Gameplay
- Player purchases pokeballs (6 regular pokeballs for 1 Canto)
- Player walks around the map
- At random intervals, the player will be alerted that a pokemon is encountered, and the player is prompted choose a pokeball to capture the pokemon. The identity of the pokemon is not revealed until after the mint is complete.
- The terrain that the player is walking on will determine the type of pokemon they will be able to capture. The pokeball the player chooses will determine the likelihood the encountered pokemon will be captured
- Player can trade the pokemon back to redeem Canto

## Architecture
One of the most interesting aspects of creating any slot machine type game is calculating the odds of a desirable outcome for the player. The calculation of the odds need to strike the right balance between bringing profitability for the house, and providing the players with enough wins to keep them playing the game. Typically in a commercial slot machine, the odds are fine-tuned over the course of months based on the metrics collected by the casino.

Because some parts of the odds calculation is hard-coded into the contract, we need to keep the Kanto contract modifiable in order to adjust the odds calculation logic later on. As a result, we've opted to use EIP-2325 Diamond architecture to break a monolithic contract into more manageable pieces and to allow functions to be updated individually.

## Next Steps
- Finalize the odds of capturing for each pokemon
- Calculate the trade back price for each pokemon to based on a Return-to-Player (RTP) of 85 - 95%. (RTP is a term used by casino operators to express the total of a slot's wagered amount returned to the players as wins or jackpots).
- Add sound and animation for pokemon captures
- Add additional maps (currently you can only capture a subset of 151 pokemon available in this game because certain terrains have not beed added)