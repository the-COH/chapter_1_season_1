import { useEffect, useState } from 'react'
import { BiHeart } from 'react-icons/bi'
import Router from 'next/router'

const style = {
  wrapper: `bg-[#303339] w-[17rem] h-[22rem] my-2 m-auto rounded-2xl overflow-hidden cursor-pointer`,
  imgContainer: `h-3/4  flex justify-center items-center`,
  nftImg: `w-40 h-50 w-full `,
  details: `p-3`,
  info: `flex justify-between text-[#e4e8eb] drop-shadow-xl`,
  infoLeft: `flex-0.6 flex-wrap`,
  collectionName: `font-semibold text-sm text-[#8a939b]`,
  assetName: `font-bold text-lg mt-2`,
  infoRight: `flex-0.4 text-right`,
  priceTag: `font-semibold text-sm text-[#8a939b]`,
  priceValue: `flex items-center text-xl font-bold mt-2`,
  ethLogo: `h-5 mr-2`,
  likes: `text-[#8a939b] font-bold flex items-center w-full justify-end mt-3`,
  likeIcon: `text-xl mr-2`,
}

const NFTCard = ({order, nftItem, price }) => {
  return (
    <div
      className={style.wrapper}
      onClick={() => {
        Router.push({
          pathname: `/nfts/${order}`,
        })
      }}
    > 
      <div className={style.imgContainer}>
        <img src={nftItem.image} alt={nftItem.name} className={style.nftImg} />
      </div>
      <div className={style.details}>
        <div className={style.info}>
          <div className={style.infoLeft}>
            <div className={style.assetName}>{nftItem.name}</div>
          </div>
          
            <div className={style.infoRight}>
              <div className={style.priceTag}>Price: {price}</div>
              
              
            </div>
          
        </div>
      </div>
    </div>
  )
}

export default NFTCard