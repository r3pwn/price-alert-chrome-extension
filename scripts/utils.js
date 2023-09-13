const API_BASE = 'https://price-analysis-tool.onrender.com';

/**
 * waits for an element matching the given selector to exist
 * @param {string} selector
 * @returns {Promise<Element>}
 */
const waitForElementInternal = (selector) => {
  return new Promise(resolve => {
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    const observer = new MutationObserver(mutations => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

/**
 * waits for an element matching the given selector to exist
 * @param {string} selector
 * @param {number} timeout
 * @returns {Promise<Element>}
 */
export const waitForElement = (selector, timeout = 0) => {
  return timeout > 0 ? 
    timeoutPromise(
      waitForElementInternal(selector),
      `element did not exist after ${timeout}ms`,
      timeout
    ) :
    waitForElementInternal(selector);
}

/**
 * Initiate a promise, but reject if it takes too long
 * @template T
 * @param {Promise<T>} promise - the promise to start
 * @param {string} reason - the error message to use in case of failure
 * @param {number} ms - the number of milliseconds to wait before reporting failure
 * @returns {Promise<T>}
 */
export const timeoutPromise = (promise, reason, ms) => {
  return Promise.race([
    promise,
    new Promise<T>((_resolve, reject) => {
      setTimeout(() => reject(reason), ms);
    })
  ]).catch(error => {
    throw new Error(error);
  });
}

/**
 * Returns an array of products matching the given criteria
 * @param {ProductVendor} vendor 
 * @param {string} idValue 
 * @returns {Promise<Product>}
 */
export const getProduct = async (vendor, idValue) => 
  new Promise((resolve, reject) => {
    return fetch(`${API_BASE}/api/products/${vendor.toLowerCase()}/${idValue}`)
      .then(res => res.json())
      .then(res => {
        res.error && reject(res.error);
        !res.error && resolve(res);
      });
  });

  /**
   * Adds the extension message under the price element
   * @param {Element} priceContainer - Container of the price element
   */
export const addExtensionMessage = (priceContainer) => {
    const parentElement = priceContainer.parentElement;
  
    const extensionMessage = document.createElement('span');
    extensionMessage.style.color = 'green'
    extensionMessage.style.display = 'block'
    extensionMessage.style.fontSize = '1rem'
    extensionMessage.innerHTML = `
    Press <span style="border: 1px solid gray; border-radius: 6px; padding: 3px;">Ctrl + B</span> to see other offers!
    `
    parentElement.append(extensionMessage)
  }


/**
 * @typedef {'Walmart' | 'Kroger' | 'Target'} ProductVendor
 */

/**
 * @typedef {Object} Product
 * @property {string} productName
 * @property {string} productSize
 * @property {ProductStore[]} stores
 */

/**
 * @typedef {Object} ProductStore
 * @property {string} name
 * @property {string} itemId
 * @property {number} price
 * @property {boolean} onSale
 * @property {number} originalPrice
 */