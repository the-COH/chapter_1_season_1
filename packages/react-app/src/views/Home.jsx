import { useContractReader } from "eth-hooks";
import { ethers } from "ethers";
import React from "react";
import { Link } from "react-router-dom";
import { dragon } from "../image.js";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ yourLocalBalance, readContracts }) {
  // you can also use hooks locally in your component of choice
  // in this case, let's keep track of 'purpose' variable from our contract
  const purpose = useContractReader(readContracts, "YourContract", "purpose");

  return (
    <div>
      <div className="relative w-screen ease-in-out items-stretch lg:space-x-0 flex flex-col lg:flex-row">
        <div
          style={{ fontFamily: "FantaisieArtistique" }}
          className="w-screen tracking-widest content-center lg:w-1/2 py-16 h-auto text-7xl text-left px-4 lg:pl-28 flex-1 flex flex-wrap"
        >
          Collect NFTs
          <br /> With Us.
          <span className=" text-base flex flex-wrap tracking-widest">
            Royalties for Artists, Builders and Creators.
          </span>
          <div style={{ flex: "-moz-available" }} className="flex items-start">
            <Link to={"/create"}>
              <button className="text-color text-base createBtn uppercase">Create</button>
            </Link>
          </div>
        </div>

        <div className="hidden lg:flex lg:justify-center items-center lg:w-1/2">
          <img className="heroImage" src={dragon} alt="dragon" />
        </div>
      </div>
    </div>
  );
}

export default Home;
