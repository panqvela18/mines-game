"use client";
import React, { useRef, useState } from "react";
import "@/styles/minesGamePage/minesFooter.css";
import Image from "next/image";
import { betAmounts } from "@/utils/constants";
import {
  parseBetValue,
  sanitizeBetInput,
  incrementBetValue,
  decrementBetValue,
} from "@/utils/betHelpers";
import { BetDropDown } from "./BetDropDown";
import { useGameStore } from "@/store/useGameStore";
import { AutoPlayModal } from "./AutoPlayModal";

export const MinesFooter = () => {
  const [showBetDropdown, setShowBetDropdown] = useState(false);
  const [showAutoPlayOptions, setShowAutoPlayOptions] = useState(false);

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
  } = useGameStore();

  const toggleBetDropdown = () => {
    if (isAutoPlaying) stopAutoPlay();
    setShowBetDropdown((prev) => !prev);
  };

  const toggleAutoPlayOptions = () => {
    setShowAutoPlayOptions((prev) => !prev);
  };

  const parsedBetValue = parseBetValue(betValue.toString());

  const handleDropdownSelect = (amount: number) => {
    setBetValue(amount);
    setShowBetDropdown(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeBetInput(e.target.value);
    setBetValue(parseFloat(sanitized) || 0);
  };

  const handleStartClick = () => {
    startGame();
  };

  const handleCashoutClick = () => {
    cashout();
  };

  const handleBetClick = () => {
    if (isAutoPlaying) {
      stopAutoPlay();
    }

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

        {showBetDropdown && (
          <BetDropDown
            betValue={betValue}
            handleDropdownSelect={handleDropdownSelect}
          />
        )}
      </div>

      <div
        className="footer-btn-container"
        style={{ display: "flex", width: "100%" }}
      >
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

        {showAutoPlayOptions && (
          <AutoPlayModal toggleAutoPlayOptions={toggleAutoPlayOptions} />
        )}

        <button
          className={`${gameStarted ? "cashout-btn" : " bet-btn"}`}
          onClick={handleBetClick}
          disabled={gameStarted && correctGuesses === 0}
          style={{
            opacity: gameStarted && correctGuesses === 0 ? 0.5 : 1,
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
                  CASHOUT <span>{(betValue * multiplier).toFixed(2)} USD</span>
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
