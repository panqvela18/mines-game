import React from "react";
import Image from "next/image";
import "@/styles/minesGamePage/contentFooter.css";

export default function ContentFooter() {
  return (
    <div className="content-footer">
      <button className="random-btn">RANDOM</button>
      <button className="autoplay-bt">
        <Image
          src={"https://turbo.spribegaming.com/assets/icons/icon-auto-game.svg"}
          alt="autoPlay"
          width={30}
          height={30}
          className="autoplay-icon"
        />
        <div className="checkbox-apple">
          <input className="yep" id="check-apple" type="checkbox" />
          <label htmlFor="check-apple"></label>
        </div>
        <span>Auto Game</span>
      </button>
    </div>
  );
}
