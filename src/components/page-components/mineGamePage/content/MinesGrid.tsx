import { useGameStore } from "@/store/useGameStore";
import "@/styles/minesGamePage/minesGrid.css";
import { Cell } from "@/classes/Cell";

export const MinesGrid = () => {
  const {
    game,
    reveal,
    gameStarted,
    explodedCellIndex,
    showAllMines,
    randomSelectedBoxes = [],
  } = useGameStore();

  const cells: Cell[] = game.getCells();

  return (
    <div className="mines-grid">
      {cells.map((cell) => {
        const index = cell.index;
        const isRevealed = cell.isRevealed();
        const isMine = cell.hasMine();
        const isExploded = index === explodedCellIndex;
        const isRandomSelected = randomSelectedBoxes.includes(index);

        const shouldReveal = isRevealed || showAllMines;

        return (
          <div
            key={index}
            className={`
              mine-cell 
              ${shouldReveal ? "revealed" : ""}
              ${
                !shouldReveal && isRandomSelected && gameStarted
                  ? "random-selected"
                  : ""
              }
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
