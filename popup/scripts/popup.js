const TEMPLATES = './templates/'
const STORES = [
  {
    name: 'Kroger',
    image: '/images/store-logos/Kroger-Logo.png',
    path: 'https://www.kroger.com/p/'
  },
  {
    name: 'Target',
    image: '/images/store-logos/Target-Logo.png',
    path: 'https://www.target.com/p/'
  },
  {
    name: 'Walmart',
    image: '/images/store-logos/WALMART-Logo.png',
    path: 'https://www.walmart.com/ip/'
  }
]

//Document Hooks
const $listwrapper = $('#list-wrapper')

// Are we in a supported site?
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let onSupportedPage = STORES.some(store => tabs[0].url.startsWith(store.path))
      
  if (!onSupportedPage) {
    renderNotSupportedPage();
    return;
  }

  chrome.storage.local.get(["item"]).then(result => populateData(JSON.parse(result.item).product))
})

const populateData = (productData) => {
  if (!productData?.stores?.length) {
    renderNoPricesFound();
    return;
  }
  
  $('.product-title').text(productData.productName);

  for (let store of productData.stores) {
    const storeData = STORES.find(supportedStore => supportedStore.name.toLowerCase() === store.name.toLowerCase());
    if (!storeData) {
      // we don't support displaying this store's values (yet)
      continue;
    }
    const productCard = document.createElement('store-product-card')
    productCard.setAttribute('id', `product-${storeData.name}`)
    productCard.product = {
      image: storeData.image,
      imageAlt: `${storeData.name} logo`,
      store: storeData.name,
      price: store.price.toFixed(2)
    }
    $('.store-list').append(productCard);
  }
}

const renderNotSupportedPage = () => {
  $listwrapper.load(`${TEMPLATES}/NotOnProductPage.html`)
}

const renderNoPricesFound = () => {
  $listwrapper.load(`${TEMPLATES}/NoPricesFound.html`)
}