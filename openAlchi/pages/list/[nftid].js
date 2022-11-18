import Header from '../../components/Header'
import { useEffect, useMemo, useState } from 'react'
import { useWeb3 } from '@3rdweb/hooks'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import NFTImage from '../../components/nft/NFTImage'
import GeneralDetails from '../../components/nft/GeneralDetails'
import ListNFT from '../../components/nft/ListNFT'
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
const style = {
  wrapper: ` flex flex-col items-center text-[#e5e8eb]`,
  container: `container p-6`,
  topContent: `flex mx-4`,
  nftImgContainer: `flex-1 mr-4`,
  detailsContainer: `flex-[2] ml-4`,
}

const Nft = () => {
  const { provider } = useWeb3()
  const [selectedNft, setSelectedNft] = useState()
  const router = useRouter()
  console.log(router.query.nftid)
 
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
     if (!provider) return
    ;(async () => {
        const selectedNftItem = router.query.nftid
        const meta = ''
          try {
             meta = imagelist[selectedNftItem] ;
          } catch (error) {
            console.log('meta error')
            meta= 'https://littlealchi.xyz/static/media/background1-min.839efe9f.png'
          }
        
        let item = {
            tokenId: selectedNftItem,
            image: meta,
          };
       console.log(item)
      setSelectedNft(item)
    })()
  }, [provider])



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
              <ListNFT
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

