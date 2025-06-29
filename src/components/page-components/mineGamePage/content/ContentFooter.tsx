"use client";
import React from "react";
import Image from "next/image";
import "@/styles/minesGamePage/contentFooter.css";
import { useGameStore } from "@/store/useGameStore";

export default function ContentFooter() {
  const { isAutoPlayEnabled, setIsAutoPlayEnabled, stopAutoPlay, gameStarted } =
    useGameStore();

  const handleToggle = () => {
    if (!gameStarted) {
      setIsAutoPlayEnabled(!isAutoPlayEnabled);
    }
  };

  return (
    <div className="content-footer">
      <button
        className="autoplay-bt"
        onClick={() => {
          handleToggle();
          stopAutoPlay();
        }}
      >
        <Image
          src={"https://turbo.spribegaming.com/assets/icons/icon-auto-game.svg"}
          alt="autoPlay"
          width={30}
          height={30}
          className="autoplay-icon"
        />

        <div
          className="checkbox-apple"
          onClick={(e) => {
            if (gameStarted) {
              e.stopPropagation();
              return;
            }

            e.stopPropagation();
            stopAutoPlay();
          }}
        >
          <input
            className="yep"
            id="check-apple"
            type="checkbox"
            checked={isAutoPlayEnabled}
            onChange={(e) => {
              if (!gameStarted) {
                setIsAutoPlayEnabled(e.target.checked);
              }
            }}
            disabled={gameStarted}
          />
          <label htmlFor="check-apple"></label>
        </div>

        <span>Auto Game</span>
      </button>
    </div>
  );
}
