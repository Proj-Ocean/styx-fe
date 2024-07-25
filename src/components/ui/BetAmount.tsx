"use client"
import { useState, SetStateAction, Dispatch } from 'react'
import Image from 'next/image';
import SolanaIcon from "../../../public/solana_icon.png";
import { StaticImageData } from 'next/image'

interface coinIcon {
    BetAmountCoin: StaticImageData
    betSize: number
    multiplyBet: Dispatch<SetStateAction<number>>
}
const BetAmount = ({ BetAmountCoin, betSize, multiplyBet }: coinIcon) => {
    const [active, setActive] = useState(4);
    // let [betValue, setbetValue] = useState<number | string>(betSize);

    return (
        <div className="bg-tabsbG-900 p-4 rounded-lg mt-3">
            <span className="text-gray-400 font-bold text-sm pr-2">Bet Amount</span>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-left" >
                    <Image src={BetAmountCoin} width={20} height={20} alt="solanaIcon" />
                    &nbsp;&nbsp;
                    <input type="number" className="bg-tabsbG-900 focus:outline-none md:w-2/3 w-1/4 text-black font-bold" max={0} maxLength={10} value={betSize} />
                </div>

                <div className="flex items-center justify-between">
                    <button className={`bg-navbg-800 md:px-4 px-2 rounded-lg mx-1 lg:text-md md:text-[14px] font-bold text-black ${active == 1 && "bg-navbg-800"}`} onClick={()=> {
                        setActive(1);
                        multiplyBet(2)
                        }}>2x</button>
                    <button className={`bg-navbg-800 md:px-4 px-2 rounded-lg mx-1 lg:text-md md:text-[14px] font-bold text-black ${active == 2 && "bg-navbg-800"}`} onClick={()=> {
                        setActive(2);
                        multiplyBet(.5)
                        }}>&#189;</button>
                </div>
            </div>
        </div>
    )
}

export default BetAmount