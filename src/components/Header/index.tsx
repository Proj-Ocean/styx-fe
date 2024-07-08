"use client";
import useMediaSize from "@/hooks/useMediaSize";
import { ClientOnly } from "../ui/client-only";

export function Header() {
    const screenWidth = useMediaSize();
    const isMobile = screenWidth < 768;
    
    let Links =[
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
             <button className='btn bg-blue-600 text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static'>Connect Wallet</button>
         </ul>
         {/* button */}
        </div>
     </div>
    )
}