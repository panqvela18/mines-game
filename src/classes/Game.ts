export class Game {
  public mineCount: number;
  private gridSize: number;
  private minePositions: Set<number>;
  private revealedCells: Set<number>;

  constructor(gridSize = 25, mineCount = 5) {
    this.gridSize = gridSize;
    this.mineCount = mineCount;
    this.minePositions = this.generateMines();
    this.revealedCells = new Set();
  }

  private generateMines(): Set<number> {
    const positions = new Set<number>();
    while (positions.size < this.mineCount) {
      const rand = Math.floor(Math.random() * this.gridSize);
      positions.add(rand);
    }
    return positions;
  }

  revealCell(index: number): "mine" | "safe" {
    if (this.revealedCells.has(index)) return "safe";
    this.revealedCells.add(index);
    return this.minePositions.has(index) ? "mine" : "safe";
  }

  isGameOver(): boolean {
    for (const index of this.revealedCells) {
      if (this.minePositions.has(index)) return true;
    }
    return false;
  }

  getRevealedCells(): Set<number> {
    return this.revealedCells;
  }

  getMinePositions(): Set<number> {
    return this.minePositions;
  }

  reset(mineCount: number): void {
    this.mineCount = mineCount;
    this.minePositions = this.generateMines();
    this.revealedCells.clear();
  }
}
