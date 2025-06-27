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
  boxesToReveal: 3,

  setBoxesToReveal: (count) =>
    set({ boxesToReveal: Math.max(1, Math.min(24, count)) }),

  showInsufficientBalanceMessage: false,
  setShowInsufficientBalanceMessage: (value: boolean) =>
    set({ showInsufficientBalanceMessage: value }),

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

  resetMultiplier: () => {
    const { minesCount } = get();
    const initialMultiplier = getInitialMultiplier(minesCount);
    set({ multiplier: initialMultiplier });
  },

  lastCashoutAmount: 0,
  showCashoutPopup: false,

  randomSelectedBoxes: [],
  setRandomSelectedBoxes: (boxes) => set({ randomSelectedBoxes: boxes }),

  autoPlayRounds: 0,
  setAutoPlayRounds: (rounds) => set({ autoPlayRounds: rounds }),

  currentAutoRound: 0,
  isAutoPlaying: false,

  isAutoPlayEnabled: false,
  setIsAutoPlayEnabled: (value: boolean) =>
    set({ isAutoPlayEnabled: value }),

  startAutoPlay: async () => {
    const {
      autoPlayRounds,
      boxesToReveal,
      randomSelectedBoxes,
      setRandomSelectedBoxes,
      isAutoPlaying,
      betValue,
      user,
    } = get();

    if (isAutoPlaying || autoPlayRounds <= 0) return;

    set({ isAutoPlaying: true, currentAutoRound: 0 });

    for (let round = 1; round <= autoPlayRounds; round++) {
      if (user.getBalance() < betValue) break;

      get().startGame();
      await new Promise((r) => setTimeout(r, 300));

      let selected = [...randomSelectedBoxes];

      if (selected.length < boxesToReveal) {
        const allIndexes = Array.from({ length: 25 }, (_, i) => i);
        const used = new Set(selected);

        while (selected.length < boxesToReveal && selected.length < 24) {
          const randIndex = Math.floor(Math.random() * allIndexes.length);
          const candidate = allIndexes[randIndex];
          if (!used.has(candidate)) {
            selected.push(candidate);
            used.add(candidate);
          }
        }
      }

      selected = selected.slice(0, boxesToReveal);
      setRandomSelectedBoxes(selected);

      let exploded = false;

      for (const box of selected) {
        const { gameStarted } = get();
        if (!gameStarted) {
          exploded = true;
          break;
        }
        get().reveal(box);
        await new Promise((r) => setTimeout(r, 400));
      }

      if (!exploded) {
        get().cashout();
        await new Promise((r) => setTimeout(r, 1500));
      }

      set({ currentAutoRound: round });
    }

    set({ isAutoPlaying: false,  randomSelectedBoxes: [],
 });
  },

  stopAutoPlay: () => {
    set({ isAutoPlaying: false, autoPlayRounds: 0, currentAutoRound: 0 });
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
    const { user, betValue, minesCount, setShowInsufficientBalanceMessage } =
      get();

    if (!user.setBet(betValue)) {
      setShowInsufficientBalanceMessage(true);

      setTimeout(() => {
        setShowInsufficientBalanceMessage(false);
      }, 2000);

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
