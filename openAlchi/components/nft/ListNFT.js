import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { IoMdWallet } from 'react-icons/io'
import toast, { Toaster } from 'react-hot-toast'
import NFT from '../../pages/artifacts/LittleAlchemy.json'
import Market from '../../pages/artifacts/NFTMarket.json'

const NFTaddress = ['0xd5d0c6b5578c179552a5d462c471051f2f87f189','0x97C534CdEa1aA1730944ae27A3A11431C4e038Eb']
const NFTmarketaddress = ['0x588851fb3Ca38855FaB2880522E527476408911A','0x79CA4A4DDF4aff4EA91E5F0c678bF36d5A19Da7e']

const style = {
  button: `mr-8 flex items-center py-2 px-12 rounded-lg cursor-pointer`,
  buttonIcon: `text-xl`,
  buttonText: `ml-2 text-lg font-semibold`,
  inputBar: `flex flex-1 mx-[0.8rem] w-max-[520px] items-center bg-[#363840] rounded-[0.8rem] hover:bg-[#4c505c]`,
  Input: `h-[2.6rem] w-full border-0 bg-transparent outline-0 px-4 py-4 mx-4 text-lg text-[#e6e8eb] placeholder:text-[#8a939b]`,

}

const MakeOffer = ({ selectedNft}) => {
  const [nftaddress, setnftaddress] = useState('')
  const [nftmarketaddress, setnftmarketaddress] = useState('')
  const [amount, setAmount] = useState('0')
  const [allowMarket, setApprovedMarket] = useState()
  const confirmApproved = (toastHandler = toast) =>
    toastHandler.success(`Contract Approved!`, {
      style: {
        background: '#04111d',
        color: '#fff',
      },
    })
    const confirmClaim = (msg) => toast(msg)
  async function Approved() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const account = await signer.getAddress()
      const contract = new ethers.Contract(nftaddress, NFT.abi, signer)
      const value = await contract.isApprovedForAll(account, nftmarketaddress)
      const amount = value.toString()
      console.log(amount)
      if (amount === 'false') {
        setApprovedMarket(false)
      } else {
        setApprovedMarket(true)
      }
  }
  useEffect(() => {
    searchnetwork()
  })
  useEffect(() => {
    if (!selectedNft) return
    Approved()
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
async function ApproveMarket() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner()
  const address = nftmarketaddress.toString()
  const contract = new ethers.Contract(nftaddress, NFT.abi, signer)
  let transaction = await contract.setApprovalForAll(address, true)
  await transaction.wait()
  setApprovedMarket(true)
  confirmApproved()
}

  async function ListItem(nft) {
    
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const price = ethers.utils.parseUnits(amount, 'ether')
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      );
      let listingPrice = await marketContract.getListingPrice()
      listingPrice = listingPrice.toString()
      console.log("Sell for :" + price, 'this toktn id; ' + nft.tokenId )
      try {
        const transaction = await marketContract.createMarketItem(nftaddress, nft.tokenId, price, { value: listingPrice })
        await transaction.wait()
        confirmClaim('listed successful!')
      } catch (error) {
        confirmClaim(error.data.message.toString())
      }
  }
  const changeAmount = ({ target }) => {
    setAmount(target.value)
  }
  return (
    <div className=" flex h-20 w-full items-center rounded-lg border border-[#151c22] bg-[#303339] px-12">
      <Toaster position="bottom-left" reverseOrder={false} />
        <>
        
          {allowMarket ? 
          <>
          <div className={style.inputBar}>
            <input className={style.Input} 
            placeholder="  Listing price " 
            type="number"
            onChange={changeAmount}></input>
        </div>
        <div
            onClick={() => {ListItem(selectedNft)
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>List Now</div>
          </div>
          </>
          
          : 
          <div
            onClick={() => {ApproveMarket()
            }}
            className={`${style.button} bg-[#2081e2] hover:bg-[#42a0ff]`}
          >
            <IoMdWallet className={style.buttonIcon} />
            <div className={style.buttonText}>Approve</div>
          </div>
          }
        </>
      
    </div>
  )
}

export default MakeOffer