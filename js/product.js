// Inheritance: specialized products share the Product interface.
export class Product {
  constructor(id, name, category, price, image, description) {
    Object.assign(this, { id, name, category, price, image, description });
  }
}
export class Electronics extends Product {}
export class Accessories extends Product {}
export const products = [
  new Electronics(0, "iPhone 15", "Smartphones", 24999, "assets/images/iphone-15.jpg", "Apple smartphone"),
  new Electronics(1, "iPhone 15 Pro", "Smartphones", 37498.5, "assets/images/iphone-15-pro.jpg", "Apple Pro smartphone"),
  new Electronics(2, "MacBook Air", "Laptops", 64999, "assets/images/macbook-air.png", "Apple notebook for everyday work"),
  new Electronics(3, "MacBook Pro", "Laptops", 97498.5, "assets/images/macbook-pro.png", "Apple notebook for professional workflows"),
  new Electronics(4, "Sony WH-CH720N", "Headphones", 4999, "assets/images/sony-wh-ch720n.jpg", "Sony wireless over-ear headphones"),
  new Electronics(5, "Sony WH-1000XM5", "Headphones", 7498.5, "assets/images/sony-wh-1000xm5.png", "Sony wireless over-ear headphones"),
  new Electronics(6, "Apple Watch SE 3", "Smartwatches", 8999, "assets/images/apple-watch-se-3.png", "Apple smartwatch for everyday wear"),
  new Electronics(7, "Apple Watch Ultra 2", "Smartwatches", 13498.5, "assets/images/apple-watch-ultra-2.jpg", "Apple smartwatch for outdoor activities"),
  new Accessories(8, "Anker 332 USB-C Hub", "Accessories", 1999, "assets/images/anker-332.png", "Compact Anker hub for connecting peripherals"),
  new Accessories(9, "Anker 555 USB-C Hub", "Accessories", 2998.5, "assets/images/anker-555.png", "Anker hub for a multi-device desk setup"),
]; 
