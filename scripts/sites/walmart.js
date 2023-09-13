(async function main() {
  const getItemIdFromUrl = () => {
    return window.location.pathname.split('/').pop().match(/([0-9])+/)[0];
  }

  const utils = await import('../utils.js');

  const itemId = getItemIdFromUrl();
  const priceBadge = await utils.waitForElement('[itemprop="price"]');

  // for debugging purposes. remove later
  priceBadge.classList.add('visually-distinct-price-badge');

  let returnedProduct;

  await utils.getProduct('Walmart', itemId)
  .then((response) => {
    returnedProduct = response;
  })
  .catch(() => {
    console.log('no product found for itemId', itemId);
  });

  if (!returnedProduct) {
    // we don't have info on this product, we can skip it for now
    return;
  }

  const message = {
    sender: 'price-analysis:walmart',
    product: returnedProduct
  }
  //Send product information to Popup
  chrome.runtime.sendMessage(message);
  console.log('found product', returnedProduct.productName)
  console.table(returnedProduct.stores)
})()