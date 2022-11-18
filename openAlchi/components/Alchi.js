import React from "react";
import Link from "next/link";
import Image from "next/image";
import bg from '../assets/bg.png';
import elric from "../assets/elric-alphonse.png"

const style = {
    wrapper: `relative h-screen `,
    container: ` before:content-[''] before:bg-red-500 before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0 before:bg-[url('../assets/fullmetal.png')] before:bg-cover before:bg-center before:opacity-60 before:blur`,
    contentWrapper: `flex relative justify-center flex-wrap items-center`,
    copyContainer: `w-1/2`,
    title: `relative text-white text-[46px] font-semibold`,
    description: `text-[#151b22] container-[400px] text-2xl mt-[0.8rem] mb-[2.5rem]`,
    ctaContainer: `flex`,
    accentedButton: ` relative text-lg font-semibold px-12 py-4 bg-[#2181e2] rounded-lg mr-5 text-white hover:bg-[#42a0ff] cursor-pointer`,
    button: ` relative text-lg font-semibold px-12 py-4 bg-[#363840] rounded-lg mr-5 text-[#e4e8ea] hover:bg-[#4c505c] cursor-pointer`,
    cardContainer: `rounded-[3rem]`,
    infoContainer: `h-20 bg-[#313338] p-4 rounded-b-lg flex items-center text-white`,
    author: `justify-center ml-4`,
    name: `text-2xl `,
  }
const Alchi = () => {
    return <div className={style.wrapper}>
      <div className={style.container}>
        <div className={style.contentWrapper}>
          <div className={style.copyContainer}>
            <div className={style.title}>
              Discover, The collection of Little Alchemy Elements
            </div>
            <div className={style.description}>
              Buy & Sell and search for new Alchemy Elemets.
            </div>
            <div className={style.ctaContainer}>
            <Link href="/collections/0">
            <button className={style.accentedButton}>Marketplace</button>
            </Link>
              
              <Link href="/Game">
              <button className={style.button}>Game</button>
              </Link>
              
            </div>
          </div>
          <div className={style.cardContainer}>
            <Image
              className="rounded-t-lg"
              src={elric}
              width="400"
              height="600"
              alt=""
            />
            <div className={style.infoContainer}>
              
              <div className={style.author}>
                <div className={style.name}>ALCHIMetis</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
}
export default Alchi