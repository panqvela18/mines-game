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
   isResettingRound: false,
  setIsResettingRound: (value: boolean) => set({ isResettingRound: value }),

  showBonusModal: false,
  bonusOptions: [],
  bonusResult: null,
  bonusRevealedOptions: [] as BonusOption[],
  bonusCashoutMultiplier: 1,
  bonusUserChoice: null,

setBonusCashoutMultiplier: (value: number) => set({ bonusCashoutMultiplier: value }),
setBonusUserChoice: (choice: BonusOption | null) => set({ bonusUserChoice: choice }),


setBonusRevealedOptions: (options: BonusOption[]) =>
  set({ bonusRevealedOptions: options }),


  triggerBonusRound: () => {
    const options: BonusOption[] = ["💥","💥", "2x", "3x","5x","10x","20x","50x","100x"].sort(() => 0.5 - Math.random()).slice(0,3) as BonusOption[];
    set({
      showBonusModal: true,
      bonusOptions: options,
      bonusResult: null,
    });
  },

resolveBonusRound: async (choice) => {
  const {
    user,
    minesCount,
    bonusOptions,
    setBonusRevealedOptions,
    setBonusCashoutMultiplier,
    setBonusUserChoice,
  } = get();

  setBonusRevealedOptions(bonusOptions ?? []);
  setBonusUserChoice(choice);

  await new Promise((r) => setTimeout(r, 2000));

  if (choice === "💥") {
    user.lose();
    explosionSound?.play();
    set({
      showBonusModal: false,
      bonusRevealedOptions: [],
      bonusUserChoice: null,
      gameStarted: false,
      explodedCellIndex: -1,
      showAllMines: true,
      correctGuesses: 0,
    });

    setTimeout(() => {
      set({
        game: new Game(25, minesCount),
        gameStarted: false,
        explodedCellIndex: null,
        showAllMines: false,
        multiplier: getInitialMultiplier(minesCount),
        bonusCashoutMultiplier: 1,
      });
    }, 2000);
  } else {
    const factor = parseFloat(choice.replace("x", ""));
    setBonusCashoutMultiplier(factor);
    set({
      showBonusModal: false,
      bonusRevealedOptions: [],
      bonusUserChoice: null,
    });
  }
},


skipBonusRound: () => {
  set({
    showBonusModal: false,
    bonusRevealedOptions: [],
    bonusCashoutMultiplier: 1,
    bonusUserChoice: null,
  });
},




  setAutoPlayBalanceLimits: (min:number, max:number) => set({ autoPlayBalanceLimits: { min, max } }),
  setAutoPlayWinStrategy: (strategy) => set({ autoPlayWinStrategy: strategy }),
  setAutoPlayLoseStrategy: (strategy) => set({ autoPlayLoseStrategy: strategy }),
  setBoxesToReveal: (count) => set({ boxesToReveal: Math.max(1, Math.min(24, count)) }),
  setBetValue: (value) => set({ betValue: value }),
  setAutoPlayRounds: (rounds) => set({ autoPlayRounds: rounds }),
  setIsAutoPlayEnabled: (value) => set({ isAutoPlayEnabled: value }),
  increaseMultiplier: () => {
    const { multiplier, minesCount } = get();
    const increaseRate = getMultiplierIncrease(minesCount);
    set({ multiplier: multiplier * (1 + increaseRate) });
  },
  resetMultiplier: () => set({ multiplier: getInitialMultiplier(get().minesCount) }),
  setCorrectGuesses: (count) => set({ correctGuesses: count }),
  incrementCorrectGuesses: () => set((state) => ({ correctGuesses: state.correctGuesses + 1 })),
  setMineCount: (count) => set({ minesCount: count, multiplier: getInitialMultiplier(count) }),
  setShowInsufficientBalanceMessage: (value) => set({ showInsufficientBalanceMessage: value }),
  setRandomSelectedBoxes: (boxes) => set({ randomSelectedBoxes: boxes }),
  setInitialAutoPlayBalance: (balance) => set({ initialAutoPlayBalance: balance }),
  setAutoPlayStopAmount: (increase, decrease) => set({
    autoPlayStopAmount: {
      increase: increase !== null ? increase : null,
      decrease: decrease !== null ? decrease : null,
    },
  }),
  setAutoPlaySingleWinLimit: (value) => set({ autoPlaySingleWinLimit: value !== null ? value : null }),

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

 reveal: (index: number) => {
    const {
      game,
      user,
      gameStarted,
      minesCount,
      increaseMultiplier,
      incrementCorrectGuesses,
      triggerBonusRound,
      setIsResettingRound,
    } = get();

    if (!gameStarted) return;

    const cell = game.getCells().find((c: { index: number; }) => c.index === index);
    if (!cell || cell.isRevealed()) return;

    const result = game.revealCell(index);
    if (result === "mine") {
      user.lose();
      explosionSound?.play();

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
          gameStarted: false,
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
    coinSound?.play();

    const { correctGuesses } = get();
    const safeCells = 25 - minesCount;

    if (correctGuesses > 0 && correctGuesses % 3 === 0) {
      triggerBonusRound();
      return;
    }

    if (correctGuesses + 1 === safeCells) {
      setTimeout(() => {
        if (get().gameStarted) get().cashout();
      }, 300);
    }

    set({ game, user });
  },


  cashout: () => {
    const {
      user,
      multiplier,
      betValue,
      minesCount,
      autoPlaySingleWinLimit,
      bonusCashoutMultiplier,
      setIsResettingRound,
    } = get();

    const baseCashout = betValue * multiplier;
    const cashoutAmount = baseCashout * bonusCashoutMultiplier;

    user.addBalance(cashoutAmount);
    cashOutSound?.play();

    if (autoPlaySingleWinLimit !== null && cashoutAmount >= autoPlaySingleWinLimit) {
      get().stopAutoPlay();
      return;
    }

    setIsResettingRound(true);

    set({
      gameStarted: false,
      multiplier: getInitialMultiplier(minesCount),
      explodedCellIndex: null,
      showAllMines: true,
      correctGuesses: 0,
      lastCashoutAmount: cashoutAmount,
      showCashoutPopup: true,
      bonusCashoutMultiplier: 1,
    });

    setTimeout(() => {
      set({
        game: new Game(25, minesCount),
        gameStarted: false,
        explodedCellIndex: null,
        showAllMines: false,
        multiplier: getInitialMultiplier(minesCount),
        showCashoutPopup: false,
        isResettingRound: false,
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
  const { autoPlayRounds, boxesToReveal, isAutoPlaying, stopAutoPlay, resolveBonusRound } = get();
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
        await new Promise((r) => setTimeout(r, 500));
        const { bonusOptions } = get();
        if ((bonusOptions ?? []).length > 0) {
          const randomChoice = (bonusOptions ?? [])[Math.floor(Math.random() * (bonusOptions ?? []).length)];
          await resolveBonusRound(randomChoice);
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