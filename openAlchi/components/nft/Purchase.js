import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { IoMdWallet } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import Market from '../../pages/artifacts/NFTMarket.json'

const NFTaddress = ['0xd5d0c6b5578c179552a5d462c471051f2f87f189','0x97C534CdEa1aA1730944ae27A3A11431C4e038Eb']
const NFTmarketaddress = ['0x588851fb3Ca38855FaB2880522E527476408911A','0x79CA4A4DDF4aff4EA91E5F0c678bF36d5A19Da7e']


const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
}

const MakeOffer = ({ selectedNft}) => {
  const [nftaddress, setnftaddress] = useState('')
  const [nftmarketaddress, setnftmarketaddress] = useState('')
  const confirmClaim = (msg) => toast(msg)

  useEffect(() => {
    searchnetwork()
  })
  useEffect(() => {
    if (!selectedNft) return
  }, [selectedNft])
  async function searchnetwork() {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()
      console.log(network)
      if (network.chainId == 1088){
        setnftaddress(NFTaddress[0]);
        setnftmarketaddress(NFTmarketaddress[0])
      } else if (network.chainId == 7700){
        setnftaddress(NFTaddress[1]);
        setnftmarketaddress(NFTmarketaddress[1])
      }
    } catch(e){
        console.log(e)
      }
    }

  async function buyItem(nft) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );
      const price = nft.price
      console.log("buy for :" + price, 'this toktn id; ' + nft.tokenId + '  ' + nft.item)
      try {
        const transaction = await marketContract.createMarketSale(nftaddress, nft.item, {
          value: price.toString()
        })
        await transaction.wait()
        confirmClaim('Purchase successful!')
      } catch (error) {
        confirmClaim(error.data.message.toString())
      }
  }

  return (
    <div className="flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster 
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        className: 'text-sm ',
        duration: 5000,
        style: {
          background: '#363636',
          color: '#fff',
        },
        success: {
          duration: 3000,
          theme: {
            primary: 'green',
            secondary: 'black',
          },
        },
      }}  />
        <>
          <div
            onClick={() => {buyItem(selectedNft)
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Buy Now</div>
          </div>
          
        </>
      
    </div>
  )
}

export default MakeOffer