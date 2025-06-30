export class Cell {
  public readonly index: number;
  private isMine: boolean;
  private revealed: boolean;

  constructor(index: number, isMine: boolean = false) {
    this.index = index;
    this.isMine = isMine;
    this.revealed = false;
  }

  reveal(): "mine" | "safe" {
    this.revealed = true;
    return this.isMine ? "mine" : "safe";
  }

  isRevealed(): boolean {
    return this.revealed;
  }

  hasMine(): boolean {
    return this.isMine;
  }

  setMine(): void {
    this.isMine = true;
  }

  reset(): void {
    this.revealed = false;
    this.isMine = false;
  }
}
