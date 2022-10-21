import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import React, { useState } from "react";
import { ethers } from "ethers";
import { message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const client = new Web3Storage({
  token: process.env.REACT_APP_WEB3_STORAGE_API,
});

console.log(process.env.REACT_APP_WEB3_STORAGE_API);
const Create = ({ address, writeContracts, tx, ipfs }) => {
  const yourNFT = writeContracts["YourNFT"];
  const NFTmanager = writeContracts["NFTManager"];

  const [file, setFile] = useState("");
  const [displayImg, setDisplayImg] = useState();
  const [minting, setMinting] = useState(false);
  const [nftDetails, setNftDetails] = useState({
    name: "",
    description: "",
    royalty: "",
    price: "",
    image: "",
  });

  const props = {
    listType: "picture",
    async onChange(info) {
      let nftFile = info.file;
      message.info("uploading");
      const file = new File([nftFile], "nft.png", { type: nftFile.type });
      const ipfsCid = await client.put([file]);
      console.log("n-ipfsCid: ", ipfsCid);
      setNftDetails({ ...nftDetails, image: `https://ipfs.io/ipfs/${ipfsCid}/nft.png` });
      message.success("file uploaded");
    },
    beforeUpload: file => {
      console.log("n-file: ", file);
      return false;
    },
  };

  const mintItem = async () => {
    setMinting(true);
    try {
      // upload file to ipfs
      const ipfsData = { ...nftDetails };
      const blob = new Blob([JSON.stringify(ipfsData)], { type: "application/json" });
      const fileData = new File([blob], "nft.json");
      const ipfsCid = await client.put([fileData]);

      console.log(`n-🔴 => mintItem => Number(nftDetails.royalty) * 10000`, Number(nftDetails.royalty) * 10000);

      const result = await tx(
        yourNFT && yourNFT.mint(`https://ipfs.io/ipfs/${ipfsCid}/nft.json`, Number(nftDetails.royalty) * 10000),
        update => {
          console.log("📡 Transaction Update:", update);
          if (update && (update.status === "confirmed" || update.status === 1)) {
            console.log(" 🍾 Transaction " + update.hash + " finished!");
            console.log(
              " ⛽️ " +
                update.gasUsed +
                "/" +
                (update.gasLimit || update.gas) +
                " @ " +
                parseFloat(update.gasPrice) / 1000000000 +
                " gwei",
            );
          }
        },
      );
      const rcpt = await result.wait();
      console.log("rcpt: ", rcpt);
      setMinting(false);

      setNftDetails({
        name: "",
        description: "",
        royalty: "",
        image: "",
      });

      setFile("");
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      setMinting(false);
    }
  };

  const getBase64 = img => {
    const reader = new FileReader();
    reader.addEventListener("load", () => reader.result);
    reader.readAsDataURL(img);
  };

  const uploadButton = (
    <div>
      {minting ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="">
      <h1 className="text-center tracking-widest font-semibold">Create NFT</h1>

      <div className="relative">
        <section className=" w-screen my-20 overflow-hidden mx-0 top-7 items-center space-x-5 flex flex-col lg:flex-row  px-10 justify-evenly relative">
          <div className="rounded-3xl flex h-96 border content-center items-center border-solid border-sky-700 w-screen lg:w-2/5 cursor-pointer">
            <Upload
              {...props}
              name="avatar"
              style={{ width: "100%" }}
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            >
              {nftDetails.image ? <img src={nftDetails.image} alt="avatar" style={{ width: "100%" }} /> : uploadButton}
            </Upload>
          </div>

          <div className="lg:w-2/5 w-screen flex space-y-3 flex-col">
            <div className="flex flex-col">
              <label className="text-xl my-1 text-left font-semibold ">Name</label>
              <input
                placeholder="eg. Warlock"
                className=" px-5 py-3 bg-transparent rounded-xl
               placeholder:text-slate-400 outline-none border"
                value={nftDetails.name}
                onChange={e => setNftDetails({ ...nftDetails, name: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl text-left my-1 font-semibold">Description</label>
              <textarea
                placeholder="eg. BuidlGuidl Magician"
                className="px-5 py-3 rounded-lg border outline-none"
                value={nftDetails.description}
                onChange={e => setNftDetails({ ...nftDetails, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl my-1 text-left font-semibold">Price</label>
              <input
                type="number"
                placeholder="Enter price in eth"
                className="px-5 py-3 rounded-xl
               outline-none border  bg-transperent"
                value={nftDetails.price}
                onChange={e => setNftDetails({ ...nftDetails, price: e.target.value })}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl my-1 text-left font-semibold">Royalty</label>
              <input
                type="number"
                placeholder="Enter royalty amount in eth"
                className="px-5 py-3 rounded-xl
               outline-none border  bg-transperent"
                value={nftDetails.royalty}
                onChange={e => setNftDetails({ ...nftDetails, royalty: e.target.value })}
              />
            </div>

            <button
              type="button"
              onClick={mintItem}
              className="btn outline-none border-none py-3 px-5 rounded-xl cursor-pointer transition duration-250 ease-in-out tracking-widest  hover:drop-shadow-xl hover:shadow-sky-600 w-auto focus:scale-90"
              disabled={minting}
            >
              {minting ? "Minting..." : "Mint"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Create;
