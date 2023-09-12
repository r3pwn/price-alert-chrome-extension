(async function main() {
  const getTcinFromUrl = () => {
    return window.location.href.split('/').pop().match(/([0-9])+/)[0];
  }

  const utils = await import('../utils.js');

  const tcin = getTcinFromUrl();
  const priceBadge = await utils.waitForElement('[data-test="product-price"]');

  // for debugging purposes. remove later
  priceBadge.classList.add('visually-distinct-price-badge');

  const returnedProducts = await utils.getProductBy('TCIN', tcin);

  const relevantProduct = returnedProducts?.[0];

  console.log('found product', relevantProduct.productName)
  console.table(relevantProduct.prices)
})()