const SITES = {
  'www.kroger.com/p/': 'scripts/sites/kroger.js',
  'www.target.com/p/': 'scripts/sites/target.js',
  'www.walmart.com/ip/': 'scripts/sites/walmart.js'
}

chrome.runtime.onMessage.addListener((request, sender) => {
  if(request.sender?.includes('price-analysis')) {
    chrome.storage.local.set({"item": JSON.stringify(request)})
  }
})

let activeUrl = '';

for (let path of Object.keys(SITES)) {
  const listener = async (details) => {
    if (details.url === activeUrl) {
      // we've already run and injected, so we can safely return.
      return;
    }

    activeUrl = details.url;

    await chrome.scripting.insertCSS({
      files: ['price-badge.css'],
      target: { tabId: details.tabId }
    });
    chrome.scripting.executeScript({
      target: {tabId: details.tabId, allFrames: true},
      files: [SITES[path]],
    });
  };
  const filter = {
    url: [{ originAndPathMatches: path }]
  };

  /* several e-commerce sites seem to be using some kind of router, so make sure we fire 
   * on full page loads as well as "soft" page loads
   */
  chrome.webNavigation.onDOMContentLoaded.addListener(listener, filter);
  chrome.webNavigation.onHistoryStateUpdated.addListener(listener, filter);
}

// onCompleted and onErrorOccurred, we want to reset the activeUrl so the extension will load again
chrome.webNavigation.onCompleted.addListener(() => { activeUrl = ''; });
chrome.webNavigation.onErrorOccurred.addListener(() => { activeUrl = ''; });