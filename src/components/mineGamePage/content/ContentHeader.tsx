import React, { useState } from "react";
import Image from "next/image";
import { MinesAmountsDropDown } from "./MinesAmountsDropDown";
import { useGameStore } from "@/store/useGameStore";

export const ContentHeader = () => {
  const [showMinesDropDown, setShowMinesDropDown] = useState(false);
  const { minesCount } = useGameStore();

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
        <button className="x-btn">Next 1.10x</button>

        {showMinesDropDown && (
          <MinesAmountsDropDown
            closeDropDown={() => setShowMinesDropDown(false)}
          />
        )}
      </div>

      <div className="mines-progress-bar">
        <div
          className="mines-progress-fill"
          style={{ width: `${(minesCount / 24) * 100}%` }}
        ></div>
      </div>
    </>
  );
};
