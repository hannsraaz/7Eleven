import { products } from "./product.js";
import { Cart } from "./cart.js";
import { UPIPayment, CardPayment } from "./payment.js";
import { Transaction } from "./transaction.js";
const cart = new Cart();
const $ = (id) => document.getElementById(id);
const money = (n) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);
let category = "All";
function notify(text) {
  $("status").textContent = text;
  setTimeout(() => ($("status").textContent = ""), 3500);
}
function rows() {
  const quantities = cart.items;
  return products.filter((p) => quantities[p.id]).map((p) => ({ ...p, quantity: quantities[p.id] }));
}

function totals(items = rows()) {
  const subtotal = items.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const tax = Math.round(subtotal * 18) / 100;
  return { subtotal, tax, total: subtotal + tax };
}

function totalHTML({ subtotal, tax, total } = totals()) {
  return `<p>Subtotal: ${money(subtotal)}</p>
    <p>Demo tax (18%): ${money(tax)}</p><h3>Total: ${money(total)}</h3>`;
}

function render() {
  const query = $("search").value.toLowerCase();
  const sort = $("sort").value;
  const list = products.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query),
  );
  if (sort !== "featured") {
    list.sort((a, b) => (sort === "low" ? a.price - b.price : b.price - a.price));
  }
  // Card markup uses only the fixed catalogue, never checkout text.
  $("results").textContent = `${list.length} products`;
  $("catalogue").innerHTML = list
    .map(
      (p) => `<article class="rounded-3xl bg-zinc-100 p-6 transition hover:-translate-y-1 hover:shadow-xl">
    <img class="h-48 w-full object-contain" src="${p.image}" alt="${p.name} product image">
    <small class="text-zinc-500">${p.category}</small><h3 class="mt-2 text-2xl font-semibold">${p.name}</h3><p class="text-sm text-zinc-500">${p.description}</p>
    <strong>${money(p.price)}</strong><br>
    <button class="mt-4 rounded-full border border-zinc-300 px-4 py-2 text-sm hover:bg-white" data-add="${p.id}">Add to bag +</button>
  </article>`,
    )
    .join("");

  const items = rows();
  $("count").textContent = items.reduce((sum, p) => sum + p.quantity, 0);
  $("cart-items").innerHTML =
    items
      .map(
        (p) => `<div class="border-b border-zinc-200 py-4">
    <strong>${p.name}</strong><p class="text-sm text-zinc-500">${money(p.price)}</p>
    <button class="rounded-full border border-zinc-300 px-3 py-1" aria-label="Decrease ${p.name}" data-change="${p.id}" data-delta="-1">−</button>
    ${p.quantity}
    <button class="rounded-full border border-zinc-300 px-3 py-1" aria-label="Increase ${p.name}" data-change="${p.id}" data-delta="1">+</button>
    <button class="ml-2 text-sm text-zinc-500 underline" data-remove="${p.id}">Remove</button>
  </div>`,
      )
      .join("") || "<p>Your bag is empty. Explore the collection.</p>";
  $("totals").innerHTML = totalHTML(totals(items));
  $("checkout").disabled = !items.length;
}
function history() {
  $("history").replaceChildren();
  const records = Transaction.history();
  if (!records.length) $("history").textContent = "Your demo invoices will appear here.";
  records.forEach((t) => {
    const button = document.createElement("button");
    button.className = "rounded-full border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100";
    button.textContent =
      new Date(t.date).toLocaleString() +
      " · " +
      money(t.total) +
      " · " +
      (t.payment.success ? "Success" : "Failed");
    button.onclick = () => receipt(t);
    $("history").append(button);
  });
}
function receipt(t) {
  const subtotal = t.subtotal ?? t.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = t.tax ?? t.total - subtotal;
  $("invoice-status").textContent = t.payment.success ? "Paid · Simulation" : "Declined · Simulation";
  $("invoice-id").textContent = t.id;
  $("invoice-date").textContent = new Date(t.date).toLocaleString("en-IN");
  $("invoice-method").textContent = t.payment.method;
  $("invoice-name").textContent = t.customer?.name ?? "Customer details unavailable";
  $("invoice-email").textContent = t.customer?.email ?? "";
  $("invoice-address").textContent = t.customer?.address ?? "";
  $("invoice-subtotal").textContent = money(subtotal);
  $("invoice-tax").textContent = money(tax);
  $("invoice-total").textContent = money(t.total);
  $("invoice-items").replaceChildren();
  for (const item of t.items) {
    const row = $("invoice-items").insertRow();
    for (const value of [item.name, item.quantity, money(item.price), money(item.price * item.quantity)]) {
      row.insertCell().textContent = value;
    }
  }
  $("receipt-dialog").showModal();
}
$("category-buttons").innerHTML = ["All", ...new Set(products.map((p) => p.category))]
  .map(
    (c) =>
      '<button class="rounded-full border border-zinc-300 px-4 py-2 text-sm hover:bg-zinc-100" data-category="' +
      c +
      '">' +
      c +
      "</button>",
  )
  .join("");
document.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  try {
    if (b.hasAttribute("data-add")) {
      cart.add(b.dataset.add);
      notify("Added to your bag");
    }
    if (b.hasAttribute("data-change")) cart.change(b.dataset.change, Number(b.dataset.delta));
    if (b.hasAttribute("data-remove")) cart.remove(b.dataset.remove);
    if (b.dataset.category) {
      category = b.dataset.category;
      document
        .querySelectorAll("[data-category]")
        .forEach((el) => el.classList.toggle("bg-zinc-950", el === b));
      document
        .querySelectorAll("[data-category]")
        .forEach((el) => el.classList.toggle("text-white", el === b));
      $("products").scrollIntoView();
    }
    if (b.hasAttribute("data-close")) b.closest("dialog").close();
    render();
  } catch {
    notify("Storage unavailable. Please allow local storage to save changes.");
  }
});
$("search").oninput = render;
$("sort").onchange = render;
$("reset").onclick = () => {
  category = "All";
  $("search").value = "";
  $("sort").value = "featured";
  render();
};
$("search-button").onclick = () => {
  $("products").scrollIntoView();
  $("search").focus();
};
$("bag").onclick = () => $("cart-dialog").showModal();
$("checkout").onclick = () => {
  if (!rows().length) return;
  $("summary").textContent = rows()
    .map((p) => p.name + " × " + p.quantity)
    .join(", ");
  $("summary").insertAdjacentHTML("beforeend", totalHTML());
  $("cart-dialog").close();
  $("checkout-dialog").showModal();
};
$("checkout-form").onsubmit = (e) => {
  e.preventDefault();
  if (!rows().length) return;
  const form = new FormData(e.target);
  if (String(form.get("name")).trim().length < 2 || String(form.get("address")).trim().length < 10) {
    notify("Enter your name and a complete address.");
    return;
  }
  // Runtime polymorphism: the selected object's overridden pay() executes.
  const payment = form.get("method") === "upi" ? new UPIPayment() : new CardPayment();
  const result = payment.pay(true);
  const customer = {
    name: String(form.get("name")).trim(),
    email: String(form.get("email")).trim(),
    address: String(form.get("address")).trim(),
  };
  const transaction = new Transaction(rows(), totals(), result, customer);
  try {
    transaction.save();
    if (result.success) cart.clear();
  } catch {
    notify("Unable to save. Enable local storage and retry.");
    return;
  }
  $("checkout-dialog").close();
  e.target.reset();
  render();
  history();
  receipt(transaction);
};
$("history-button").onclick = history;
$("download").onclick = () => window.print();
render();
history();
