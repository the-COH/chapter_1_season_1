import { useEventListener } from "eth-hooks/events/";

import { Button, Steps, Modal, Input, Upload, message, Card, Image } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { ethers } from "ethers";
import React, { useState } from "react";
import { useEffect } from "react";
import { Address } from "../components";

function NftCard({ address, tokenId, yourNFT, NFTManager, blockExplorer, mainnetProvider }) {
  const [tokenMarketData, setTokenMarketData] = useState();
  const [nftInfo, setNftInfo] = useState();

  const onLoadTokenMarketDetails = async () => {
    const marketItemData = await NFTManager.getLatestMarketItemByTokenId(tokenId);
    //     if (marketItemData[1] && marketItemData[0]["canceled"] === false) {
    if (marketItemData[1]) {
      setTokenMarketData(marketItemData[0]);
    }

    const tokenURI = await yourNFT.tokenURI(tokenId);
    console.log("n-tokenURI: ", tokenURI);

    let nftData = await fetch(tokenURI);
    nftData = await nftData.json();
    console.log("n-nftData: ", nftData);
    setNftInfo(nftData);
  };

  useEffect(() => {
    void onLoadTokenMarketDetails();
  }, []);

  const onTest = async () => {
    console.log("n-tokenMarketData: ", tokenMarketData["price"].toString());
    const royaltiInfo = await yourNFT.royaltyInfo(tokenId, tokenMarketData["price"]);
    console.log(`n-🔴 => onTest => royaltiInfo`, ethers.utils.formatEther(royaltiInfo[1].toString()));
  };

  const onBuyNFT = async () => {
    const royaltiInfo = await yourNFT.royaltyInfo(tokenId, tokenMarketData["price"]);
    let finalPrice = Number(nftInfo["price"]) + Number(ethers.utils.formatEther(royaltiInfo[1].toString()));
    let marketId = tokenMarketData["marketItemId"].toString();

    const tx = await NFTManager.createMarketSale(yourNFT.address, marketId, {
      value: ethers.utils.parseEther(String(finalPrice)),
    });
    const rcpt = await tx.wait();
    console.log("n-rcpt: ", rcpt);
    window.location.reload();
  };

  return (
    <div>
      <Card size="medium" title={nftInfo?.name} style={{ width: 300 }}>
        <Image style={{ width: "100%", borderRadius: "5%" }} preview={false} src={nftInfo?.image} />
        <div className="flex flex-col">
          <p>{nftInfo?.description}</p>
          <p className="text-xl">
            {tokenMarketData && ethers.utils.formatEther(tokenMarketData["price"].toString())} ETH
          </p>
        </div>
        <div className="flex flex-row justify-between">
          {/* <div className="text-left">
            <p>Creator</p>
            <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={10} />
          </div> */}
          {/* <p className="text-sm text-gray-400">
            <span className="">Royalty:</span>
            {nftInfo && nftInfo["royalty"]} Eth
          </p> */}
        </div>
        <button className="btn-buy py-3" onClick={onBuyNFT}>
          Buy
        </button>

        {/* <Button onClick={onTest}>test</Button> */}
      </Card>
    </div>
  );
}

function MarketPlace({
  address,
  readContracts,
  writeContracts,
  localProvider,
  userSigner,
  blockExplorer,
  mainnetProvider,
}) {
  const yourNFT = writeContracts["YourNFT"];
  const NFTmanager = writeContracts["NFTManager"];

  const [userTokens, setUserTokens] = useState([]);

  const loadUserNFTs = async () => {
    let userTokens = [];

    const availableMarketItems = await NFTmanager.fetchAvailableMarketItems();
    const availableTokenIds = availableMarketItems.map(data => +data["tokenId"].toString());
    console.log("n-availableTokenIds: ", availableTokenIds);

    if (availableTokenIds.length > 0) {
      userTokens = [...new Set([...userTokens, ...availableTokenIds])];
    }

    setUserTokens(userTokens.sort());
  };

  useEffect(() => {
    if (yourNFT) {
      void loadUserNFTs();
    }
  }, [yourNFT]);

  //   console.log("n-userTokens: ", userTokens);

  return (
    <div className="m-2 flex flex-col items-center">
      {/* your nft list */}
      <h1 className="text-xl mt-2">Market place NFT's</h1>
      <div className="flex flex-col lg:flex-row flex-wrap justify-center ">
        {yourNFT &&
          NFTmanager &&
          userTokens.map(tokenId => (
            <div key={tokenId} className="m-5">
              <NftCard
                address={address}
                tokenId={tokenId}
                yourNFT={yourNFT}
                NFTManager={NFTmanager}
                blockExplorer={blockExplorer}
                mainnetProvider={mainnetProvider}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default MarketPlace;
