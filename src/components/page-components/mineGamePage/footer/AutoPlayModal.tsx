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

  const { setAutoPlayRounds, setBoxesToReveal, startAutoPlay } = useGameStore();

  const handleAutoPlayStart = () => {
    setBoxesToReveal(randomCell);
    setAutoPlayRounds(rounds);
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
            backgroundColor: "gray",
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
            {minesAmount.map((mine, idx) => {
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
