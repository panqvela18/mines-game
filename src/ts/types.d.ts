type AutoPlayBalanceLimits = {
  min: number;
  max: number;
};

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
  multiplier: number;
  increaseMultiplier: () => void;
  resetMultiplier: () => void;
  cashout: () => void;
  lastCashoutAmount: number;
  showCashoutPopup: boolean;
  showInsufficientBalanceMessage: boolean;
  setShowInsufficientBalanceMessage: (value: boolean) => void;
  randomSelectedBoxes: number[];
  setRandomSelectedBoxes: (boxes: number[]) => void;
  autoPlayRounds: number;
  setAutoPlayRounds: (rounds: number) => void;
  currentAutoRound: number;
  startAutoPlay: () => void;
  isAutoPlaying: boolean;
  stopAutoPlay: () => void;
  boxesToReveal: number;
  setBoxesToReveal: (count: number) => void;
  isAutoPlayEnabled: boolean;
  setIsAutoPlayEnabled: (value: boolean) => void;

  // ✅ New fields for balance limits
  autoPlayBalanceLimits: AutoPlayBalanceLimits;
  setAutoPlayBalanceLimits: (min: number, max: number) => void;
};
