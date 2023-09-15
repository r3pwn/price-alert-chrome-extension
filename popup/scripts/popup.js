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
    path: 'https://www.target.com/p/',
    productIdPrefix: 'A-'
  },
  {
    name: 'Walmart',
    image: '/images/store-logos/WALMART-Logo.png',
    path: 'https://www.walmart.com/ip/'
  }
]

//Document Hooks
const $listwrapper = $('#list-wrapper')
let currentStore = '';

// open new links in a new tab on the browser
$(document).ready(function(){
  $('body').on('click', 'a', function(){
    chrome.tabs.create({url: $(this).attr('href')});
    return false;
  });
});

// Are we in a supported site?
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let onSupportedPage = STORES.some(store => tabs[0].url.startsWith(store.path))
      
  if (!onSupportedPage) {
    renderNotSupportedPage();
    return;
  }

  currentStore = STORES.find(store => tabs[0].url.startsWith(store.path));

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

    const itemId = storeData.productIdPrefix ? `${storeData.productIdPrefix}${store.itemId}` : store.itemId;

    const cardWrapper = document.createElement('a');
    if (storeData !== currentStore) {
      cardWrapper.href = `${storeData.path}${slugify(productData.productName)}/${itemId}`;
      cardWrapper.classList.add('card-wrapper');
    }

    const currentStorePrice = productData.stores.find(dataStore => {
      return dataStore.name.toLowerCase() === currentStore.name.toLowerCase();
    })?.price;

    const productCard = document.createElement('store-product-card');
    productCard.setAttribute('id', `product-${storeData.name}`)
    productCard.product = {
      image: storeData.image,
      imageAlt: `${storeData.name} logo`,
      store: storeData.name,
      price: store.price ? `$${store.price?.toFixed(2)}` : '',
      originalPrice: store.originalPrice ? `$${store.originalPrice.toFixed(2)}` : '',
      percentageDifference: calculatePercentageDifferece(currentStorePrice , store.price),
      percentageIndicator: currentStorePrice < store.price ? `&#9650;` : currentStorePrice === store.price ? '-' : `&#9660;`
      }

    if (storeData !== currentStore) { 
      cardWrapper.append(productCard);
      $('.store-list').append(cardWrapper);
    } else {
      $('.store-list').append(productCard);
    }
  }
}

const renderNotSupportedPage = () => {
  $listwrapper.load(`${TEMPLATES}/NotOnProductPage.html`)
}

const renderNoPricesFound = () => {
  $listwrapper.load(`${TEMPLATES}/NoPricesFound.html`)
}

const slugify = (str, separator = '-') => {
  return str
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, separator);
};
/**
 * 
 * @param {Number} currentStorePrice - Price in the current store
 * @param {Number} competitiorPrice - Price in the competitor store
 * @returns {String} The percentage difference, fixed to the last two decimal places.
 */
const calculatePercentageDifferece = (currentStorePrice, competitiorPrice) => {
  return ((Math.abs(competitiorPrice - currentStorePrice) / (Math.abs(competitiorPrice + currentStorePrice) / 2)) * 100).toFixed(2)
}