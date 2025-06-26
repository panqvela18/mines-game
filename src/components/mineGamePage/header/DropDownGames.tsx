import { games } from "@/utils/constants";
import React from "react";
import Image from "next/image";
import "@/styles/minesGamePage/dropDownGames.css";

export const DropDownGames = () => {
  return (
    <div className="dropdown-games-container">
      {games.map((game) => {
        return (
          <div className="dropDown-info" key={game.id}>
            <Image width={30} height={30} src={game.iconUrl} alt={game.name} />
            <span className="dropdown-game-name">{game.name}</span>
          </div>
        );
      })}
    </div>
  );
};
