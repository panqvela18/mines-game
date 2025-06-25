import React from "react";
import "@/styles/minesGamePage/minesMain.css";
import Image from "next/image";
import { games } from "@/utils/constants";

export default function MinesPage() {
  return (
    <main className="minesGame-container">
      {games.map((game) => {
        return (
          <Image
            width={50}
            height={50}
            src={game.iconUrl}
            key={game.iconUrl}
            alt={game.name}
          />
        );
      })}
    </main>
  );
}
