import { Cell } from "./Cell";

export class Game {
  private gridSize: number;
  public mineCount: number;
  private cells: Cell[];

  constructor(gridSize = 25, mineCount = 5) {
    this.gridSize = gridSize;
    this.mineCount = mineCount;
    this.cells = this.generateCells();
  }

  private generateCells(): Cell[] {
    const cells = Array.from({ length: this.gridSize }, (_, index) => new Cell(index));
    let minesPlaced = 0;

    while (minesPlaced < this.mineCount) {
      const rand = Math.floor(Math.random() * this.gridSize);
      if (!cells[rand].hasMine()) {
        cells[rand].setMine();
        minesPlaced++;
      }
    }

    return cells;
  }

  revealCell(index: number): "mine" | "safe" {
    if (this.cells[index].isRevealed()) return "safe";
    return this.cells[index].reveal();
  }

  isGameOver(): boolean {
    return this.cells.some((cell) => cell.isRevealed() && cell.hasMine());
  }

  getRevealedCells(): number[] {
    return this.cells.filter((c) => c.isRevealed()).map((c) => c.index);
  }

  getMinePositions(): number[] {
    return this.cells.filter((c) => c.hasMine()).map((c) => c.index);
  }

  getCells(): Cell[] {
    return this.cells;
  }

  reset(mineCount: number): void {
    this.mineCount = mineCount;
    this.cells.forEach((cell) => cell.reset());

    let minesPlaced = 0;
    while (minesPlaced < this.mineCount) {
      const rand = Math.floor(Math.random() * this.gridSize);
      if (!this.cells[rand].hasMine()) {
        this.cells[rand].setMine();
        minesPlaced++;
      }
    }
  }
}
