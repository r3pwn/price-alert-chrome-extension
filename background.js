const SITES = {
  'www.target.com/p/': 'scripts/sites/target.js'
}

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  console.log('icon was clicked!')
});

for (let path of Object.keys(SITES)) {
  chrome.webNavigation.onCompleted.addListener(async (details) => {
    await chrome.scripting.insertCSS({
      files: ['price-badge.css'],
      target: { tabId: details.tabId }
    });
    chrome.scripting.executeScript({
      target: {tabId: details.tabId, allFrames: true},
      files: [SITES[path]],
    });
  }, {
    url: [{
      originAndPathMatches: path
    }],
  });
}
