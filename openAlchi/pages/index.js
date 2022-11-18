import Header from '../components/Header'
import Alchi from '../components/Alchi'
import Footer from '../components/Footer'
import {useWeb3, useSwitchNetwork} from '@3rdweb/hooks'
import { useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
const style = {
  walletConnectWrapper: `flex flex-col justify-center items-center h-screen w-screen bg-[#3b3d42] `,
  button: `border border-[#282b2f] bg-[#2081e2] p-[0.8rem] text-xl font-semibold rounded-lg cursor-pointer text-black`,
}
const Home = () => {
  const {address, connectWallet, getNetworkMetadata } = useWeb3()
  const supportChainIds = [1088, 7700];
  const { switchNetwork } = useSwitchNetwork();
  const welcome = (address, toatHandler = toast) => {
    toatHandler.success(
      `${address !== 'Unnamed' ? ` ${address}` : ''}`,
      {
        style: {
          background: '#04111d',
          color: '#fff',
        },
      }
    )
  }

  useEffect(() => {
    if (!address) return
    welcome(address)
    
  }, [address])

  return (
    <div className='w-full m-auto'>
      <Toaster position="top-left" reverseOrder={false} />

      {address ? ( 
        <>
        <Header/>
        <Alchi/>
        <Footer/>
        </>
      ):(
        <div className={style.walletConnectWrapper}>
            <button className={style.button}
            onClick={() => connectWallet('injected')}
            >
              Connect Wallet
            </button>
            <div className='mx-auto justify justify-center '>
              <p className='mx-auto justify justify-center text-xl'>Switch network to: </p>
            {supportChainIds.map((cId) => (
              <button key={cId} className='mx-4 px-4 border text-white text-sm' onClick={() => switchNetwork(cId)}>
                {getNetworkMetadata(cId)?.chainName ? getNetworkMetadata(cId)?.chainName : (cId == 7700 ? '  Canto  ' : 'Andromeda' ) }
              </button>
            ))}
            </div>
           
            
        </div>
        
      )}
    </div>
  )
}

export default Home
