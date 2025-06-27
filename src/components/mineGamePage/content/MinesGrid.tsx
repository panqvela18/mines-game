import { useGameStore } from "@/store/useGameStore";
import "@/styles/minesGamePage/minesGrid.css";

export const MinesGrid = () => {
  const {
    game,
    reveal,
    gameStarted,
    explodedCellIndex,
    showAllMines,
    randomSelectedBoxes = [],
  } = useGameStore();

  const revealed = Array.from(game.getRevealedCells());
  const minePositions = Array.from(game.getMinePositions?.() || []);

  return (
    <div className="mines-grid">
      {Array.from({ length: 25 }).map((_, index) => {
        const isRevealed = revealed.includes(index);
        const isExploded = index === explodedCellIndex;
        const isMine = minePositions.includes(index);

        const shouldReveal = isRevealed || showAllMines;
        const isRandomSelected = randomSelectedBoxes.includes(index);

        return (
          <div
            key={index}
            className={`
              mine-cell 
              ${shouldReveal ? "revealed" : ""}
              ${!shouldReveal && isRandomSelected ? "random-selected" : ""}
            `}
            onClick={() => gameStarted && reveal(index)}
          >
            {!shouldReveal && <div className="mine-dot" />}
            {shouldReveal && isMine && (isExploded ? "💥" : "💣")}
            {shouldReveal && !isMine && "✔️"}
          </div>
        );
      })}
    </div>
  );
};
