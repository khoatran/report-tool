function injectScript(scriptURL) {
	console.log('Inject script: ' + scriptURL);
	var scriptElement = document.createElement('script');
	scriptElement.src = chrome.extension.getURL(scriptURL);
	(document.head||document.documentElement).appendChild(scriptElement);
	scriptElement.onload = function() {
		scriptElement.parentNode.removeChild(scriptElement);
	};
}
injectScript('jquery.js');