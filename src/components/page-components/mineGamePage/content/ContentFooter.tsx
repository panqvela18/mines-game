"use client";
import React from "react";
import Image from "next/image";
import "@/styles/minesGamePage/contentFooter.css";
import { useGameStore } from "@/store/useGameStore";
import Checkbox from "@/components/ui/Checkbox";

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

        <Checkbox
          id="check-apple"
          checked={isAutoPlayEnabled}
          onChange={(checked) => {
            if (!gameStarted) {
              setIsAutoPlayEnabled(checked);
            }
          }}
          onClick={() => {
            if (!gameStarted) {
              stopAutoPlay();
            }
          }}
          disabled={gameStarted}
        />

        <span>Auto Game</span>
      </button>
    </div>
  );
}
