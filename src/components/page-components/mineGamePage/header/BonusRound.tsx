import React from "react";
import bonusGame from "@/../public/png/bonus.png";
import Image from "next/image";

export const BonusRound = () => {
  return (
    <>
      <div className="game-name-icon">
        <span>Bonus Round!</span>
      </div>
      <Image
        width={300}
        height={300}
        src={bonusGame}
        alt="bonus round instruction"
        style={{ borderRadius: "20px", marginBottom: "10px" }}
      />
      <h3>Bonus Round</h3>
      <p>
        Every 3rd correct pick triggers a bonus round where you can multiply
        your winnings — but be careful, there&apos;s an extra hidden mine!
      </p>
    </>
  );
};
