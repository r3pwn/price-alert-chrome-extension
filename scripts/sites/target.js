(async function main() {
  const getTcinFromUrl = () => {
    return window.location.pathname.split('/').pop().match(/([0-9])+/)[0];
  }

  const utils = await import('../utils.js');

  const tcin = getTcinFromUrl();
  const priceBadge = await utils.waitForElement('[data-test="product-price"]');

  utils.addExtensionMessage(priceBadge)

  let returnedProduct;

  await utils.getProduct('Target', tcin)
    .then((response) => {
      returnedProduct = response;
    })
    .catch(() => {
      console.log('no product found for tcin', tcin);
    });

  if (!returnedProduct) {
    // we don't have info on this product, we can skip it for now
    chrome.runtime.sendMessage({
      sender: 'price-analysis:target',
      product: null
    });
    return;
  }

  const message = {
    sender: 'price-analysis:target',
    product: returnedProduct
  }
  //Send product information to Popup
  chrome.runtime.sendMessage(message);
})()