// classes/User.ts
export class User {
  private balance: number;
  private currentBet: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
    this.currentBet = 0;
  }

  setBet(amount: number): boolean {
    if (amount > this.balance) return false;
    this.currentBet = amount;
    return true;
  }

  win(multiplier: number): void {
    this.balance += this.currentBet * multiplier;
  }

  lose(): void {
    this.balance -= this.currentBet;
  }

  getBalance(): number {
    return this.balance;
  }

  getBet(): number {
    return this.currentBet;
  }
}
