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
correctGuesses: number;
setCorrectGuesses: (count: number) => void;
incrementCorrectGuesses: () => void;
  setMineCount: (count: number) => void;
  setBetValue: (value: number) => void;
  startGame: () => void;
  reveal: (index: number) => void;
  resetGame: () => void;
  multiplier: number;
  increaseMultiplier: () => void;
  resetMultiplier: () => void;
  cashout: () => void;
};


const coinSound = typeof Audio !== "undefined" ? new Audio("/mp3/coin-recieved-230517.mp3") : null;
const explosionSound = typeof Audio !== "undefined" ? new Audio("/mp3/blast-37988.mp3") : null;


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
incrementCorrectGuesses: () => set((state) => ({ correctGuesses: state.correctGuesses + 1 })),

multiplier: 1.1,
increaseMultiplier: () => set(state => ({ multiplier: state.multiplier * 1.10 })), // increase by 10%
resetMultiplier: () => set({ multiplier: 1.1 }),


cashout: () => {
  const { user, multiplier, betValue } = get();
  const cashoutAmount = betValue * multiplier;
  user.addBalance(cashoutAmount);  

  set({
    gameStarted: false,
    multiplier: 1.1,
    explodedCellIndex: null,
    showAllMines: true,    
    correctGuesses: 0,    
  });

  setTimeout(() => {
    const { minesCount } = get();
    set({
      game: new Game(25, minesCount),
      gameStarted: false,
      explodedCellIndex: null,
      showAllMines: false,
      multiplier: 1.1,
    });
  }, 2000);
},

  setMineCount: (count) => set({ minesCount: count }),
  setBetValue: (value) => set({ betValue: value }),

  startGame: () => {
    const { user, betValue, minesCount } = get();

    if (!user.setBet(betValue)) {
      console.warn("Not enough balance to place bet");
      return;
    }

    const newGame = new Game(25, minesCount);

    const newUser = new User(user.getBalance());

    set({
      game: newGame,
      gameStarted: true,
      explodedCellIndex: null,
      showAllMines: false,
      user: newUser,
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
      explosionSound.play().catch((err) =>
        console.warn("Explosion sound failed:", err)
      );
    }

    set({
      gameStarted: false,
      explodedCellIndex: index,
      showAllMines: true,
      multiplier: 1,
      correctGuesses: 0,
    });

    setTimeout(() => {
      set({
        game: new Game(25, minesCount),
        gameStarted: false,
        explodedCellIndex: null,
        showAllMines: false,
        multiplier: 1,
      });
    }, 2000);

    return;
  }

  // ✅ Correct guess
  incrementCorrectGuesses();
  increaseMultiplier();

  if (coinSound) {
    coinSound.currentTime = 0;
    coinSound.play().catch((err) =>
      console.warn("Coin sound failed:", err)
    );
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
