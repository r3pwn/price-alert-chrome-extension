(async function main() {
  const getUpcFromUrl = () => {
    return window.location.pathname.split('/').pop().match(/([0-9])+/)[0];
  }

  const utils = await import('../utils.js');

  const upc = getUpcFromUrl();
  const priceBadge = await utils.waitForElement('[data-qa="cart-page-item-unit-price"]');

  utils.addExtensionMessage(priceBadge)

  let returnedProduct;

  await utils.getProduct('Kroger', upc)
    .then((response) => {
      returnedProduct = response;
    })
    .catch(() => {
      console.log('no product found for upc', upc);
    });
  
  if (!returnedProduct) {
    // we don't have info on this product, we can skip it for now
    chrome.runtime.sendMessage({
      sender: 'price-analysis:kroger',
      product: null
    });

    return;
  }

  const message = {
    sender: 'price-analysis:kroger',
    product: returnedProduct
  }
  //Send product information to Popup
  chrome.runtime.sendMessage(message);
})()