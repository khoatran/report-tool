

function extractBugData() {
	var issueCountString = $("#bulkedit_all").html();
	issueCountString = issueCountString.replace("all", "");
	issueCountString = issueCountString.replace("issue(s)", "");
	issueCountString = issueCountString.replace(",", "");
	return parseInt(issueCountString);
	
}

function executeExtractingData() {
	var numberOfObviousBug = extractBugData();

	var messageData = {};
	messageData.from = "jira-obvious";
	messageData.obviousBug = numberOfObviousBug;

	chrome.extension.sendMessage(messageData, function(response) {

	});
}

executeExtractingData();
