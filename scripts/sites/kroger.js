(async function main() {
  const getUpcFromUrl = () => {
    return window.location.href.split('/').pop().match(/([0-9])+/)[0];
  }

  const utils = await import('../utils.js');

  const upc = getUpcFromUrl();
  const priceBadge = await utils.waitForElement('[data-qa="cart-page-item-unit-price"]');

  // for debugging purposes. remove later
  priceBadge.classList.add('visually-distinct-price-badge');

  let returnedProduct;

  await utils.getProductBy('UPC', upc)
    .then((response) => {
      returnedProduct = response?.[0];
    })
    .catch(() => {
      console.log('no product found for upc', upc);
    });
  
  if (!returnedProduct) {
    // we don't have info on this product, we can skip it for now
    return;
  }

  const message = {
    sender: 'price-analysis:kroger',
    product: returnedProduct
  }
  //Send product information to Popup
  chrome.runtime.sendMessage(message);
  console.log('found product', returnedProduct.productName)
  console.table(returnedProduct.prices)
})()