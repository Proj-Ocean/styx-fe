import { useCallback, useState, useEffect} from "react";
import { GameState } from "./BlackJackTable";
import styles from './styles/BlackJackTable.module.css'
import {
  useWallet
} from "@aptos-labs/wallet-adapter-react";
import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import Chips from './Chips'
interface ChipsControlsProps {
  gameState: GameState;
  startGame: () => void;
  betSize: number;
  handleClear: () => void;
  handleChipClick: (amount: number) => void;
  multiplyBet: (amount: number) => void; 

}
const ChipsControls: React.FC<ChipsControlsProps> = ({ gameState, startGame, betSize, handleClear, handleChipClick, multiplyBet

}) => {
  const { account, connected, network, wallet, changeNetwork } = useWallet();
  const CLEAR = "Clear";
  const PLACE_BET = "Place Bet";
  const [inputValue, setInputValue] = useState(betSize.toString());
  const [userBalance, setUserBalance] = useState<number | null>(null);

  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);
  const userAddress = account?.address;

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

  const handlePlaceBet = () => {
    startGame();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === '') {
      handleChipClick(-betSize); // Reset betSize to 0
    } else if (!isNaN(parseInt(value, 10))) {
      handleChipClick(parseInt(value, 10) - betSize);
    }
  };

  console.log("userBalance: ", userBalance)
  console.log("betSize: ", betSize)

  return (
    <>
    <div className="flex flex-col items-center justify-center bg-[#CEBA94]">
      <div className={`flex items-center ${styles['input-group']} ${styles['margin-top']}`}>
        <input 
          type="number"
          value={betSize}
          onChange={handleInputChange}
          className={`bj-button w-40 h-14 ${styles['bet-amount']} `}
        ></input>
        <button onClick={()=>multiplyBet(.5)}className={`h-14 ${styles['half']} `}>1/2</button>
        <button onClick={()=>multiplyBet(2)}className={`h-14 ${styles['double-button']} `}>2x</button>
      </div>
      <div className="mt-1">
        <Chips onChipClick={handleChipClick} />
      </div>
      <button className={` ${styles['margin-top']} ${styles['bet-action']} bj-button`} onClick={handlePlaceBet} disabled={betSize >= userBalance!}
      >
        {betSize >= userBalance! ? "Insufficient APT Amount" : PLACE_BET}
    </button>
    </div>

    </>
  );
};

export default ChipsControls;