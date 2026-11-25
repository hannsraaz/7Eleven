export class Cart {
  #items;
  constructor() {
    try {
      this.#items = JSON.parse(localStorage.getItem("7-cart")) || {};
    } catch {
      this.#items = {};
    }
  }
  get items() {
    return { ...this.#items };
  }
  add(id) {
    this.change(id, 1);
  }
  change(id, delta) {
    this.#items[id] = Math.max(0, (Number(this.#items[id]) || 0) + delta);
    if (!this.#items[id]) delete this.#items[id];
    this.save();
  }
  remove(id) {
    delete this.#items[id];
    this.save();
  }
  clear() {
    this.#items = {};
    this.save();
  }
  save() {
    localStorage.setItem("7-cart", JSON.stringify(this.#items));
  }
}
