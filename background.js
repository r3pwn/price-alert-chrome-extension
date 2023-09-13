const SITES = {
  'www.kroger.com/p/': 'scripts/sites/kroger.js',
  'www.target.com/p/': 'scripts/sites/target.js',
  'www.walmart.com/ip/': 'scripts/sites/walmart.js'
}

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  console.log('icon was clicked!')
});

chrome.runtime.onMessage.addListener((request, sender) => {
  if(request.sender?.includes('price-analysis')) {
    chrome.storage.local.set({"item": JSON.stringify(request)})
  }
})

for (let path of Object.keys(SITES)) {
  const listener = async (details) => {
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
  // this one may not be needed, TBD
  // chrome.webNavigation.onCompleted.addListener(listener, filter);
  chrome.webNavigation.onHistoryStateUpdated.addListener(listener, filter);
}
