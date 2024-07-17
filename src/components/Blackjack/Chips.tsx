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
      <div className="flex flex-row gap-x-4">
        <div className="flex flex-col m-2">
        <div className="p-2">
          <One onChipClick={onChipClick} />
        </div>
        <div className="p-2">
          <Five onChipClick={onChipClick} />
        </div>
        <div className="p-2">
          <TwentyFive onChipClick={onChipClick} />
        </div>
        </div>
        <div className="flex flex-col m-2">
        <div className="p-2">
          <OneHundred onChipClick={onChipClick} />
        </div>
        <div className="p-2">
          <OneHundred onChipClick={onChipClick} />
        </div>

        <div className="p-2">
          <OneHundred onChipClick={onChipClick} />
        </div>
        </div>
      </div>
    );
  };

  export default Chips;