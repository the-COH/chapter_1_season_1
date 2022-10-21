import { ethers } from "ethers";
import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { INFURA_ID, NETWORKS } from "../constants";
import { List } from "antd";
import { Address, AddressInput, BytesStringInput } from "../components";
import { create as ipfsHttpClient } from "ipfs-http-client";

// 😬 Sorry for all the console logging
const DEBUG = true;

/// 📡 What chain are your contracts deployed to?
const targetNetwork = NETWORKS.goerli; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
const localProviderUrlFromEnv = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER : localProviderUrl;
if (DEBUG) console.log("🏠 Connecting to provider:", localProviderUrlFromEnv);
const localProvider = new ethers.providers.StaticJsonRpcProvider(localProviderUrlFromEnv);

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://rpc.scaffoldeth.io:48544")
  : null;
const poktMainnetProvider = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider(
      "https://eth-mainnet.gateway.pokt.network/v1/lb/611156b4a585a20035148406",
    )
  : null;
const mainnetInfura = navigator.onLine
  ? new ethers.providers.StaticJsonRpcProvider("https://mainnet.infura.io/v3/" + INFURA_ID)
  : null;
// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_ID

// IPFS stuff
const projectId = "projectId";
const projectSecret = "projectSecret";
const authorization = "Basic " + btoa(projectId + ":" + projectSecret);

const ipfs = ipfsHttpClient({
  url: "https://ipfs.infura.io:5001/api/v0",
  headers: {
    authorization
  }
})

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  const mainnetProvider =
    poktMainnetProvider && poktMainnetProvider._isProvider
      ? poktMainnetProvider
      : scaffoldEthProvider && scaffoldEthProvider._network
      ? scaffoldEthProvider
      : mainnetInfura;
  // you can also use hooks locally in your component of choice

  const [injectedProvider, setInjectedProvider] = useState();
  const [address, setAddress] = useState();

  // Events
  const contractCreatedEvents = useEventListener(readContracts, "TwoPartyContract", "ContractCreated", localProvider, 1);
  console.log("📟 contractCreatedEvents:", contractCreatedEvents);

  const contractSignedEvents = useEventListener(readContracts, "TwoPartyContract", "ContractSigned", localProvider, 1);
  console.log("📟 contractSignedEvents:", contractSignedEvents);

  const contractExecutedEvents = useEventListener(readContracts, "TwoPartyContract", "ContractExecuted", localProvider, 1);
  console.log("📟 contractExecutedEvents:", contractExecutedEvents);
  
  return (
    <div>
      <div style={{ width: 500, margin: "auto", marginTop: 24, fontSize: 24 }}>
        <b>Create your Contract</b>
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 24 }}>
        Your Name: <BytesStringInput autoFocus placeholder="Enter your name" />
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 8 }}>
        Contract Name/Description: <BytesStringInput autoFocus placeholder="Enter contract name/description" />
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 8 }}>
        Counterparty Address: <AddressInput autoFocus ensProvider={mainnetProvider} placeholder="Enter counterparty address" />
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 8 }}>
        Counterparty Name: <BytesStringInput autoFocus placeholder="Enter counterparty name" />
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 8 }}>
        <div><b>This entire section should technically take document upload and pass the IPFS path to the createTwoPartyContract() function behind the scenes</b></div>
        IPFS Path: <BytesStringInput autoFocus placeholder="Enter IPFS path" />
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 24 }}>
        <b>Place button that calls createTwoPartyContract() with the above data here</b>
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 32 }}>
        <div>Contract Created Events:</div>
        <List
          dataSource={contractCreatedEvents}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber + item.blockHash}>
                <Address value={item.args[1]} ensProvider={mainnetProvider} fontSize={16} /> created contract {item.args[0]} 
                {" "} with <Address value={item.args[2]} ensProvider={mainnetProvider} fontSize={16} /> in block {item.blockNumber}
              </List.Item>
            );
          }}
        />
      </div>

      <div style={{ width: 500, margin: "auto", marginTop: 24, fontSize: 24 }}>
        <b>Sign your Contract</b>
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 24 }}>
        <div><b>This section should iterate through relatedContracts[connected address] to pull up any hashes for contracts that haven't been signed yet</b></div>
        Contract Hash: <BytesStringInput autoFocus placeholder="Enter contract hash" />
        Signature: <BytesStringInput autoFocus placeholder="Enter signature" />
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 24 }}>
        <b>Place button that calls signContract() with the above data here</b>
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 32 }}>
        <div>Contract Signed Events:</div>
        <List
          dataSource={contractSignedEvents}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber + item.blockHash}>
                <Address value={item.args[1]} ensProvider={mainnetProvider} fontSize={16} /> signed contract {item.args[0]} 
                {" "} in block {item.blockNumber}
              </List.Item>
            );
          }}
        />
      </div>

      <div style={{ width: 500, margin: "auto", marginTop: 24, fontSize: 24 }}>
        <b>Execute your Contract</b>
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 24 }}>
        <div><b>This section should iterate through relatedContracts[connected address] to 
          display all contracts with all required signatures and an Execute button next 
          to each. Displaying contract description instead of hash would be best</b></div>
        Contract Hash: <BytesStringInput autoFocus placeholder="Enter contract hash" />
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 24 }}>
        <b>Place button that calls executeContract() with the above data here</b>
      </div>
      <div style={{ width: 500, margin: "auto", marginTop: 32 }}>
        <div>Contract Executed Events:</div>
        <List
          dataSource={contractExecutedEvents}
          renderItem={item => {
            return (
              <List.Item key={item.blockNumber + item.blockHash}>
                <Address value={item.args[1]} ensProvider={mainnetProvider} fontSize={16} /> executed contract {item.args[0]} 
                {" "} in block {item.blockNumber}
              </List.Item>
            );
          }}
        />
      </div>
      <div style={{ margin: 32 }}>
        This is the Thoth frontend.
      </div>
      <div style={{ margin: 32 }}>
        Interact with the smart contract using{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          <Link to="/debug">"Debug Contract"</Link>
        </span>{" "}
        for now.
      </div>
      <div style={{ margin: 32 }}>
        Signing functionality will need to be built as that is done by front-end. Use <a href="https://signator.io/">https://signator.io/</a> for now.
      </div>
      <div style={{ margin: 32 }}>
        If manually testing, make sure you sign the contract hash, aka output from{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          getMessageHash()
        </span>{" "}
        stored in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          contractHashes
        </span>{" "}
        , NOT output from{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
        getEthSignedMessageHash()
        </span>{" "}
      </div>
      <div style={{ margin: 32 }}>
        App flow is as follows:
      </div>
      <div style={{ margin: 32 }}>
        1. Call{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          createTwoPartyContract(Party1 Account, Party2 Account, IPFS Pointer to Contract Document)
        </span>{" "}
        to generate and store contract hash in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          contractHashes
        </span>{" "}
        mapping
      </div>
      <div style={{ margin: 32 }}>
        NOTE: Step 1 will populate mappings{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          contractParties, contractIpfsHash, contractBlock
        </span>{" "}
        with their respective data via call to{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          hashContract()
        </span>{" "}
        in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          createTwoPartyContract()
        </span>{" "}
      </div>
      <div style={{ margin: 32 }}>
        NOTE: You may need to retrieve the block number contract initiation occurred in as frontend doesn't return the block number yet <a href="https://goerli.etherscan.io/">https://goerli.etherscan.io/</a>
      </div>
      <div style={{ margin: 32 }}>
        2. Call{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          contractHashes[<em>Party1 Address</em>][<em>Party2 Address</em>][<em>IPFS Pointer to Contract Document</em>][<em>Block Number Agreement Proposed In</em>]
        </span>{" "}
        to retrieve contract hash
      </div>
      <div style={{ margin: 32 }}>
        3. Sign contract hash retrieved in Step 2
      </div>
      <div style={{ margin: 32}}>
        NOTE: Front end doesn't support signing yet. Substitute with <a href="https://signator.io/">https://signator.io/</a> for now.
      </div>
      <div style={{ margin: 32 }}>
        4. Commit signature from step 3 to blockchain using{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          signContract()
        </span>{" "}
      </div>
      <div style={{ margin: 32}}>
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          signContract()
        </span>{" "}
        will generate an Ethereum signed message with{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          getEthSignedMessageHash()
        </span>{" "}
        using contract hash in{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          contractHashes
        </span>{" "}
      </div>
      <div style={{ margin: 32 }}>
        It will then check the output of{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          getEthSignedMessageHash()
        </span>{" "}
        against the supplied signature from Step 3 using{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          verifySignature()
        </span>{" "}
        to check for validity before storing the signature
      </div>
      <div style={{ margin: 32 }}>
        5. Counterparty will sign (<a href="https://signator.io/">https://signator.io/</a>) the contract hash and call{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          signContract()
        </span>{" "}
        as well to commit their signature to the contract storage
      </div>
      <div style={{ margin: 32 }}>
        NOTE: The contract will automatically execute once the counterparty signs (check{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          contractExecuted[<em>contract hash</em>]
        </span>{" "}
        to confirm)
      </div>
      <div style={{ margin: 32 }}>
        Lastly, someone can call{" "}
        <span
          className="highlight"
          style={{ marginLeft: 4, /* backgroundColor: "#f9f9f9", */ padding: 4, borderRadius: 4, fontWeight: "bolder" }}
        >
          verifyExecution(<em>contract hash</em>)
        </span>{" "}
        to check if all parties have signed with valid signatures
      </div>
      <div style={{ margin: 32 }}>
        GITHUB: <a href="https://github.com/Zodomo/Thoth/blob/main/scaffold-eth/packages/hardhat/contracts/TwoPartyContract.sol">https://github.com/Zodomo/Thoth/blob/main/scaffold-eth/packages/hardhat/contracts/TwoPartyContract.sol</a>
      </div>
    </div>
  );
}

export default Home;
