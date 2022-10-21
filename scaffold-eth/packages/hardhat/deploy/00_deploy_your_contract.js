// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

const sleep = (ms) =>
  new Promise((r) =>
    setTimeout(() => {
      console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
      r();
    }, ms)
  );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("TwoPartyContract", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const TwoPartyContract = await ethers.getContract("TwoPartyContract", deployer);
  /*  await TwoPartyContract.setPurpose("Hello");
  
    // To take ownership of TwoPartyContract using the ownable library uncomment next line and add the 
    // address you want to be the owner. 
    
    await TwoPartyContract.transferOwnership(
      "ADDRESS_HERE"
    );

    //const TwoPartyContract = await ethers.getContractAt('TwoPartyContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const TwoPartyContract = await deploy("TwoPartyContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const TwoPartyContract = await deploy("TwoPartyContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  console.log("Sleeping for 65 seconds to allow Etherscan some time to see contract bytecode.");
  await sleep(65000); // Sleep to give Etherscan chance to see the deployed bytecode
  try {
    if (chainId !== localChainId) {
      await run("verify:verify", {
        address: TwoPartyContract.address,
        contract: "contracts/TwoPartyContract.sol:TwoPartyContract",
        constructorArguments: [],
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["TwoPartyContract"];
