import { useGameStore } from "@/store/useGameStore";
import { minesAmount } from "@/utils/constants";
import React from "react";

export const MinesAmountsDropDown = ({
  closeDropDown,
}: {
  closeDropDown: () => void;
}) => {
  const { minesCount, setMineCount, gameStarted } = useGameStore();

  const handleSelect = (count: number) => {
    setMineCount(count);
    closeDropDown();
  };

  return (
    <ul className="mines-amount-dropdown">
      {minesAmount.map((mines, idx) => {
        return (
          <li key={idx}>
            <button
              style={{
                backgroundColor:
                  minesCount === mines
                    ? "var(--bg-dark-blue-lighter)"
                    : "var(--bg-dark-blue)",
              }}
              key={mines}
              onClick={() => handleSelect(mines)}
              disabled={gameStarted}
              className={`dropdown-option ${
                mines === minesCount ? "selected" : ""
              }`}
            >
              {mines}
            </button>
          </li>
        );
      })}
    </ul>
  );
};
