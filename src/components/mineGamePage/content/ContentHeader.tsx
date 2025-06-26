import React, { useState } from "react";
import Image from "next/image";
import { MinesAmountsDropDown } from "./MinesAmountsDropDown";
import { useGameStore } from "@/store/useGameStore";

export const ContentHeader = () => {
  const [showMinesDropDown, setShowMinesDropDown] = useState(false);
  const { minesCount, correctGuesses, multiplier } = useGameStore();

  const safeCellsCount = 25 - minesCount;

  const toggleMinesDropDown = () => {
    setShowMinesDropDown((prev) => !prev);
  };

  return (
    <>
      <div className="select-mines-cont">
        <button
          className="select-mines-amounts-btn"
          onClick={toggleMinesDropDown}
        >
          MINES {minesCount}
          <Image
            className="minesGame-header-btn-icon"
            src="https://turbo.spribegaming.com/icon-dd-arrow.e394e8c554623388.svg"
            alt="arrow"
            width={12}
            height={12}
          />
        </button>
        <button className="x-btn">Next {multiplier.toFixed(2)}x</button>

        {showMinesDropDown && (
          <MinesAmountsDropDown
            closeDropDown={() => setShowMinesDropDown(false)}
          />
        )}
      </div>

      <div className="mines-progress-bar">
        <div
          className="mines-progress-fill"
          style={{ width: `${(correctGuesses / safeCellsCount) * 100}%` }}
        ></div>
      </div>
    </>
  );
};
