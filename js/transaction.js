export class Transaction {
  static generateId() {
    return "SE-" + crypto.randomUUID();
  }
  constructor(items, totals, payment, customer) {
    this.id = Transaction.generateId();
    this.date = new Date().toISOString();
    Object.assign(this, { items, ...totals, payment, customer });
  }
  static history() {
    try {
      return JSON.parse(localStorage.getItem("7-transactions")) || [];
    } catch {
      return [];
    }
  }
  save() {
    localStorage.setItem(
      "7-transactions",
      JSON.stringify([this, ...Transaction.history()]),
    );
  }
}
