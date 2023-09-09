(async function main() {
  const utils = await import('../utils.js');

  const priceBadge = await utils.waitForElement('[data-qa="cart-page-item-unit-price"]');

  // for debugging purposes. remove later
  priceBadge.classList.add('visually-distinct-price-badge');
})()