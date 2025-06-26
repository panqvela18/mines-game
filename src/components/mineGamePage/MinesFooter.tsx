"use client";
import React, { useEffect, useState } from "react";
import "@/styles/minesGamePage/minesFooter.css";
import Image from "next/image";
import { betAmounts } from "@/utils/constants";
import {
  parseBetValue,
  sanitizeBetInput,
  incrementBetValue,
  decrementBetValue,
} from "@/utils/betHelpers";

export const MinesFooter = () => {
  const [showBetDropdown, setShowBetDropdown] = useState<boolean>(false);
  const [betValue, setBetValue] = useState<string>("");

  useEffect(() => {
    const savedBet = sessionStorage.getItem("betValue");
    if (savedBet) {
      setBetValue(savedBet);
    } else {
      setBetValue("0.4");
      sessionStorage.setItem("betValue", "0.4");
    }
  }, []);

  useEffect(() => {
    if (betValue !== "") {
      sessionStorage.setItem("betValue", betValue);
    }
  }, [betValue]);

  const toggleBetDropdown = () => {
    setShowBetDropdown((prev) => !prev);
  };

  const parsedBetValue = parseBetValue(betValue);

  useEffect(() => {
    if (!showBetDropdown) return;
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById("bet-dropdown");
      const btn = document.getElementById("bet-dropdown-btn");
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        btn &&
        !btn.contains(event.target as Node)
      ) {
        setShowBetDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBetDropdown]);

  const handleDropdownSelect = (amount: number) => {
    setBetValue(amount.toString());
    setShowBetDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeBetInput(e.target.value);
    setBetValue(sanitized);
  };

  return (
    <div className="mines-game-footer">
      <div className="change-bet-container">
        <div className="change-bet-input">
          <span>Bet USD</span>
          <input
            type="text"
            name="bets"
            inputMode="decimal"
            value={betValue}
            onChange={handleInputChange}
          />
        </div>
        <div className="change-price-container">
          <button
            type="button"
            onClick={() =>
              decrementBetValue(betAmounts, parsedBetValue, setBetValue)
            }
          >
            <Image
              src={
                "https://turbo.spribegaming.com/icon-minus.496f2e671ff32d15.svg"
              }
              alt="minus icon"
              width={12}
              height={12}
            />
          </button>
          <button
            onClick={toggleBetDropdown}
            className="bet-dropdown-btn"
            id="bet-dropdown-btn"
            type="button"
          >
            <Image
              src="https://turbo.spribegaming.com/icon-coin.35e2c2ac0b9fe1fa.svg"
              alt="icon"
              width={12}
              height={12}
            />
          </button>
          <button
            type="button"
            onClick={() =>
              incrementBetValue(betAmounts, parsedBetValue, setBetValue)
            }
          >
            <Image
              src={
                "https://turbo.spribegaming.com/icon-plus.feaff32a610ebd64.svg"
              }
              alt="minus icon"
              width={12}
              height={12}
            />
          </button>
        </div>

        {showBetDropdown && (
          <div className="bet-dropdown" id="bet-dropdown">
            <ul>
              {betAmounts.map((amount, idx) => (
                <li key={idx}>
                  <button
                    type="button"
                    onClick={() => handleDropdownSelect(amount)}
                  >
                    {amount}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button className="autoplay-btn">
        <Image
          src={
            "https://turbo.spribegaming.com/icon-auto-play.4977be4170e6076b.svg"
          }
          alt="random-icon"
          width={18}
          height={18}
        />
      </button>
      <button className="bet-btn">
        <Image
          src="https://turbo.spribegaming.com/icon-play.284324538612d258.svg"
          alt="bet-icon"
          width={20}
          height={20}
        />
        <span>BET</span>
      </button>
    </div>
  );
};
