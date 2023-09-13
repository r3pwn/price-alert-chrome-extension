//CONSTANTS
const API_URL = 'https://mocki.io/v1/c3e9cbec-0bb1-4481-9913-197cb355329e'
const TEMPLATES = '../templates/'
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
    if (productData.error) {
        renderRequestError();
        return;
    }
    if (!productData.stores?.length) {
        renderNoPricesFound();
        return;
    }
    
    productData.stores.forEach(store => {
        const $tempElement = $("<div></div>");
        $tempElement.load(`${TEMPLATES}/StorePriceInfo.html`, () => {
            const $listElement = $tempElement.find(".store")
            const $image = $tempElement.find(".store-image")[0]
            const $storeName = $tempElement.find(".store-name")[0]
            const $percentage = $tempElement.find(".price-percentage")[0]
            const $price = $tempElement.find(".price")[0]
    
            $image.src = STORES[store.name.toUpperCase()]?.image;
            $image.alt = STORES[store.name.toUpperCase()]?.name;
            $storeName.innerText = STORES[store.name.toUpperCase()]?.name;

            $price.innerText = `$${store.price.toFixed(2)}`
    
            $(".store-list").append($listElement);
        });
    })
}

const renderNoPricesFound = () => {
    $listwrapper.load(`${TEMPLATES}/NoPricesFound.html`)
}

const renderRequestError = () => {
    $listwrapper.load(`${TEMPLATES}/ErrorOnRequest.html`)
}