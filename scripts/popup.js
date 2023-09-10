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

const getData = async () => {
    let data = {};
    try {
        data = await (await fetch(API_URL)).json()
    }
    catch (err) {
        if (err) {
            $listwrapper.load(`${TEMPLATES}/ErrorOnRequest.html`);
            return;
        }
    }
    if (!data.stores?.length) {
        $listwrapper.load(`${TEMPLATES}/NoPricesFound.html`)
    }
    
    data.stores.forEach(store => {
        const $tempElement = $("<div></div>");
        $tempElement.load(`${TEMPLATES}/StorePriceInfo.html`, () => {
            const $listElement = $tempElement.find(".store")
            const $image = $tempElement.find(".store-image")[0]
            const $storeName = $tempElement.find(".store-name")[0]
            const $percentage = $tempElement.find(".price-percentage")[0]
            const $price = $tempElement.find(".price")[0]
    
            $image.src = STORES[store.storeName.toUpperCase()]?.image;
            $image.alt = STORES[store.storeName.toUpperCase()]?.name;
            $storeName.innerText = STORES[store.storeName.toUpperCase()]?.name;

            $price.innerText = `$${store.price}`
    
            $(".store-list").append($listElement);
        });
    })
}

getData();

