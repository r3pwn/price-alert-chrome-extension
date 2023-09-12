(async function main() {
  const getItemIdFromUrl = () => {
    return window.location.href.split('/').pop().match(/([0-9])+/)[0];
  }

  const utils = await import('../utils.js');

  const itemId = getItemIdFromUrl();
  const priceBadge = await utils.waitForElement('[itemprop="price"]');

  // for debugging purposes. remove later
  priceBadge.classList.add('visually-distinct-price-badge');

  let returnedProduct;

  await utils.getProductBy('WalmartItemId', itemId)
  .then((response) => {
    returnedProduct = response?.[0];
  })
  .catch(() => {
    console.log('no product found for itemId', itemId);
  });

  if (!returnedProduct) {
    // we don't have info on this product, we can skip it for now
    return;
  }

  console.log('found product', returnedProduct.productName)
  console.table(returnedProduct.prices)
})()