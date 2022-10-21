require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");

module.exports = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    }
  },
  networks: {
    rinkeby: {
      url: "",
      accounts: []
    },
    mainnet: {
      url: "",
      accounts: []
    }
  },
  etherscan: {
    apiKey: ""
  }
};