//Document Hooks
const $listwrapper = $('#list-wrapper')
const STORES = {
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
//templates 
const TEMPLATES = '../templates/'
const data = [{name: 'walmart'}, {name: 'target'}];

if (!data.length) {
    $listwrapper.load(`${TEMPLATES}/NoPricesFound.html`)
}

data.forEach(store => {
    const $tempElement = $("<div></div>");
    $tempElement.load(`${TEMPLATES}/StorePriceInfo.html`, () => {
        const $listElement = $tempElement.find(".store")
        const $image = $tempElement.find(".store-image")[0]
        const $storeName = $tempElement.find(".store-name")[0]
        const $percentage = $tempElement.find(".price-percentage")[0]
        const $price = $tempElement.find(".price")[0]

        $image.src = STORES[store.name.toUpperCase()].image;
        $image.alt = STORES[store.name.toUpperCase()].name;
        $storeName.innerText = STORES[store.name.toUpperCase()].name;

        $(".store-list").append($listElement);
    });
})