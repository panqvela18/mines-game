type GameStore = {
  game: Game;
  user: User;
  minesCount: number;
  gameStarted: boolean;
  setMinesCount: (count: number) => void;
  startGame: (betAmount: number) => void;
  reveal: (index: number) => void;
  resetGame: () => void;
};
