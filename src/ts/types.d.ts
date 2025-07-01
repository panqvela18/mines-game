type AutoPlayStopAmount = {
  increase: number | null;
  decrease: number | null;
};

type BetStrategy = {
  type: "same" | "increase" | "decrease";
  percentage: number;
};

type AutoPlayBalanceLimits = {
  min: number | null;
  max: number | null;
};
type BonusOption = "💥" | "2x" | "3x" | "5x" | "10x" | "20x" | "50x" | "100x";

type GameStore = {
  // Game state
  game: Game;
  gameStarted: boolean;
  explodedCellIndex: number | null;
  showAllMines: boolean;
  correctGuesses: number;
  multiplier: number;
  minesCount: number;
  isResettingRound: boolean;
   isSoundOn: boolean;

  // User state
  user: User;
  betValue: number;
  lastCashoutAmount: number;
  showCashoutPopup: boolean;
  showInsufficientBalanceMessage: boolean;

  // Auto-play state
  autoPlayRounds: number;
  currentAutoRound: number;
  isAutoPlaying: boolean;
  boxesToReveal: number;
  isAutoPlayEnabled: boolean;
  randomSelectedBoxes: number[];
  initialAutoPlayBalance: number;
  autoPlayStopAmount: AutoPlayStopAmount;
  autoPlaySingleWinLimit: number | null;
  autoPlayWinStrategy: BetStrategy;
  autoPlayLoseStrategy: BetStrategy;
  autoPlayBalanceLimits: AutoPlayBalanceLimits;

  // Bonus round state
  showBonusModal: boolean;
  bonusOptions: BonusOption[] | undefined;
  bonusResult: BonusOption | null;
  bonusRevealedOptions: BonusOption[];
  bonusCashoutMultiplier: number;
  bonusUserChoice: BonusOption | null;
    skipBonusRoundDuringAutoPlay: boolean;

  // Game actions
  setCorrectGuesses: (count: number) => void;
  incrementCorrectGuesses: () => void;
  setMineCount: (count: number) => void;
  setBetValue: (value: number) => void;
  startGame: () => void;
  reveal: (index: number) => void;
  increaseMultiplier: () => void;
  resetMultiplier: () => void;
  cashout: () => void;
  setShowInsufficientBalanceMessage: (value: boolean) => void;
  setRandomSelectedBoxes: (boxes: number[]) => void;
  setIsResettingRound: (value: boolean) => void;
    setIsSoundOn: (value: boolean) => void;


  // Auto-play actions
  setAutoPlayRounds: (rounds: number) => void;
  startAutoPlay: () => Promise<void>;
  stopAutoPlay: () => void;
  setBoxesToReveal: (count: number) => void;
  setIsAutoPlayEnabled: (value: boolean) => void;
  setInitialAutoPlayBalance: (balance: number) => void;
  setAutoPlayStopAmount: (
    increase: number | null,
    decrease: number | null
  ) => void;
  setAutoPlaySingleWinLimit: (value: number | null) => void;
  setAutoPlayWinStrategy: (strategy: BetStrategy) => void;
  setAutoPlayLoseStrategy: (strategy: BetStrategy) => void;

  //Auto round actions
  skipBonusRound: () => void;
  triggerBonusRound: () => void;
  resolveBonusRound: (choice: BonusOption) => void;
  setBonusRevealedOptions: (options: BonusOption[]) => void;
  setBonusCashoutMultiplier: (value: number) => void;
  setBonusUserChoice: (choice: BonusOption | null) => void;
    setSkipBonusRoundDuringAutoPlay: (value: boolean) => void;

};

// Ui component Types
type CheckboxProps = {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
};

type GridProps<T> = {
  title: string;
  items: T[];
  maxCount?: number;
  selectedItem: T | null;
  onItemClick: (item: T) => void;
  className?: string;
  itemClassName?: string;
};

type StrategyType = "same" | "increase" | "decrease";

type BetStrategySelectorProps = {
  title: string;
  strategy: StrategyType;
  percentage: number;
  onStrategyChange: (value: StrategyType) => void;
  onPercentageChange: (value: number) => void;
  className?: string;
};

type BalanceLimitInputProps = {
  id: string;
  label: string;
  value: number | null;
  enabled: boolean;
  onToggle: (checked: boolean) => void;
  onChange: (value: number | null) => void;
  className?: string;
  min?: number;
  max?: number;
  step?: number;
};
