import { minesAmount, numberOfRounds } from "@/utils/constants";
import React, { useState } from "react";
import "@/styles/minesGamePage/autoPlayModal.css";
import { useGameStore } from "@/store/useGameStore";

export const AutoPlayModal = ({
  toggleAutoPlayOptions,
}: {
  toggleAutoPlayOptions: () => void;
}) => {
  const [rounds, setRounds] = useState<number>(3);
  const [randomCell, setRandomCell] = useState<number>(1);
  const [minBalance, setMinBalance] = useState<number>(0);
  const [maxBalance, setMaxBalance] = useState<number>(0);
  console.log("Limits → Min:", minBalance, "Max:", maxBalance);

  const {
    setAutoPlayRounds,
    setBoxesToReveal,
    startAutoPlay,
    minesCount,
    setAutoPlayBalanceLimits,
  } = useGameStore();

  const handleAutoPlayStart = () => {
    setBoxesToReveal(randomCell);
    setAutoPlayRounds(rounds);
    setAutoPlayBalanceLimits(minBalance, maxBalance);
    startAutoPlay();
  };

  return (
    <div className="how-to-play-modal-backdrop" onClick={toggleAutoPlayOptions}>
      <div className="how-to-play-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={toggleAutoPlayOptions}>
          ×
        </button>
        <h2>AUTO PLAY</h2>
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "var(--text-gray)",
            opacity: "0.3",
          }}
        ></div>
        <div>
          <h4 className="round-title">Number of rounds</h4>
          <div className="rounds-grid-container">
            {numberOfRounds.map((round, idx) => {
              return (
                <button
                  onClick={() => setRounds(round)}
                  style={
                    round === rounds
                      ? { backgroundColor: "#555961" }
                      : { backgroundColor: "#393b3f" }
                  }
                  key={idx}
                >
                  {round}
                </button>
              );
            })}
          </div>
          <h5 className="random-title">Number of random</h5>
          <div className="random-grid-container">
            {minesAmount.slice(0, 25 - minesCount).map((mine, idx) => {
              return (
                <button
                  onClick={() => setRandomCell(mine)}
                  style={
                    mine === randomCell
                      ? { backgroundColor: "#555961" }
                      : { backgroundColor: "#393b3f" }
                  }
                  key={idx}
                >
                  {mine}
                </button>
              );
            })}
          </div>
          <div className="balance-limits-container">
            <input
              type="number"
              value={minBalance !== 0 ? minBalance : ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setMinBalance(isNaN(value) ? 0 : value);
              }}
              placeholder="No minimum"
            />

            <input
              type="number"
              value={maxBalance !== Infinity ? maxBalance : ""}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setMaxBalance(isNaN(value) ? Infinity : value);
              }}
              placeholder="No maximum"
            />
          </div>

          <button
            onClick={() => {
              handleAutoPlayStart();
              toggleAutoPlayOptions();
            }}
            className="autoplay-inner-btn"
          >
            START AUTO
          </button>
        </div>
      </div>
    </div>
  );
};
