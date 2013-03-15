console.log("Start background JS");
console.log("Report");
chrome.browserAction.onClicked.addListener(function(tab) {
  console.log("Click");
  chrome.tabs.create({'url': "http://google.com"}, function(tab) {
    // Tab opened. Wait until page loads, from here it is not working
    jQuery(document).ready(function() {
        jQuery('#tsf').submit();
        });
  });
});