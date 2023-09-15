class StoreProductCard extends HTMLElement {
  constructor() {
    super()

    this._product = null
    this.shadow = this.attachShadow({mode: 'open'})
    this.render();
  }

  set product(value) {
    this._product = value
    this.render();
  }

  get product() {
    return this._product
  }

  render() {
    this.shadow.innerHTML = `
    <div class="card-body">
      <div class="card-image">
        <img class="card-image-element" src="${this.product?.image}" alt="${this.product?.imageAlt}">
      </div>
      <div class="card-content">
        <h2 class="card-content-title">${this.product?.store}</h2>
        <div class="card-content-prices">
          <p class="card-content-current-price">${this.product?.price}</p>
          <p class="card-content-original-price">${this.product?.originalPrice}</p>
        </div>
      </div>
    </div>

    <style>
    * {
      margin: 0;
      padding: 0;
    }
    .card-body {
      display: flex;
      align-items: center;
      margin: 1rem 0;
      gap: 1rem;
      background-color: #FFFFFF;
      padding: 0.5rem;
      border-radius: 0.5rem;
      box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    }
    .card-image {
      min-width: 50px;
    }
    .card-image-element {
      width: 50px;
    }
    .card-content {
      display: flex;
      flex-direction: column;
      gap: 0.33rem;
    }
    .card-content-prices {
      display: flex;
      gap: 0.25rem;
      font-size: 1rem;
    }
    .card-content-current-price {
      font-weight: bold;
    }
    .card-content-original-price {
      text-decoration: line-through;
    }
    </style>
    `
  }
}

customElements.define('store-product-card', StoreProductCard)
