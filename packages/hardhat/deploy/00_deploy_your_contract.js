// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("NFTManager", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: ["0x0fAb64624733a7020D332203568754EB1a37DB89"],
    log: true,
    waitConfirmations: 5,
  });

  const NFTManager = await ethers.getContract("NFTManager", deployer);
  console.log("NFTManager: address ", NFTManager.address);

  await deploy("YourNFT", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      NFTManager.address,
      // "0x0fAb64624733a7020D332203568754EB1a37DB89",
    ],
    log: true,
    waitConfirmations: 5,
  });
};
module.exports.tags = ["YourNFT", "NFTManager"];
