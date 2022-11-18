import React from 'react'
const style = {
    description: `mx-3/5  text-2xl`,
    infoIcon: `flex-col px-2 text-[#8a939b] text-sm font-bold`,
  }
const NftElement = ({item}) => {
  return (
    <div className={style.description}>
        <img
        className="h-[2.25rem] rounded-full "
        src={item.image}
        alt=""
        />
        <div className={style.infoIcon}> {item.name}</div>
        <div className={style.infoIcon}>Balance: {item.balance}</div>
    </div>
  )
}

export default NftElement