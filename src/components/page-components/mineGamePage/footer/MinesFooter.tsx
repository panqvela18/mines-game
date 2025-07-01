"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

import "@/styles/minesGamePage/minesFooter.css";

import { betAmounts } from "@/utils/constants";
import {
  parseBetValue,
  sanitizeBetInput,
  incrementBetValue,
  decrementBetValue,
} from "@/utils/betHelpers";

import { BetDropDown } from "./BetDropDown";
import { AutoPlayModal } from "./AutoPlayModal";
import { useGameStore } from "@/store/useGameStore";

export const MinesFooter = () => {
  // Local UI state
  const [showBetDropdown, setShowBetDropdown] = useState(false);
  const [showAutoPlayOptions, setShowAutoPlayOptions] = useState(false);

  const betDropdownRef = useRef<HTMLDivElement>(null);

  // Game state from store
  const {
    betValue,
    setBetValue,
    startGame,
    gameStarted,
    multiplier,
    cashout,
    correctGuesses,
    currentAutoRound,
    autoPlayRounds,
    showInsufficientBalanceMessage,
    isAutoPlayEnabled,
    isAutoPlaying,
    stopAutoPlay,
    bonusCashoutMultiplier,
    isResettingRound,
  } = useGameStore();

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        betDropdownRef.current &&
        !betDropdownRef.current.contains(event.target as Node)
      ) {
        setShowBetDropdown(false);
      }
    };

    if (showBetDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showBetDropdown]);

  // Toggle handlers
  const toggleBetDropdown = () => {
    if (isAutoPlaying) stopAutoPlay();
    setShowBetDropdown((prev) => !prev);
  };

  const toggleAutoPlayOptions = () => {
    setShowAutoPlayOptions((prev) => !prev);
  };

  // Parsed bet for calculations
  const parsedBetValue = parseBetValue(betValue.toString());

  // Handlers
  const handleDropdownSelect = (amount: number) => {
    setBetValue(amount);
    setShowBetDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeBetInput(e.target.value);
    setBetValue(parseFloat(sanitized) || 0);
  };

  const handleStartClick = () => startGame();

  const handleCashoutClick = () => cashout();

  const handleBetClick = () => {
    if (isAutoPlaying) stopAutoPlay();

    if (gameStarted && correctGuesses > 0) {
      handleCashoutClick();
    } else {
      handleStartClick();
    }
  };

  const handleIncrementClick = () => {
    if (isAutoPlaying) stopAutoPlay();
    incrementBetValue(betAmounts, parsedBetValue, (increm) =>
      setBetValue(parseFloat(increm))
    );
  };

  const handleDecrementClick = () => {
    if (isAutoPlaying) stopAutoPlay();
    decrementBetValue(betAmounts, parsedBetValue, (decrem) =>
      setBetValue(parseFloat(decrem))
    );
  };

  // Disable conditions for BET/CASHOUT button
  const isBetButtonDisabled =
    (gameStarted && correctGuesses === 0) || isResettingRound || betValue <= 0;

  return (
    <div className="mines-game-footer">
      {/* Bet input & controls */}
      <div className="change-bet-container">
        <div className="change-bet-input">
          <span>Bet USD</span>
          <input
            type="number"
            name="bets"
            inputMode="decimal"
            value={betValue}
            onChange={handleInputChange}
            min={0}
          />
        </div>

        <div className="change-price-container">
          <button
            disabled={gameStarted}
            type="button"
            onClick={handleDecrementClick}
          >
            <Image
              src="https://turbo.spribegaming.com/icon-minus.496f2e671ff32d15.svg"
              alt="minus icon"
              width={12}
              height={12}
            />
          </button>

          <button
            disabled={gameStarted}
            onClick={toggleBetDropdown}
            className="bet-dropdown-btn"
            type="button"
          >
            <Image
              src="https://turbo.spribegaming.com/icon-coin.35e2c2ac0b9fe1fa.svg"
              alt="coin icon"
              width={12}
              height={12}
            />
          </button>

          <button
            disabled={gameStarted}
            type="button"
            onClick={handleIncrementClick}
          >
            <Image
              src="https://turbo.spribegaming.com/icon-plus.feaff32a610ebd64.svg"
              alt="plus icon"
              width={12}
              height={12}
            />
          </button>
        </div>

        {/* Bet dropdown */}
        {showBetDropdown && (
          <div ref={betDropdownRef}>
            <BetDropDown
              betValue={betValue}
              handleDropdownSelect={handleDropdownSelect}
            />
          </div>
        )}
      </div>

      {/* Footer buttons */}
      <div
        className="footer-btn-container"
        style={{ display: "flex", width: "100%" }}
      >
        {/* AutoPlay button */}
        <button
          disabled={gameStarted || !isAutoPlayEnabled}
          onClick={() => {
            if (isAutoPlaying) {
              stopAutoPlay();
            } else {
              toggleAutoPlayOptions();
            }
          }}
          style={{
            backgroundColor: isAutoPlaying ? "#ff4444" : "transparent",
            backgroundImage: isAutoPlaying ? "none" : undefined,
            color: isAutoPlaying ? "white" : "inherit",
            opacity:
              !isAutoPlayEnabled || (gameStarted && !isAutoPlaying) ? 0.5 : 1,
          }}
          className={`autoplay-btn ${isAutoPlaying ? "autoplay-active" : ""}`}
        >
          {isAutoPlaying ? (
            <p>{autoPlayRounds - currentAutoRound}</p>
          ) : (
            <Image
              src="https://turbo.spribegaming.com/icon-auto-play.4977be4170e6076b.svg"
              alt="auto-play-icon"
              width={18}
              height={18}
            />
          )}
        </button>

        {/* AutoPlay modal */}
        {showAutoPlayOptions && (
          <AutoPlayModal toggleAutoPlayOptions={toggleAutoPlayOptions} />
        )}

        {/* Bet / Cashout button */}
        <button
          className={gameStarted ? "cashout-btn" : "bet-btn"}
          onClick={handleBetClick}
          disabled={isBetButtonDisabled}
          style={{
            opacity: isBetButtonDisabled ? 0.5 : 1,
            position: "relative",
          }}
        >
          {!gameStarted && (
            <Image
              src="https://turbo.spribegaming.com/icon-play.284324538612d258.svg"
              alt="bet-icon"
              width={20}
              height={20}
            />
          )}
          <span>
            {gameStarted ? (
              correctGuesses === 0 ? (
                "CASHOUT"
              ) : (
                <p className="cashout-p">
                  CASHOUT
                  <span>
                    {(betValue * multiplier * bonusCashoutMultiplier).toFixed(
                      2
                    )}
                    USD
                  </span>
                </p>
              )
            ) : (
              "BET"
            )}
          </span>

          {showInsufficientBalanceMessage && (
            <div className="bet-error-message">
              Not enough balance to place bet
            </div>
          )}
        </button>
      </div>
    </div>
  );
};
