// store/useGameStore.ts
import { create } from "zustand";
import { Game } from "@/classes/Game";
import { User } from "@/classes/User";
import {
  getInitialMultiplier,
  getMultiplierIncrease,
} from "@/utils/generateMultiplier";
import { generateBonusOptions } from "@/utils/generateOptions";

const coinSound = typeof Audio !== "undefined" ? new Audio("/mp3/coin-recieved-230517.mp3") : null;
const explosionSound = typeof Audio !== "undefined" ? new Audio("/mp3/blast-37988.mp3") : null;
const cashOutSound = typeof Audio !== "undefined" ? new Audio("/mp3/cashier-quotka-chingquot-sound-effect-129698.mp3") : null;

let autoPlayController = { shouldStop: false };

export const useGameStore = create<GameStore>((set, get) => ({
  // Game State
  game: new Game(25, 3),
  user: typeof window !== "undefined" ? new User() : new User(1000),
  minesCount: 3,
  betValue: 0.4,
  multiplier: getInitialMultiplier(3),
  gameStarted: false,
  explodedCellIndex: null,
  showAllMines: false,
  correctGuesses: 0,
  boxesToReveal: 3,

  // Sound Settings
  isSoundOn: true,
  setIsSoundOn: (value) => set({ isSoundOn: value }),

  // UI & State Control
  isResettingRound: false,
  showInsufficientBalanceMessage: false,
  showCashoutPopup: false,
  lastCashoutAmount: 0,
  randomSelectedBoxes: [],
  setRandomSelectedBoxes: (boxes: number[]) => set({ randomSelectedBoxes: boxes }),


  setMineCount: (count) => set({ minesCount: count, multiplier: getInitialMultiplier(count) }),
  setIsResettingRound: (value) => set({ isResettingRound: value }),
  setShowInsufficientBalanceMessage: (value) => set({ showInsufficientBalanceMessage: value }),
  setBetValue: (value) => set({ betValue: value }),
  setBoxesToReveal: (count) => set({ boxesToReveal: Math.max(1, Math.min(24, count)) }),
  setCorrectGuesses: (count) => set({ correctGuesses: count }),
  incrementCorrectGuesses: () => set((s) => ({ correctGuesses: s.correctGuesses + 1 })),
  resetMultiplier: () => set({ multiplier: getInitialMultiplier(get().minesCount) }),
  increaseMultiplier: () => {
    const { multiplier, minesCount } = get();
    const rate = getMultiplierIncrease(minesCount);
    set({ multiplier: multiplier * (1 + rate) });
  },

  // User Actions
  resetUserBalance: (value = 1000) => {
    const user = get().user;
    user.resetBalance(value);
    set({ user });
  },

  // Game Flow
  startGame: () => {
    const { user, betValue, minesCount } = get();
    if (!user.setBet(betValue)) {
      set({ showInsufficientBalanceMessage: true });
      setTimeout(() => set({ showInsufficientBalanceMessage: false }), 2000);
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
    const {
      game, user, gameStarted, minesCount,
      increaseMultiplier, incrementCorrectGuesses,
      triggerBonusRound, setIsResettingRound, isSoundOn
    } = get();

    if (!gameStarted) return;
    const cell = game.getCells().find((c: { index: number; }) => c.index === index);
    if (!cell || cell.isRevealed()) return;

    const result = game.revealCell(index);
    if (result === "mine") {
      if (isSoundOn) explosionSound?.play();

      setIsResettingRound(true);
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
          explodedCellIndex: null,
          showAllMines: false,
          multiplier: getInitialMultiplier(minesCount),
          isResettingRound: false,
        });
      }, 2000);
      return;
    }

    incrementCorrectGuesses();
    increaseMultiplier();
    if (isSoundOn) coinSound?.play();

    const { correctGuesses } = get();
    const safeCells = 25 - minesCount;

    if (correctGuesses > 0 && correctGuesses % 3 === 0 && !get().skipBonusRoundDuringAutoPlay) {
      triggerBonusRound();
      return;
    }

    if (correctGuesses + 1 === safeCells) {
      setTimeout(() => get().gameStarted && get().cashout(), 300);
    }

    set({ game, user });
  },

  cashout: () => {
    const {
      user, multiplier, betValue, minesCount,
      autoPlaySingleWinLimit, bonusCashoutMultiplier,
      setIsResettingRound, isSoundOn
    } = get();

    const base = betValue * multiplier;
    const total = base * bonusCashoutMultiplier;
    user.addBalance(total);
    if (isSoundOn) cashOutSound?.play();

    if (autoPlaySingleWinLimit !== null && total >= autoPlaySingleWinLimit) {
      get().stopAutoPlay();
      return;
    }

    setIsResettingRound(true);
    set({
      gameStarted: false,
      showAllMines: true,
      multiplier: getInitialMultiplier(minesCount),
      correctGuesses: 0,
      explodedCellIndex: null,
      lastCashoutAmount: total,
      showCashoutPopup: true,
      bonusCashoutMultiplier: 1,
    });

    setTimeout(() => set({
      game: new Game(25, minesCount),
      gameStarted: false,
      explodedCellIndex: null,
      showAllMines: false,
      multiplier: getInitialMultiplier(minesCount),
      showCashoutPopup: false,
      isResettingRound: false,
    }), 2000);
  },

  // Bonus Round
  showBonusModal: false,
  bonusOptions: [],
  bonusResult: null,
  bonusRevealedOptions: [],
  bonusCashoutMultiplier: 1,
  bonusUserChoice: null,
  skipBonusRoundDuringAutoPlay: false,

  setBonusCashoutMultiplier: (value) => set({ bonusCashoutMultiplier: value }),
  setBonusUserChoice: (choice) => set({ bonusUserChoice: choice }),
  setBonusRevealedOptions: (options) => set({ bonusRevealedOptions: options }),
  setSkipBonusRoundDuringAutoPlay: (value) => set({ skipBonusRoundDuringAutoPlay: value }),

  triggerBonusRound: () => {
    const options = generateBonusOptions();
    set({ showBonusModal: true, bonusOptions: options, bonusResult: null });
  },

  resolveBonusRound: async (choice) => {
    const {
      bonusOptions, setBonusRevealedOptions,
      setBonusCashoutMultiplier, setBonusUserChoice,
      minesCount, isSoundOn
    } = get();

    setBonusRevealedOptions(bonusOptions ?? []);
    setBonusUserChoice(choice);

    await new Promise((r) => setTimeout(r, 2000));

    if (choice === "💥") {
      if (isSoundOn) explosionSound?.play();
      set({
        showBonusModal: false,
        bonusRevealedOptions: [],
        bonusUserChoice: null,
        gameStarted: false,
        explodedCellIndex: -1,
        showAllMines: true,
        correctGuesses: 0,
      });
      setTimeout(() => set({
        game: new Game(25, minesCount),
        gameStarted: false,
        explodedCellIndex: null,
        showAllMines: false,
        multiplier: getInitialMultiplier(minesCount),
        bonusCashoutMultiplier: 1,
      }), 2000);
    } else {
      const factor = parseFloat(choice.replace("x", ""));
      setBonusCashoutMultiplier(factor);
      set({ showBonusModal: false, bonusRevealedOptions: [], bonusUserChoice: null });
    }
  },

  skipBonusRound: () => set({
    showBonusModal: false,
    bonusRevealedOptions: [],
    bonusCashoutMultiplier: 1,
    bonusUserChoice: null,
  }),

  // Auto Play
  autoPlayRounds: 0,
  currentAutoRound: 0,
  isAutoPlaying: false,
  isAutoPlayEnabled: false,
  initialAutoPlayBalance: 0,
  autoPlayBalanceLimits: { min: null, max: null },
  autoPlayStopAmount: { increase: null, decrease: null },
  autoPlaySingleWinLimit: null,
  autoPlayWinStrategy: { type: "same", percentage: 0 },
  autoPlayLoseStrategy: { type: "same", percentage: 0 },

  setAutoPlayRounds: (rounds) => set({ autoPlayRounds: rounds }),
  setIsAutoPlayEnabled: (value) => set({ isAutoPlayEnabled: value }),
  setInitialAutoPlayBalance: (balance) => set({ initialAutoPlayBalance: balance }),
  setAutoPlayBalanceLimits: (min:number, max:number) => set({ autoPlayBalanceLimits: { min, max } }),
  setAutoPlayStopAmount: (increase, decrease) => set({ autoPlayStopAmount: { increase, decrease } }),
  setAutoPlaySingleWinLimit: (value) => set({ autoPlaySingleWinLimit: value }),
  setAutoPlayWinStrategy: (strategy) => set({ autoPlayWinStrategy: strategy }),
  setAutoPlayLoseStrategy: (strategy) => set({ autoPlayLoseStrategy: strategy }),

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
  const {
    autoPlayRounds,
    boxesToReveal,
    isAutoPlaying,
    stopAutoPlay,
    resolveBonusRound,
    skipBonusRoundDuringAutoPlay,
  } = get();

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

      while (get().showBonusModal) {
        if (skipBonusRoundDuringAutoPlay) {
          get().skipBonusRound();  
        } else {
          await new Promise((r) => setTimeout(r, 500));
          const { bonusOptions } = get();
          if ((bonusOptions ?? []).length > 0) {
            const randomChoice =
              (bonusOptions ?? [])[Math.floor(Math.random() * (bonusOptions ?? []).length)];
            await resolveBonusRound(randomChoice);
          }
        }
      }

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
      set({ bonusCashoutMultiplier: 1 });
    }
  }

  if (!autoPlayController.shouldStop) {
    set({ isAutoPlaying: false, randomSelectedBoxes: [] });
  }
},
}));
