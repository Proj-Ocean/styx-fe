"use client";
import useMediaSize from "@/hooks/useMediaSize";
import { useAutoConnect } from "../../app/AutoConnectProvider";
import { WalletSelector as ShadcnWalletSelector } from "../../app/WalletSelector";
import { Button } from "../../app/ui/button";

import { ClientOnly } from "../ui/client-only";
import {
    AccountInfo,
    AptosChangeNetworkOutput,
    NetworkInfo,
    WalletInfo,
    isAptosNetwork,
    useWallet
  } from "@aptos-labs/wallet-adapter-react";
  import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useState, useEffect } from "react";


export function Header() {
    const { account, connected, network, wallet, changeNetwork } = useWallet();
    const screenWidth = useMediaSize();
    const isMobile = screenWidth < 768;

    const [userBalance, setUserBalance] = useState<number | null>(null);

    const aptosConfig = new AptosConfig({ network: Network.DEVNET });
    const aptos = new Aptos(aptosConfig);

    const userAddress = account?.address;
    console.log("userAddress: ", userAddress)

    const getAptBalance = async () => {
        type Coin = { coin: { value: string } };
 
        const resource = await aptos.getAccountResource<Coin>({
            accountAddress: userAddress!,
            resourceType: "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
        });
        const bal = (parseInt(resource.coin.value) / 100000000).toFixed(2);
        console.log("bal: ", bal)   
        setUserBalance(parseInt(bal));
    }

    useEffect(() => {
        if (userAddress) {
            getAptBalance();
        }
    }, [userAddress])
    
    let Links =[
        {name:"Play",link:"/games/blackjack"},
        {name:"Telegram",link:"/"},
        {name:"Twitter",link:"/"},
        // {name:"ABOUT",link:"/"},
        // {name:"CONTACT",link:"/"},
      ];

    return (
        <div className='shadow-md w-full fixed top-0 left-0'>
        <div className='md:flex items-center justify-between bg-white py-4 px-24 md:px-24'>
         {/* logo section */}
         <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
             Styx
         </div>
         {/* linke items */}
         <ul className='md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in'>
         {
                    Links.map((link) => (
                    <li key={link.name} className='md:ml-8 md:my-0 my-7 font-semibold'>
                        <a href={link.link} className='text-gray-800 hover:text-blue-400 duration-500'>{link.name}</a>
                    </li>))
                }
            <div className="flex flex-col gap-4 items-center pl-4">
                {userAddress ? <Button>{userBalance} APT</Button> : <></>}
            </div>
            <div className="flex flex-col gap-4 items-center pl-4">
                {/* <div className="text-sm text-muted-foreground">shadcn/ui</div> */}
                <ShadcnWalletSelector />
            </div>
             {/* <button className='btn bg-blue-600 text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static'>Connect Wallet</button> */}
         </ul>
         {/* button */}
        </div>
     </div>
    )
}