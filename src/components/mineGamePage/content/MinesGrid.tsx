import { useGameStore } from "@/store/useGameStore";
import { useEffect, useRef } from "react";
import "@/styles/minesGamePage/minesGrid.css";

export const MinesGrid = () => {
  const { game, reveal, gameStarted, explodedCellIndex, showAllMines } =
    useGameStore();

  const revealed = Array.from(game.getRevealedCells());
  const minePositions = Array.from(game.getMinePositions?.() || []);

  const explosionSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (explodedCellIndex !== null && explosionSoundRef.current) {
      explosionSoundRef.current.currentTime = 0;
      explosionSoundRef.current.play();
    }
  }, [explodedCellIndex]);

  return (
    <>
      <audio
        ref={explosionSoundRef}
        src="/mp3/blast-37988.mp3"
        preload="auto"
      />

      <div className="mines-grid">
        {Array.from({ length: 25 }).map((_, index) => {
          const isRevealed = revealed.includes(index);
          const isExploded = index === explodedCellIndex;
          const isMine = minePositions.includes(index);

          const shouldReveal = isRevealed || showAllMines;

          return (
            <div
              key={index}
              className={`mine-cell ${shouldReveal ? "revealed" : ""}`}
              onClick={() => gameStarted && reveal(index)}
            >
              {!shouldReveal && <div className="mine-dot" />}
              {shouldReveal && isMine && (isExploded ? "💣" : "💥")}
              {shouldReveal && !isMine && "✔️"}
            </div>
          );
        })}
      </div>
    </>
  );
};
