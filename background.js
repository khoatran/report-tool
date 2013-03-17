chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': chrome.extension.getURL('report.html')}, function(tab) {
    // Tab opened.
  });
});