import { create } from "zustand";
import { Game } from "@/classes/Game";
import { User } from "@/classes/User";

type GameStore = {
  game: Game;
  user: User;
  minesCount: number;
  betValue: number;
  gameStarted: boolean;
  explodedCellIndex: number | null;
  showAllMines: boolean;

  setMineCount: (count: number) => void;
  setBetValue: (value: number) => void;
  startGame: () => void;
  reveal: (index: number) => void;
  resetGame: () => void;
};

export const useGameStore = create<GameStore>((set, get) => ({
  game: new Game(25, 3),
  user: new User(1000),
  minesCount: 3,
  betValue: 0.4,
  gameStarted: false,
  explodedCellIndex: null,
  showAllMines: false,

  setMineCount: (count) => set({ minesCount: count }),
  setBetValue: (value) => set({ betValue: value }),

  startGame: () => {
    const { user, betValue, minesCount } = get();

    if (!user.setBet(betValue)) {
      console.warn("Not enough balance to place bet");
      return;
    }

    const newGame = new Game(25, minesCount);
    set({
      game: newGame,
      gameStarted: true,
      explodedCellIndex: null,
      showAllMines: false,
    });
  },

  reveal: (index) => {
    const { game, user, gameStarted, minesCount } = get();
    if (!gameStarted) return;

    const result = game.revealCell(index);

    if (result === "mine") {
      user.lose();
      set({
        gameStarted: false,
        explodedCellIndex: index,
        showAllMines: true,
      });

      setTimeout(() => {
        set({
          game: new Game(25, minesCount),
          gameStarted: false,
          explodedCellIndex: null,
          showAllMines: false,
        });
      }, 2000);

      return;
    }

    set({ game, user });
  },

  resetGame: () => {
    const { minesCount } = get();
    set({
      game: new Game(25, minesCount),
      gameStarted: false,
      explodedCellIndex: null,
      showAllMines: false,
    });
  },
}));