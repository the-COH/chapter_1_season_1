import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import NFT from './artifacts/LittleAlchemy.json'
import Header from './../components/Header'
import Market from './artifacts/NFTMarket.json'
import NFTCard1 from './../components/NFTCard1'
import NFTCard2 from './../components/NFTCard2'
const NFTaddress = ['0xd5d0c6b5578c179552a5d462c471051f2f87f189','0x97C534CdEa1aA1730944ae27A3A11431C4e038Eb']
const NFTmarketaddress = ['0x588851fb3Ca38855FaB2880522E527476408911A','0x79CA4A4DDF4aff4EA91E5F0c678bF36d5A19Da7e']
const imagelist = [
  '../imgs/water.png',
  '../imgs/air.png',
  '../imgs/fire.png',
  '../imgs/earth.png',
  '../imgs/steam.png',
  '../imgs/energy.png',
  '../imgs/lava.png',
  '../imgs/rain.png',
  '../imgs/mud.png',
  '../imgs/plant.png',
  '../imgs/rock.png',
  '../imgs/sand.png',
  '../imgs/metal.png',
  '../imgs/glass.png',
  '../imgs/swamp.png',
  '../imgs/eyeglasse.png',
  '../imgs/electricity.png',
  '../imgs/life.png',
  '../imgs/human.png',
  '../imgs/nerd.png',
  '../imgs/computer.png',
  '../imgs/internet.png',
  '../imgs/blockchain.png',
  '../imgs/Bitcoin.png',
]
const title = [
  'Water',
  'Air',
  'Fire',
  'Earth',
  'Steam',
  'Energy',
  'Lava',
  'Rain',
  'Mud',
  'Plant',
  'Rock',
  'Sand',
  'Metal',
  'Glass',
  'Swamp',
  'Eyeglasse',
  'Electricity',
  'Life',
  'Human',
  'Nerd',
  'Computer',
  'Internet',
  'Blockchain',
  'Bitcoin',
]

const style = {
  bannerImageContainer: `overflow-hidden flex justify-center items-center`,
  info: `flex mx-10 text-[#e4e8eb] text-xl drop-shadow-xl`,
  title: `text-5xl font-bold mb-4`,
  statsContainer: `w-[44vw] px-4 py-4 mx-10 flex justify-between py-4 border border-[#151b22] rounded-xl mb-4`,
  listContainer: `mx-10 px-10 py-10 flex justify-between my-10 py-4 border border-[#151b22] rounded-xl mb-4`,
  ethLogo: `h-6 mr-2`,
  pValue: `w-full px-2 py-2 mx-2 text-[#68baba] text-center text-xl font-bold mt-2`,
  wrapper: `bg-[#303339]  my-10 mx-5 rounded-2xl overflow-hidden`,
}

const Profile = () => {
  const [account, setAccount] = useState()
  const [balanceArray, setBalanceArray] = useState([0])
  const [NftBanalce, setNftBanalce] = useState([])
  const [collection, setCollection] = useState({})
  const [items, setNfts] = useState([])
  const [treasury, setTreasury] = useState(0)
  const [nftaddress, setnftaddress] = useState('')
  const [nftmarketaddress, setnftmarketaddress] = useState('')
  
  useEffect(() => {
    searchnetwork()
  })
  useEffect(() => {
    if (!nftmarketaddress) return
    getAllListings()
    myElements()
    window.ethereum.on('accountsChanged', function (accounts) {
      getAllListings()
      myElements()
    })
  }, [nftmarketaddress])
  async function searchnetwork() {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()
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
  async function getAllListings() {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      await provider.getNetwork()
      const marketContract = new ethers.Contract(
        nftmarketaddress,
        Market.abi,
        signer
      )
      const data = await marketContract.fetchItemsCreated()
      let treasury = 0
      const items = await Promise.all(
        data.map(async (i) => {
          const meta = ''
          try {
            meta = imagelist[i.tokenId]
          } catch (error) {
            console.log('meta error')
            meta =
              'https://littlealchi.xyz/static/media/background1-min.839efe9f.png'
          }
  
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
          let sold = 'Not yet'
          if (i.sold) {
            sold = 'Sold'
            treasury = treasury + parseFloat(price)
          }
          let item = {
            price,
            itemId: i.itemId.toNumber(),
            tokenId: i.tokenId.toNumber(),
            name: title[i.tokenId],
            seller: i.seller,
            owner: i.owner,
            sold: sold,
            image: meta,
          }
          return item
        })
      )
      setNfts(items)
      setTreasury(treasury.toFixed(2))
    } catch{
      console.log(Error)
    }

  }
  async function myElements() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract2 = new ethers.Contract(nftaddress, NFT.abi, signer)
      const account = await signer.getAddress()
      setAccount(account)
  
      if (account) {
        const ownerAddress = [
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
          account,
        ]
        const ownerIds = [
          '0',
          '1',
          '2',
          '3',
          '4',
          '5',
          '6',
          '7',
          '8',
          '9',
          '10',
          '11',
          '12',
          '13',
          '14',
          '15',
          '16',
          '17',
          '18',
          '19',
          '20',
          '21',
          '22',
          '23',
        ]
  
        const balanceArray = await contract2.balanceOfBatch(
          ownerAddress,
          ownerIds
        )
        setBalanceArray(balanceArray)
        const itemBalance = await Promise.all(
          balanceArray.map(async (i, key) => {
            if (i.toString() !== '0') {
              let item = {
                tokenId: key,
                name: title[key],
                image: imagelist[key],
                balance: i.toString(),
              }
              return item
            } else return
          })
        )
        var filtered = itemBalance.filter((x) => x !== undefined)
        setNftBanalce(filtered)
        console.log(filtered)
      } else {
        console.log('You need to mint your first element')
      }
    } catch (e){
      console.log(e)
    }
  }

  return (
    <div className=" h-screen bg-gradient-to-l from-green-800 to-blue-800 ">
      <Header />
        <div className="w-full bg-gradient-to-l from-green-700 to-blue-700 ">
        <div className={style.bannerImageContainer}>
                <div className="mx-4 flex">
                  <div className={style.info}>Balance
                    <div className={'px-10'}>
                      {NftBanalce.length}
                    </div> 
                  </div>
                  <div className={style.info}>Listed NFT
                    <div className={'px-10'}>
                      {items.length}
                    </div>
                  </div>
                  <div className={style.info}>Total earned 
                  <div className={'px-10'}>
                    {treasury} 
                  </div>
                  
                  </div>
                  
                </div>
              </div>
              <div className={style.info}>NFT balance</div>
              <div className=" flex flex-wrap  ">
              
                {NftBanalce.map((nftItem, id) => (
                  <div  className={style.wrapper} key={id}>
                    <NFTCard1
                      key={id}
                      order={nftItem.tokenId}
                      nftItem={nftItem}
                      name={nftItem.name}
                      title={title[nftItem.tokenId]}
                      listings={nftItem.sold}
                      price={nftItem.price}
                      balance={nftItem.balance}
                    />
                  </div>
                ))}
              </div>
              <div className={style.info}>Listed NFT </div>
              
                <div className=" flex flex-wrap ">
                
                  {items.map((nftItem, id) => (
                    <div className={style.wrapper} key={id}>
                      <NFTCard2
                        key={id}
                        order={id}
                        nftItem={nftItem}
                        name={nftItem.name}
                        title={title[nftItem.tokenId]}
                        listings={nftItem.sold}
                        price={nftItem.price}
                      />
                    </div>
                  ))}
                </div>
        </div>
    </div>
  )
}
export default Profile
