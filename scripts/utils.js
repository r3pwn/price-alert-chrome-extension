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
 * @param {ProductIdType} idType 
 * @param {string} idValue 
 * @returns {Promise<Product[]>}
 */
export const getProductBy = async (idType, idValue) => 
  fetch(`${API_BASE}/api/products/by${idType.toLowerCase()}/${idValue}`).then(res => res.json());


/**
 * @typedef {'UPC' | 'TCIN'} ProductIdType
 */

/**
 * @typedef {Object} Product
 * @property {string} productName
 * @property {string} productSize
 * @property {ProductId[]} productIds
 * @property {ProductPrice[]} prices
 */

/**
 * @typedef {Object} ProductId
 * @property {ProductIdType} idType
 * @property {string} idValue
 */

/**
 * @typedef {Object} ProductPrice
 * @property {string} vendor
 * @property {number} price
 * @property {boolean} onSale
 * @property {number} originalPrice
 */