"use client";
import React, { useState } from "react";
import Image from "next/image";
import { DropDownGames } from "./DropDownGames";
import "@/styles/minesGamePage/minesHeader.css";

export const MinesHeader = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };
  return (
    <div className="minesGame-header">
      <div className="minesGame-header-left">
        <button className="minesGame-header-btn" onClick={toggleDropdown}>
          MINES
          <Image
            className="minesGame-header-btn-icon"
            src={
              "https://turbo.spribegaming.com/icon-dd-arrow.e394e8c554623388.svg"
            }
            alt="arrow"
            width={12}
            height={12}
          />
        </button>
        <button className="how-to-play-btn">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              aria-hidden="true"
              className="question-icon"
            >
              <g fill="black">
                <path d="M8.67 12a.67.67 0 1 1-1.34 0 .67.67 0 0 1 1.34 0z"></path>
                <path d="M8 16A8 8 0 0 1 8 0a8 8 0 0 1 0 16zM8 1a7 7 0 1 0 .02 14.02A7 7 0 0 0 8 1z"></path>
                <path d="M8 9.83a.5.5 0 0 1-.5-.5v-.67c0-.64.4-1.2 1-1.42.8-.28 1.33-1.12 1.33-1.74A1.83 1.83 0 0 0 8 3.67 1.83 1.83 0 0 0 6.17 5.5a.5.5 0 0 1-1 0A2.84 2.84 0 0 1 8 2.67a2.84 2.84 0 0 1 2.83 2.83c0 1.11-.87 2.3-2 2.69a.5.5 0 0 0-.33.47v.67a.5.5 0 0 1-.5.5z"></path>
              </g>
            </svg>
          </span>
          How to play?
        </button>
        <div className="fun-mode">FUN MODE</div>
        <div></div>
      </div>
      <div className="minesGame-header-right">
        <div className="minesGame-balance">
          <p>3000.00</p>
          <span>USD</span>
        </div>
        <button className="minesGame-burger-menu-btn">
          <Image
            src={
              "https://turbo.spribegaming.com/icon-burger-menu.d11de584b7113bad.svg"
            }
            alt="burger"
            width={10}
            height={10}
          />
        </button>
      </div>
      {showDropdown && <DropDownGames />}
    </div>
  );
};
