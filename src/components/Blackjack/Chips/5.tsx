import { memo, useCallback } from "react"
import styles from './Chips.module.css'


interface FiveProps {
    onChipClick: (amount: number) => void;
  }

const Five: React.FC<FiveProps> = ({onChipClick}) => {

    return (

      <svg onClick={() =>onChipClick(5)}width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="21.7159" cy="21.7159" r="21.7159" fill="#3B0DF5"/>
      <circle cx="21.7159" cy="21.7159" r="16.7045" fill="#340FC9"/>
      <circle cx="21.7159" cy="21.7159" r="16.2869" stroke="black" stroke-opacity="0.3" stroke-width="0.835227"/>
      <path d="M13.9796 26.524C13.3292 26.524 12.7635 26.4037 12.2824 26.1632C11.8013 25.9226 11.4226 25.593 11.1465 25.1743C10.8792 24.7556 10.7233 24.2834 10.6787 23.7577H12.122C12.2111 24.1943 12.416 24.5462 12.7367 24.8135C13.0664 25.0807 13.4851 25.2144 13.9929 25.2144C14.5898 25.2144 15.062 25.0273 15.4095 24.6531C15.7569 24.27 15.9306 23.78 15.9306 23.1831C15.9306 22.5506 15.7525 22.0606 15.3961 21.7131C15.0397 21.3656 14.5854 21.1919 14.033 21.1919C13.5876 21.1919 13.2089 21.2944 12.8971 21.4993C12.5853 21.7042 12.3403 21.9626 12.1621 22.2744H10.799L11.6008 17.0091H16.6924V18.3187H12.6966L12.2423 20.7108H12.3358C12.5229 20.497 12.7724 20.3188 13.0842 20.1763C13.4049 20.0337 13.7836 19.9625 14.2201 19.9625C14.8616 19.9625 15.4095 20.1006 15.8638 20.3767C16.3271 20.6529 16.6835 21.036 16.9329 21.526C17.1824 22.0071 17.3071 22.555 17.3071 23.1697C17.3071 23.7934 17.169 24.3591 16.8928 24.8669C16.6256 25.3747 16.2425 25.7801 15.7436 26.083C15.2446 26.377 14.6566 26.524 13.9796 26.524ZM22.0059 26.524C21.2842 26.524 20.6517 26.328 20.1082 25.936C19.5737 25.544 19.1594 24.9872 18.8654 24.2656C18.5714 23.535 18.4244 22.6753 18.4244 21.6864C18.4244 20.6886 18.5714 19.8288 18.8654 19.1072C19.1594 18.3856 19.5737 17.8287 20.1082 17.4367C20.6517 17.0447 21.2842 16.8487 22.0059 16.8487C22.7364 16.8487 23.369 17.0447 23.9035 17.4367C24.4381 17.8287 24.8523 18.3856 25.1463 19.1072C25.4403 19.8288 25.5873 20.6886 25.5873 21.6864C25.5873 22.6753 25.4403 23.535 25.1463 24.2656C24.8523 24.9872 24.4381 25.544 23.9035 25.936C23.369 26.328 22.7364 26.524 22.0059 26.524ZM19.8677 21.6864C19.8677 22.1853 19.9122 22.6396 20.0013 23.0495C20.0904 23.4593 20.2151 23.8156 20.3755 24.1186L22.7141 18.3321C22.4914 18.2252 22.2553 18.1717 22.0059 18.1717C21.3822 18.1717 20.87 18.488 20.4691 19.1206C20.0681 19.7442 19.8677 20.5995 19.8677 21.6864ZM22.0059 25.2144C22.4246 25.2144 22.7943 25.0718 23.1151 24.7867C23.4358 24.5016 23.6852 24.0963 23.8634 23.5706C24.0505 23.0361 24.1441 22.408 24.1441 21.6864C24.1441 21.1875 24.0995 20.7331 24.0104 20.3233C23.9213 19.9135 23.7966 19.5616 23.6362 19.2676L21.2976 25.054C21.5203 25.1609 21.7564 25.2144 22.0059 25.2144ZM30.0188 26.524C29.2972 26.524 28.6647 26.328 28.1212 25.936C27.5867 25.544 27.1724 24.9872 26.8784 24.2656C26.5844 23.535 26.4374 22.6753 26.4374 21.6864C26.4374 20.6886 26.5844 19.8288 26.8784 19.1072C27.1724 18.3856 27.5867 17.8287 28.1212 17.4367C28.6647 17.0447 29.2972 16.8487 30.0188 16.8487C30.7494 16.8487 31.3819 17.0447 31.9165 17.4367C32.451 17.8287 32.8653 18.3856 33.1593 19.1072C33.4533 19.8288 33.6003 20.6886 33.6003 21.6864C33.6003 22.6753 33.4533 23.535 33.1593 24.2656C32.8653 24.9872 32.451 25.544 31.9165 25.936C31.3819 26.328 30.7494 26.524 30.0188 26.524ZM27.8807 21.6864C27.8807 22.1853 27.9252 22.6396 28.0143 23.0495C28.1034 23.4593 28.2281 23.8156 28.3885 24.1186L30.7271 18.3321C30.5044 18.2252 30.2683 18.1717 30.0188 18.1717C29.3952 18.1717 28.8829 18.488 28.482 19.1206C28.0811 19.7442 27.8807 20.5995 27.8807 21.6864ZM30.0188 25.2144C30.4376 25.2144 30.8073 25.0718 31.128 24.7867C31.4487 24.5016 31.6982 24.0963 31.8764 23.5706C32.0635 23.0361 32.157 22.408 32.157 21.6864C32.157 21.1875 32.1125 20.7331 32.0234 20.3233C31.9343 19.9135 31.8096 19.5616 31.6492 19.2676L29.3106 25.054C29.5333 25.1609 29.7694 25.2144 30.0188 25.2144Z" fill="white"/>
      <rect x="16.6063" y="1.27747" width="8.94184" height="2.55481" rx="1.27741" fill="white" fill-opacity="0.4"/>
      <rect x="32.2894" y="3.83228" width="8.94184" height="2.55481" rx="1.27741" transform="rotate(39.6913 32.2894 3.83228)" fill="white" fill-opacity="0.4"/>
      <rect x="41.4833" y="15.4402" width="8.94184" height="2.55481" rx="1.27741" transform="rotate(87.8759 41.4833 15.4402)" fill="white" fill-opacity="0.4"/>
      <rect x="3.83093" y="16.6062" width="8.94184" height="2.55481" rx="1.27741" transform="rotate(87.8759 3.83093 16.6062)" fill="white" fill-opacity="0.4"/>
      <rect x="5.10962" y="9.53784" width="8.94184" height="2.55481" rx="1.27741" transform="rotate(-39.6484 5.10962 9.53784)" fill="white" fill-opacity="0.4"/>
      <rect x="26.9503" y="40.8732" width="8.94184" height="2.55481" rx="1.27741" transform="rotate(176.921 26.9503 40.8732)" fill="white" fill-opacity="0.4"/>
      <rect x="10.5236" y="38.5006" width="8.94184" height="2.55481" rx="1.27741" transform="rotate(-138.449 10.5236 38.5006)" fill="white" fill-opacity="0.4"/>
      <rect x="40.1785" y="31.9165" width="8.94184" height="2.55481" rx="1.27741" transform="rotate(131.671 40.1785 31.9165)" fill="white" fill-opacity="0.4"/>
      </svg>

    );
};

export default memo(Five);