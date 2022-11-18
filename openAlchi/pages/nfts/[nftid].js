import Header from '../../components/Header'
import { useEffect, useMemo, useState } from 'react'
import { useWeb3 } from '@3rdweb/hooks'
import { ethers } from 'ethers'
import Market from '../artifacts/NFTMarket.json'
import { useRouter } from 'next/router'
import NFTImage from '../../components/nft/NFTImage'
import GeneralDetails from '../../components/nft/GeneralDetails'
import Purchase from '../../components/nft/Purchase'
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
  'water',
  'air',
  'fire',
  'earth',
  'steam',
  'energy',
  'lava',
  'rain',
  'mud',
  'plant',
  'rock',
  'sand',
  'metal',
  'glass',
  'swamp',
  'eyeglasse',
  'electricity',
  'life',
  'human',
  'nerd',
  'computer',
  'internet',
  'blockchain',
  'Bitcoin',
]
const NFTmarketaddress = ['0x588851fb3Ca38855FaB2880522E527476408911A','0x79CA4A4DDF4aff4EA91E5F0c678bF36d5A19Da7e']


const style = {
  wrapper: `flex flex-col items-center container-lg text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
}

const Nft = () => {
  const { provider } = useWeb3()
  const [selectedNft, setSelectedNft] = useState()
  const [nftmarketaddress, setnftmarketaddress] = useState('')
  const router = useRouter()
  useEffect(() => {
    searchnetwork()
  })
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
     if (!nftmarketaddress) return
    ;(async () => {
        const selectedNftItem = router.query.nftid
        const signer = provider.getSigner();
        const marketContract = new ethers.Contract(
            nftmarketaddress,
            Market.abi,
            signer
          )
        const data = await marketContract.fetchMarketItems()
        const meta = ''
          try {
             meta = imagelist[data[selectedNftItem].tokenId] ;
          } catch (error) {
            console.log('meta error')
            meta= 'https://littlealchi.xyz/static/media/background1-min.839efe9f.png'
          }
        
        let item = {
            item: data[selectedNftItem].itemId.toNumber(),
            price: data[selectedNftItem].price,
            tokenId: data[selectedNftItem].tokenId.toNumber(),
            name: title[data[selectedNftItem].tokenId],
            seller: data[selectedNftItem].seller,
            image: meta,
          };
       console.log(item)
      setSelectedNft(item)
    })()
  }, [nftmarketaddress])
  async function searchnetwork() {
    try{
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const network = await provider.getNetwork()
      console.log(network)
      if (network.chainId == 1088){
        setnftmarketaddress(NFTmarketaddress[0])
      } else if (network.chainId == 7700){
        setnftmarketaddress(NFTmarketaddress[1])
      }
    } catch(e){
        console.log(e)
      }
    }


  return (
    <div>
      <Header />
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.topContent}>
            <div className={style.nftImgContainer}>
              <NFTImage selectedNft={selectedNft} />
            </div>
            <div className={style.detailsContainer}>
              <GeneralDetails selectedNft={selectedNft} />
              <Purchase
                selectedNft={selectedNft}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Nft

