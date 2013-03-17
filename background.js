chrome.browserAction.onClicked.addListener(function(tab) {
	chrome.tabs.query({
		'title' : '*Pyco Project Report*'
	}, function(tabArray) {
		console.log(tabArray)
		if (tabArray == null || tabArray.length == 0) {
			chrome.tabs.create({
				'url' : chrome.extension.getURL('report.html')
			}, function(tab) {
				// Tab opened.
			});
		}
	});

});