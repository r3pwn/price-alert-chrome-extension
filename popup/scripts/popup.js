//CONSTANTS
const TEMPLATES = './templates/'
const STORES = {
    PUBLIX: {
        name: "Publix",
        image: "/images/store-logos/Publix-Logo.png"
    },
    KROGER: {
        name: "Kroger",
        image: "/images/store-logos/Kroger-Logo.png"
    },
    TARGET: {
        name: "Target",
        image: "/images/store-logos/Target-Logo.png"
    },
    WALMART: {
        name: "Walmart",
        image: "/images/store-logos/WALMART-Logo.png"
    }
}

//Document Hooks
const $listwrapper = $('#list-wrapper')

// Are we in a supported site?
let inSupportedStoreSite = false;
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    inSupportedStoreSite = Object.keys(STORES)
        .some(key => tabs[0].url.includes(key.toLowerCase()))
        
        if (!inSupportedStoreSite) {
            console.error('Store not supported!')
            renderNoPricesFound();
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
    
    productData.stores.forEach(store => {
        const productCard = document.createElement('store-product-card')
        productCard.setAttribute('id', 'product-' + STORES[store.name.toUpperCase()]?.name)
        productCard.product = {
            image: STORES[store.name.toUpperCase()]?.image,
            imageAlt: STORES[store.name.toUpperCase()]?.name,
            store: STORES[store.name.toUpperCase()]?.name,
            price: store.price.toFixed(2)
        }
        $(".store-list").append(productCard)
    })
}

const renderNoPricesFound = () => {
    $listwrapper.load(`${TEMPLATES}/NoPricesFound.html`)
}