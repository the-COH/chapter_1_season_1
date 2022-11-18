
import {AiFillMediumCircle} from "react-icons/ai";
import {ImTelegram, ImTwitter} from "react-icons/im";
import React from "react";

const Footer =()=>{
    return <div className="bg-white dark:bg-gray-900">
        <div className="py-6 px-4 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">© 2022 <a href="https://www.littlealci.xyz/">ALCHIMetis NFT Game</a>. All Rights Reserved.
            </span> 
            <div className="flex mt-4 space-x-6 sm:justify-center md:mt-0">
                
                <a href="https://twitter.com/AlchiMetis" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <ImTwitter/>
                    <span className="sr-only">Twitter page</span>
                </a>
                <a href="https://t.me/AlchimetisNFT" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <ImTelegram/>
                    <span className="sr-only">Telegram</span>
                </a>
                <a href="https://medium.com/@alchy.metis" className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                    <AiFillMediumCircle/>
                    <span className="sr-only">Medium</span>
                </a>
            </div>
        </div>
    </div>
}
export default Footer
