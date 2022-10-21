const { ethers } = require("hardhat");
const { expect } = require("chai");

// The following test code is disabled because it doesn't work
// Manual testing must be performed at this time

/*
describe("TwoPartyContract", function () {
  it("Check signature", async function () {
    const accounts = await ethers.getSigners(2)
    console.log("signers acquired")

    const TwoPartyContract = await ethers.getContractFactory("TwoPartyContract")
    const contract = await TwoPartyContract.deploy()
    await contract.deployed()
    console.log("contract deployed")

    // const PRIV_KEY = "0x..."
    // const signer = new ethers.Wallet(PRIV_KEY)
    const initiator = accounts[0]
    const counterparty = accounts[1].address
    const ipfsHash = "test"
    const blockNum = 100
    console.log("contract details declared")

    const hash = await contract.getMessageHash(initiator, counterparty, ipfsHash, blockNum)
    console.log("hash of contract details generated")
    const sig = await initiator.signMessage(ethers.utils.arrayify(hash))
    console.log("signature of hash generated")

    const ethHash = await contract.getEthSignedMessageHash(hash)
    console.log("ETH signed message hash generated")

    console.log("signer          ", initiator.address)
    console.log("recovered signer", await contract.recoverSigner(ethHash, sig))

    // Correct signature and message returns true
    console.log("test verification of proper signature")
    expect(
      await contract.verifySignature(initiator.address, counterparty, ipfsHash, blockNum, sig)
    ).to.equal(true)
    console.log("proper signature verified")

    // Incorrect message returns false
    console.log("test verification of improper signature")
    expect(
      await contract.verifySignature(initiator.address, counterparty, ipfsHash + ".", blockNum, sig)
    ).to.equal(false)
    console.log("improper signature verification failed")
  })
})
*/