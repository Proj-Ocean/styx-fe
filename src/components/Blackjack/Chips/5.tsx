import { memo, useCallback } from "react"
import styles from './Chips.module.css'


interface FiveProps {
    onChipClick: (amount: number) => void;
  }

const Five: React.FC<FiveProps> = ({onChipClick}) => {

    return (

    <div className={`${styles.dashed} ${styles.red}`} onClick={() => onChipClick(5)}>5</div>

    );
};

export default memo(Five);