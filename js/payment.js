// Abstraction: subclasses implement the same payment interface.
export class Payment {
  pay() {
    throw new Error("Implement pay() in a subclass");
  }
}
// Polymorphism: each subclass overrides pay().
export class UPIPayment extends Payment {
  pay(success) {
    return {
      method: "Simulated UPI",
      success,
      message: success ? "UPI simulation approved" : "UPI simulation declined",
    };
  }
}
export class CardPayment extends Payment {
  pay(success) {
    return {
      method: "Simulated card",
      success,
      message: success
        ? "Card simulation approved"
        : "Card simulation declined",
    };
  }
}
