# 7Eleven
Vanilla HTML, Tailwind CSS CDN, and ES module storefront. Open through a local static server (for example VS Code Live Server), not a file:// URL. Publish this folder as a GitHub Pages site. The Tailwind CDN needs an internet connection, while product images and JavaScript files are local. No build or backend is needed.

Features: ten products, category filters, live search, sorting, persistent bag, 18% illustrative tax, validated checkout, two simulated payment methods that approve valid checkouts, saved history and printable invoices. Customer details are stored locally as part of each invoice. Use sample details.

The catalogue uses real products with sample INR prices and locally stored product images. See [image credits](IMAGE_CREDITS.md). The hero uses the supplied iPhone image.

LocalStorage keys: 7-cart and 7-transactions. Clearing site storage deletes saved data. Prices and tax are academic examples.

Manual checks: add multiple products, refresh, change quantities, remove items, confirm empty checkout is disabled, combine search/filter/sort, submit invalid inputs, simulate both payment methods, reopen invoice history and print or save an invoice. Browser interaction checks have not yet been performed.

