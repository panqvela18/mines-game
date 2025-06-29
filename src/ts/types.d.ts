type AutoPlayBalanceLimits = {
  min: number;
  max: number;
};

type AutoPlayBetStrategy = {
  type: "same" | "increase" | "decrease";
  percentage: number;
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
  autoPlayBalanceLimits: AutoPlayBalanceLimits;
  setAutoPlayBalanceLimits: (min: number, max: number) => void;

 autoPlayWinStrategy: BetStrategy;
  autoPlayLoseStrategy: BetStrategy;
  setAutoPlayWinStrategy: (strategy: BetStrategy) => void;
  setAutoPlayLoseStrategy: (strategy: BetStrategy) => void;
};


// reusable ui types

type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  className?: string;
};



type GridProps<T> = {
  title: string;
  items: T[];
  maxCount?: number;
  selectedItem: T | null;
  onItemClick: (item: T) => void;
  className?: string;
};

// strategy selector

type StrategyType = "same" | "increase" | "decrease";

type BetStrategySelectorProps = {
  title: string;
  strategy: StrategyType;
  percentage: number;
  onStrategyChange: (value: StrategyType) => void;
  onPercentageChange: (value: number) => void;
};