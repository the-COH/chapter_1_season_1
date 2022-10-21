import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Address, NftCard } from "../components";

export default function Dashboard({ writeContracts, mainnetProvider, address, blockExplorer, tx, ipfs }) {
  const [userTokens, setUserTokens] = useState([]);

  const yourNFT = writeContracts["YourNFT"];
  const NFTmanager = writeContracts["NFTManager"];

  const loadUserNFTs = async () => {
    let userTokens = [];
    const userOwnedTokens = await yourNFT?.getUserOwnedTokens();
    userTokens = [...userOwnedTokens.map(tokenId => +tokenId.toString())];

    const userCreatedTokens = await yourNFT?.getUserCreatedToken();

    if (userCreatedTokens) {
      userTokens = [...new Set([...userTokens, ...userCreatedTokens.map(tokenId => +tokenId.toString())])];
    }

    const sellingMarketItems = await NFTmanager?.fetchSellingMarketItems();
    console.log("n-sellingMarketItems: ", sellingMarketItems);
    const sellingTokenIds = sellingMarketItems.map(data => +data["tokenId"].toString());
    console.log("n-sellingTokenIds: ", sellingTokenIds);

    if (sellingTokenIds.length > 0) {
      userTokens = [...new Set([...userTokens, ...sellingTokenIds])];
    }

    setUserTokens(userTokens.sort());
  };
  console.log(userTokens);

  useEffect(() => {
    if (yourNFT) {
      void loadUserNFTs();
    }
  }, [yourNFT]);

  return (
    <div
      style={{
        maxWidth: "90%",
        padding: 20,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="space-y-3 w-auto items-center flex flex-col lg:flex-row lg:flex-wrap lg:justify-evenly gap-2 bg-opacity-5">
        {userTokens &&
          userTokens.map((tokenId, index) => (
            <div key={index}>
              <NftCard
                address={address}
                tokenId={tokenId}
                yourNFT={yourNFT}
                NFTManager={NFTmanager}
                mainnetProvider={mainnetProvider}
                blockExplorer={blockExplorer}
                ipfs={ipfs}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
