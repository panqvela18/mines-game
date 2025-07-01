import React from "react";
import Image from "next/image";
import { games } from "@/utils/constants";
import gameInstructionImg from "@/../public/png/how-mines@2x.png";
import "@/styles/minesGamePage/howToPlayModal.css";

export const HowToPlay = () => {
  return (
    <>
      <div className="game-name-icon">
        <Image src={games[0].iconUrl} alt="mines icon" width={30} height={30} />
        <span>{games[0].name.toUpperCase()}</span>
      </div>
      <Image src={gameInstructionImg} alt="game intruction" />
      <h3>Each tile hides either a star or a mine.</h3>
      <p>
        Increase the total number of stars for bigger odds and higher rewards.
        You can cash out after each turn, or try for increased winnings.
      </p>
    </>
  );
};
