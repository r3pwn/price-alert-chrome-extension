(async function main() {
  const utils = await import('../utils.js');

  const priceBadge = await utils.waitForElement('[itemprop="price"]');

  // for debugging purposes. remove later
  priceBadge.classList.add('visually-distinct-price-badge');

  const nextJsData = JSON.parse((await utils.waitForElement('#__NEXT_DATA__')).textContent);
  const productData = nextJsData?.props?.pageProps?.initialData?.data?.product;

  console.log('productData', productData);
})()