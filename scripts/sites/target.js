(async function main() {
  const utils = await import('../utils.js');

  const priceBadge = await utils.waitForElement('[data-test="product-price"]');

  // for debugging purposes. remove later
  priceBadge.classList.add('visually-distinct-price-badge');
})()