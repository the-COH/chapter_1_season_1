import Link from "next/link";
import Image from "next/image";
import { ethers } from 'ethers'
import {CgProfile} from "react-icons/cg"
import React, { useEffect, useState } from 'react'
import logo from "../assets/logo_name.png"

const style = {
    wrapper: `bg-[#04111d] px-[1.2rem] py-[0.8rem] flex `,
    logoContainer: `flex items-center cursor-pointer`,
    logoText: ` ml-[0.8rem] text-white font-semibold text-2xl`,
    searchBar: `flex flex-1 mx-[0.8rem] w-max-[320px] items-center  `,
    searchIcon: `text-[#c8cacd] mx-3 font-bold text-lg`,
    searchInput: `h-[2.6rem]  border-0 bg-transparent outline-0 ring-0 px-2 pl-0 text-[#e6e8eb] placeholder:text-[#8a939b]`,
    headerItems: ` flex items-center justify-end`,
    headerItem: `text-white px-4 font-bold text-[#c8cacd] hover:text-white cursor-pointer`,
    headerIcon: `text-[#8a939b] text-3xl font-black px-4 hover:text-white cursor-pointer`,
  }
const Header =()=>{
    const [network, setnetwork] = useState('')
    useEffect(() => {
        searchnetwork()
      })
    async function searchnetwork() {
        try{
          const provider = new ethers.providers.Web3Provider(window.ethereum)
          const network = await provider.getNetwork()
          if (network.chainId == 1088){
            setnetwork("Andromeda(Metis)");
          } else if (network.chainId == 7700){
            setnetwork("Canto");
          } else {
            setnetwork("Undefined");
          }
        } catch(e){
            console.log(e)
          }
        }
    return <div className={style.wrapper}>
        <Link href="/">
            <div className={style.logoContainer}>
                <Image src={logo} height={40} width={40}/>
                <div className={style.logoText}>OpenALCHI</div>
            </div>
        </Link>
        <div className={style.searchBar}>
        <div className={style.headerItem}> {network}</div>
        </div>
        <div className={style.headerItems}>
            <Link href="/collections/0">
                <div className={style.headerItem}> Marketplace</div>
            </Link>
            <Link href="/Game">
                <div className={style.headerItem}> Game</div>
            </Link>
            
            <Link  href="/Profile">
                <div className={style.headerIcon}> 
                    <CgProfile/>
                </div>
            </Link>
            
            
        </div>
        
    </div>
}
export default Header