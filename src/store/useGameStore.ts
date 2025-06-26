import { create } from "zustand";
import { Game } from "@/classes/Game";
import { User } from "@/classes/User";
import {
  getInitialMultiplier,
  getMultiplierIncrease,
} from "@/utils/generateMultiplier";

const coinSound =
  typeof Audio !== "undefined"
    ? new Audio("/mp3/coin-recieved-230517.mp3")
    : null;
const explosionSound =
  typeof Audio !== "undefined" ? new Audio("/mp3/blast-37988.mp3") : null;

export const useGameStore = create<GameStore>((set, get) => ({
  game: new Game(25, 3),
  user: new User(1000),
  minesCount: 3,
  betValue: 0.4,
  gameStarted: false,
  explodedCellIndex: null,
  showAllMines: false,
  correctGuesses: 0,
  setCorrectGuesses: (count) => set({ correctGuesses: count }),
  incrementCorrectGuesses: () =>
    set((state) => ({ correctGuesses: state.correctGuesses + 1 })),
  multiplier: getInitialMultiplier(3),
  increaseMultiplier: () => {
    const { multiplier, minesCount } = get();
    const increaseRate = getMultiplierIncrease(minesCount);
    const newMultiplier = multiplier * (1 + increaseRate);
    set({ multiplier: newMultiplier });
  },
  lastCashoutAmount: 0,
  showCashoutPopup: false,
  resetMultiplier: () => {
    const { minesCount } = get();
    const initialMultiplier = getInitialMultiplier(minesCount);
    set({ multiplier: initialMultiplier });
  },

  cashout: () => {
    const { user, multiplier, betValue, minesCount } = get();
    const cashoutAmount = betValue * multiplier;
    user.addBalance(cashoutAmount);

    const initialMultiplier = getInitialMultiplier(minesCount);

    set({
      gameStarted: false,
      multiplier: initialMultiplier,
      explodedCellIndex: null,
      showAllMines: true,
      correctGuesses: 0,
      lastCashoutAmount: cashoutAmount,
      showCashoutPopup: true,
    });

    setTimeout(() => {
      const { minesCount } = get();

      set({
        game: new Game(25, minesCount),
        gameStarted: false,
        explodedCellIndex: null,
        showAllMines: false,
        multiplier: initialMultiplier,
        showCashoutPopup: false,
      });
    }, 2000);
  },

  setMineCount: (count) => {
    const initialMultiplier = getInitialMultiplier(count);
    set({ minesCount: count, multiplier: initialMultiplier });
  },
  setBetValue: (value) => set({ betValue: value }),

  startGame: () => {
    const { user, betValue, minesCount } = get();

    if (!user.setBet(betValue)) {
      console.warn("Not enough balance to place bet");
      return;
    }

    const newGame = new Game(25, minesCount);

    const newUser = new User(user.getBalance());

    const initialMultiplier = getInitialMultiplier(minesCount);

    set({
      game: newGame,
      gameStarted: true,
      explodedCellIndex: null,
      showAllMines: false,
      user: newUser,
      multiplier: initialMultiplier,
    });
  },

  reveal: (index) => {
    const {
      game,
      user,
      gameStarted,
      minesCount,
      increaseMultiplier,
      incrementCorrectGuesses,
    } = get();

    if (!gameStarted) return;

    const result = game.revealCell(index);

    if (result === "mine") {
      user.lose();

      if (explosionSound) {
        explosionSound.currentTime = 0;
        explosionSound
          .play()
          .catch((err) => console.warn("Explosion sound failed:", err));
      }

      const initialMultiplier = getInitialMultiplier(minesCount);

      set({
        gameStarted: false,
        explodedCellIndex: index,
        showAllMines: true,
        multiplier: initialMultiplier,
        correctGuesses: 0,
      });

      setTimeout(() => {
        set({
          game: new Game(25, minesCount),
          gameStarted: false,
          explodedCellIndex: null,
          showAllMines: false,
          multiplier: initialMultiplier,
        });
      }, 2000);

      return;
    }

    incrementCorrectGuesses();
    increaseMultiplier();

    if (coinSound) {
      coinSound.currentTime = 0;
      coinSound.play().catch((err) => console.warn("Coin sound failed:", err));
    }

    set({ game, user });
  },
}));
