import { memo, useCallback } from "react"
import styles from './Chips.module.css'


interface OneProps {
    onChipClick: (amount: number) => void;
  }

const One: React.FC<OneProps> = ({onChipClick}) => {

    return (
        <div className={`${styles.dashed} ${styles.black}`} onClick={() => onChipClick(1)}>1</div>



    );
};

export default memo(One);
