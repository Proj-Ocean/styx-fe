import { memo, useCallback, useEffect, useRef, useState } from "react";
// import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
// import { TLoadState } from "@/../type";
import One from "@/components/Blackjack/Chips/1";
import Five from "@/components/Blackjack/Chips/5";
import TwentyFive from "@/components/Blackjack/Chips/25";
import OneHundred from "@/components/Blackjack/Chips/100";

interface ChipsProps {
    onChipClick: (amount: number) => void;
  }

  const Chips: React.FC<ChipsProps> = ({ onChipClick }) => {
    return (
      <div className="flex gap-x-4">
        <One onChipClick={onChipClick} />
        <Five onChipClick={onChipClick} />
        <TwentyFive onChipClick={onChipClick} />
        <OneHundred onChipClick={onChipClick} />
      </div>
    );
  };

  export default Chips;