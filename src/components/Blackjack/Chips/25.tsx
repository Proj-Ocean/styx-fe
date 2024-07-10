import { memo, useCallback } from "react"
import styles from './Chips.module.css'

interface TwentyFiveProps {
    onChipClick: (amount: number) => void;
  }
const TwentyFive: React.FC<TwentyFiveProps> = ({onChipClick}) => {

    return (

    <div className={`${styles.dashed} ${styles.green}`} onClick={() => onChipClick(25)}>25</div>

    );
};

export default memo(TwentyFive);