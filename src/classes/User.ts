export class User {
  private balance: number;

  constructor(initialBalance?: number) {
    const storedBalance = typeof window !== "undefined" ? sessionStorage.getItem("userBalance") : null;
    this.balance = storedBalance ? parseFloat(storedBalance) : initialBalance ?? 1000;
  }

  getBalance() {
    return this.balance;
  }

  addBalance(amount: number) {
    this.balance += amount;
    this.saveBalance();
  }

  setBet(amount: number): boolean {
    if (amount > this.balance) return false;
    this.balance -= amount;
    this.saveBalance();
    return true;
  }

  private saveBalance() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("userBalance", this.balance.toFixed(2));
    }
  }

  resetBalance(value: number) {
    this.balance = value;
    this.saveBalance();
  }
  
}
