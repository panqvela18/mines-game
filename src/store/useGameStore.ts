import { create } from "zustand";
import { Game } from "@/classes/Game";
import { User } from "@/classes/User";
import {
  getInitialMultiplier,
  getMultiplierIncrease,
} from "@/utils/generateMultiplier";

const coinSound = typeof Audio !== "undefined" ? new Audio("/mp3/coin-recieved-230517.mp3") : null;
const explosionSound = typeof Audio !== "undefined" ? new Audio("/mp3/blast-37988.mp3") : null;
const cashOutSound = typeof Audio !== "undefined" ? new Audio("/mp3/cashier-quotka-chingquot-sound-effect-129698.mp3") : null;

type AutoPlayController = { shouldStop: boolean };
let autoPlayController: AutoPlayController = { shouldStop: false };


export const useGameStore = create<GameStore>((set, get) => ({
  game: new Game(25, 3),
  user: typeof window !== "undefined" ? new User() : new User(1000),
  minesCount: 3,
  betValue: 0.4,
  gameStarted: false,
  explodedCellIndex: null,
  showAllMines: false,
  correctGuesses: 0,
  boxesToReveal: 3,
  autoPlayRounds: 0,
  currentAutoRound: 0,
  isAutoPlaying: false,
  isAutoPlayEnabled: false,
  multiplier: getInitialMultiplier(3),
  showInsufficientBalanceMessage: false,
  showCashoutPopup: false,
  lastCashoutAmount: 0,
  randomSelectedBoxes: [],
  initialAutoPlayBalance: 0,
  autoPlayBalanceLimits: { min: null, max: null },
  autoPlayStopAmount: { increase: null, decrease: null },
  autoPlaySingleWinLimit: null,
  autoPlayWinStrategy: { type: "same", percentage: 0 },
  autoPlayLoseStrategy: { type: "same", percentage: 0 },

  // Actions
  setAutoPlayBalanceLimits: (min: number, max: number) =>
    set({ autoPlayBalanceLimits: { min, max } }),

  setAutoPlayWinStrategy: (strategy) =>
    set({ autoPlayWinStrategy: strategy }),

  setAutoPlayLoseStrategy: (strategy) =>
    set({ autoPlayLoseStrategy: strategy }),

  setBoxesToReveal: (count) =>
    set({ boxesToReveal: Math.max(1, Math.min(24, count)) }),

  setBetValue: (value) => set({ betValue: value }),

  setAutoPlayRounds: (rounds) => set({ autoPlayRounds: rounds }),

  setIsAutoPlayEnabled: (value) => set({ isAutoPlayEnabled: value }),

  increaseMultiplier: () => {
    const { multiplier, minesCount } = get();
    const increaseRate = getMultiplierIncrease(minesCount);
    set({ multiplier: multiplier * (1 + increaseRate) });
  },

  resetMultiplier: () => {
    const { minesCount } = get();
    set({ multiplier: getInitialMultiplier(minesCount) });
  },

  setCorrectGuesses: (count) => set({ correctGuesses: count }),

  incrementCorrectGuesses: () =>
    set((state) => ({ correctGuesses: state.correctGuesses + 1 })),

  setMineCount: (count) =>
    set({ minesCount: count, multiplier: getInitialMultiplier(count) }),

  setShowInsufficientBalanceMessage: (value) =>
    set({ showInsufficientBalanceMessage: value }),

  setRandomSelectedBoxes: (boxes) => set({ randomSelectedBoxes: boxes }),

  setInitialAutoPlayBalance: (balance) =>
    set({ initialAutoPlayBalance: balance }),

  setAutoPlayStopAmount: (increase, decrease) =>
    set({
      autoPlayStopAmount: {
        increase: increase !== null ? increase : null,
        decrease: decrease !== null ? decrease : null,
      },
    }),

  setAutoPlaySingleWinLimit: (value) =>
    set({ autoPlaySingleWinLimit: value !== null ? value : null }),

  resetUserBalance: (value = 1000) => {
    const user = get().user;
    user.resetBalance(value);
    set({ user });
  },

  startGame: () => {
    const { user, betValue, minesCount, setShowInsufficientBalanceMessage } = get();
    if (!user.setBet(betValue)) {
      setShowInsufficientBalanceMessage(true);
      setTimeout(() => setShowInsufficientBalanceMessage(false), 2000);
      return;
    }

    set({
      game: new Game(25, minesCount),
      gameStarted: true,
      explodedCellIndex: null,
      showAllMines: false,
      multiplier: getInitialMultiplier(minesCount),
    });
  },

  reveal: (index) => {
    const { game, user, gameStarted, minesCount, increaseMultiplier, incrementCorrectGuesses } = get();
    if (!gameStarted) return;

    const result = game.revealCell(index);
    if (result === "mine") {
      user.lose();
      explosionSound?.play();

      set({
        gameStarted: false,
        explodedCellIndex: index,
        showAllMines: true,
        multiplier: getInitialMultiplier(minesCount),
        correctGuesses: 0,
      });

      setTimeout(() => {
        set({
          game: new Game(25, minesCount),
          gameStarted: false,
          explodedCellIndex: null,
          showAllMines: false,
          multiplier: getInitialMultiplier(minesCount),
        });
      }, 2000);

      return;
    }

    incrementCorrectGuesses();
    increaseMultiplier();
    coinSound?.play();
    set({ game, user });
  },

  cashout: () => {
    const { user, multiplier, betValue, minesCount, autoPlaySingleWinLimit } = get();
    const cashoutAmount = betValue * multiplier;
    user.addBalance(cashoutAmount);
    cashOutSound?.play();

    if (autoPlaySingleWinLimit !== null && cashoutAmount >= autoPlaySingleWinLimit) {
      get().stopAutoPlay();
      return;
    }

    set({
      gameStarted: false,
      multiplier: getInitialMultiplier(minesCount),
      explodedCellIndex: null,
      showAllMines: true,
      correctGuesses: 0,
      lastCashoutAmount: cashoutAmount,
      showCashoutPopup: true,
    });

    setTimeout(() => {
      set({
        game: new Game(25, minesCount),
        gameStarted: false,
        explodedCellIndex: null,
        showAllMines: false,
        multiplier: getInitialMultiplier(minesCount),
        showCashoutPopup: false,
      });
    }, 2000);
  },

  stopAutoPlay: () => {
  autoPlayController.shouldStop = true;
  const { minesCount } = get();
  set({
    isAutoPlaying: false,
    autoPlayRounds: 0,
    currentAutoRound: 0,
    gameStarted: false,
    explodedCellIndex: null,
    showAllMines: false,
    correctGuesses: 0,
    multiplier: getInitialMultiplier(minesCount),
    game: new Game(25, minesCount),
    randomSelectedBoxes: [],
  });
},

  startAutoPlay: async () => {
    const { autoPlayRounds, boxesToReveal, isAutoPlaying, stopAutoPlay } = get();
    if (isAutoPlaying || autoPlayRounds <= 0) return;

    autoPlayController = { shouldStop: false };
    set({ isAutoPlaying: true, currentAutoRound: 0, randomSelectedBoxes: [] });

    for (let round = 1; round <= autoPlayRounds; round++) {
      const {
        user,
        betValue,
        minesCount,
        autoPlayLoseStrategy,
        autoPlayWinStrategy,
        setBetValue,
        autoPlayStopAmount,
        initialAutoPlayBalance,
      } = get();

      const currentBalance = user.getBalance();
      const profit = currentBalance - initialAutoPlayBalance;

      const shouldStopDueToIncrease =
        autoPlayStopAmount.increase !== null &&
        profit >= autoPlayStopAmount.increase;
      const shouldStopDueToDecrease =
        autoPlayStopAmount.decrease !== null &&
        -profit >= autoPlayStopAmount.decrease;

      if (
        autoPlayController.shouldStop ||
        shouldStopDueToIncrease ||
        shouldStopDueToDecrease ||
        currentBalance < betValue
      ) {
        stopAutoPlay();
        break;
      }

      set({
        game: new Game(25, minesCount),
        gameStarted: false,
        explodedCellIndex: null,
        showAllMines: false,
        multiplier: getInitialMultiplier(minesCount),
        correctGuesses: 0,
        showCashoutPopup: false,
        randomSelectedBoxes: [],
      });

      await new Promise((r) => setTimeout(r, 100));
      get().startGame();
      if (!get().gameStarted) continue;

      await new Promise((r) => setTimeout(r, 600));
      const selected = [...Array(25).keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, boxesToReveal);
      set({ randomSelectedBoxes: selected });

      await new Promise((r) => setTimeout(r, 100));

      let shouldContinue = true;
      for (const box of selected) {
        if (autoPlayController.shouldStop || !get().gameStarted) {
          shouldContinue = false;
          break;
        }
        get().reveal(box);
        await new Promise((r) => setTimeout(r, 800));

        if (get().explodedCellIndex !== null) {
          shouldContinue = false;

          const { type, percentage } = autoPlayLoseStrategy;
          if (type !== "same") {
            const multiplier = type === "increase" ? 1 + percentage / 100 : 1 - percentage / 100;
            setBetValue(Math.max(0.01, parseFloat((betValue * multiplier).toFixed(2))));
          }

          await new Promise((r) => setTimeout(r, 2000));
          break;
        }
      }

      if (!autoPlayController.shouldStop && shouldContinue && get().correctGuesses === boxesToReveal) {
        get().cashout();

        const { type, percentage } = autoPlayWinStrategy;
        if (type !== "same") {
          const multiplier = type === "increase" ? 1 + percentage / 100 : 1 - percentage / 100;
          setBetValue(Math.max(0.01, parseFloat((betValue * multiplier).toFixed(2))));
        }

        await new Promise((r) => setTimeout(r, 2000));
      }

      if (!autoPlayController.shouldStop) {
        set({ currentAutoRound: round });
      }
    }

    if (!autoPlayController.shouldStop) {
      set({ isAutoPlaying: false, randomSelectedBoxes: [] });
    }
  },
}));
