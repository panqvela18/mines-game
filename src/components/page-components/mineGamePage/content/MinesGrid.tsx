import { useGameStore } from "@/store/useGameStore";
import "@/styles/minesGamePage/minesGrid.css";
import { Cell } from "@/classes/Cell";
import { motion } from "framer-motion";

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
          <motion.div
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
            initial={false}
            animate={{
              rotateY: shouldReveal ? 180 : 0,
            }}
            transition={{
              duration: 0.6,
              ease: "easeInOut",
            }}
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              className="cell-face cell-front"
              animate={{
                opacity: shouldReveal ? 0 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {!shouldReveal && <div className="mine-dot" />}
            </motion.div>

            <motion.div
              className="cell-face cell-back"
              animate={{
                opacity: shouldReveal ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {shouldReveal && isMine && (isExploded ? "💥" : "💣")}
              {shouldReveal && !isMine && "✔️"}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
