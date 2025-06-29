import { betAmounts } from "@/utils/constants";
import React from "react";

export const BetDropDown = ({
  handleDropdownSelect,
  betValue,
}: {
  handleDropdownSelect: (amount: number) => void;
  betValue: number;
}) => {
  return (
    <div className="bet-dropdown" id="bet-dropdown">
      <ul>
        {betAmounts.map((amount, idx) => (
          <li key={idx}>
            <button
              style={{
                backgroundColor:
                  betValue === amount
                    ? "var(--bg-dark-blue-lighter)"
                    : "var(--bg-dark-blue)",
              }}
              type="button"
              onClick={() => handleDropdownSelect(amount)}
            >
              {amount}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
