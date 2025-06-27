export class User {
  private balance: number;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
  }

  getBalance() {
    return this.balance;
  }

  addBalance(amount: number) {
    this.balance += amount;
  }

  setBet(amount: number): boolean {
    if (amount > this.balance) return false;
    this.balance -= amount;
    return true;
  }

  lose() {
    // nothing to do here for now
  }
}
