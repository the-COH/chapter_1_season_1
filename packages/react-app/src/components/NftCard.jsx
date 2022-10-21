import { ethers } from "ethers";
import React, { useState } from "react";
import { useEffect } from "react";
import Address from "./Address";

export default function NftCard({ address, tokenId, yourNFT, NFTManager, mainnetProvider, blockExplorer, ipfs }) {
  const [tokenMarketData, setTokenMarketData] = useState();
  const [isAvailableOnMarket, setIsAvailableOnMarket] = useState(false);
  const [approvedAddress, setApprovedAddress] = useState(ethers.constants.AddressZero);
  const [ownerOfToken, setOwnerOfToken] = useState("");
  const [nftInfo, setNftInfo] = useState();

  const onLoadTokenMarketDetails = async () => {
    const marketItemData = await NFTManager.getLatestMarketItemByTokenId(tokenId);
    //     if (marketItemData[1] && marketItemData[0]["canceled"] === false) {
    if (marketItemData[1]) {
      setTokenMarketData(marketItemData[0]);
      setIsAvailableOnMarket(marketItemData[1]);

      const approvedAddr = await yourNFT.getApproved(tokenId);
      if (approvedAddress !== approvedAddr) {
        setApprovedAddress(approvedAddr);
      }
    }

    const ownerAddress = await yourNFT.ownerOf(tokenId);
    setOwnerOfToken(ownerAddress);

    // let data = await fetch(`https://ipfs.io/ipfs/${ipfsCid}/nft.json`);
    // data = await data.json();

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

  //   console.log("n-tokenMarketData: ", tokenMarketData);

  const addToMarket = async () => {
    const tx = await NFTManager.createMarketItem(yourNFT.address, tokenId, ethers.utils.parseEther(nftInfo["price"]), {
      value: ethers.utils.parseEther("0.05"),
    });
    const rcpt = await tx.wait();
    console.log("n-rcpt: ", rcpt);
    window.location.reload();
  };

  const removeFromMarket = async () => {
    let marketId = tokenMarketData["marketItemId"].toString();
    console.log("n-marketId: ", marketId);
    const tx = await NFTManager.cancelMarketItem(yourNFT.address, marketId);
    const rcpt = await tx.wait();
    console.log("n-rcpt: ", rcpt);
    window.location.reload();
  };

  const onApprove = async () => {
    const tx = await yourNFT.approve(NFTManager.address, tokenId);
    const rcpt = await tx.wait();
    console.log(rcpt);
    window.location.reload();
  };

  return (
    <div className="w-80 item-contain rounded-lg">
      <h2>{nftInfo?.name}</h2>
      <img className="item" alt="item" src={nftInfo?.image} />
      <h3 style={{ fontFamily: "FantaisieArtistique" }} className="font-bold text-left text-xl py-8">
        {nftInfo?.name}
      </h3>
      <div className="justify-between p-y-10 flex flex-row">
        <div className="flex-col">
          <p className="text-lg text-col tracking-widest font-bold">Owner</p>
          <p>
            <Address address={address} ensProvider={mainnetProvider} blockExplorer={blockExplorer} fontSize={13} />
          </p>
        </div>
        <div className="">
          <p className="text-lg text-col tracking-widest font-bold">Price</p>
          {/* <p>{tokenMarketData && ethers.utils.formatEther(tokenMarketData["price"].toString())} ETH</p> */}
          <p>{nftInfo && nftInfo["price"].toString()} ETH</p>
        </div>
      </div>
      <div className="">Market listing fee is 0.05 eth</div>
      <div>
        {isAvailableOnMarket ? (
          <>
            {tokenMarketData["listed"] && tokenMarketData["seller"] === address && (
              <button className="btn w-full" onClick={removeFromMarket}>
                Remove from market
              </button>
            )}

            {tokenMarketData["owner"] === address && approvedAddress !== NFTManager.address && (
              <button className="btn w-full" onClick={onApprove}>
                Approve
              </button>
            )}

            {tokenMarketData["listed"] === false &&
              tokenMarketData["owner"] === address &&
              approvedAddress === NFTManager.address && (
                <button className="btn w-full" onClick={addToMarket}>
                  Add to market
                </button>
              )}
          </>
        ) : (
          <button className="btn w-full" onClick={addToMarket}>
            Add to market
          </button>
        )}
      </div>
    </div>
  );
}
