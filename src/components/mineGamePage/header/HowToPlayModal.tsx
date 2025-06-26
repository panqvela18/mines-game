import React from "react";
import Image from "next/image";
import { games } from "@/utils/constants";
import gameInstructionImg from "@/../public/png/how-mines@2x.png";
import "@/styles/minesGamePage/howToPlayModal.css";

export const HowToPlayModal = ({
  toggleHowToPlay,
}: {
  toggleHowToPlay: () => void;
}) => {
  return (
    <div className="how-to-play-modal-backdrop" onClick={toggleHowToPlay}>
      <div className="how-to-play-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal-btn" onClick={toggleHowToPlay}>
          ×
        </button>
        <h2>HOW TO PLAY</h2>
        <div
          style={{
            width: "100%",
            height: "1px",
            backgroundColor: "gray",
            opacity: "0.3",
          }}
        ></div>
        <div className="instuction-container">
          <div className="game-name-icon">
            <Image
              src={games[0].iconUrl}
              alt="mines icon"
              width={30}
              height={30}
            />
            <span>{games[0].name.toUpperCase()}</span>
          </div>
          <Image src={gameInstructionImg} alt="game intruction" />
          <h3>Each tile hides either a star or a mine.</h3>
          <p>
            Increase the total number of stars for bigger odds and higher
            rewards. You can cash out after each turn, or try for increased
            winnings.
          </p>
        </div>
      </div>
    </div>
  );
};
