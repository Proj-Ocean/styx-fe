import { memo, useCallback } from "react"
import styles from './Chips.module.css'


interface OneHundredProps {
    onChipClick: (amount: number) => void;
  }

const OneHundred: React.FC<OneHundredProps> = ({onChipClick}) => {

    return (

    <div className={`${styles.dashed}  ${styles.blue} `} onClick={() => onChipClick(100)}>100</div>

    );
};

export default memo(OneHundred);