var rowType = [ "Blocker", "Critical", "Major", "Normal", "Minor", "Trivial",
		"Enhancement", "Total" ];
var colType = [ "New", "InProgress", "Resolved", "Verified", "Reopened",
		"Closed", "Total" ];
function getRowType(rowIdx) {
	return rowType[rowIdx - 2];
}
function getColType(coldIdx) {
	return colType[coldIdx];
}

function extractBugData() {
	var rows = $($("table")[4]).find("tbody").find("tr");
	var rowIdx = 0;
	var coldIdx = 0;
	var row = null;
	var cols = null;
	var column = null;
	var bugType = null;
	var result = new Array();
	var item = {};
	var fieldName = null;
	console.log(rows.length);
	for (rowIdx = 2; rowIdx < rows.length; rowIdx++) {
		row = rows[rowIdx];
		cols = $(row).find("td");
		item = {};
		item.name = getRowType(rowIdx);
		for (coldIdx = 0; coldIdx < cols.length; coldIdx++) {
			column = cols[coldIdx];
			fieldName = getColType(coldIdx);
			item[fieldName] = parseInt($(column).text());
		}
		result.push(item);
	}
	return result;
}

function executeExtractingData() {
	var bugData = extractBugData();
	var currentURL = window.location.toString();
	var messageData = {};
	messageData.from = "jira";
	messageData.bugs = bugData;

	
	chrome.extension.sendMessage(messageData, function(response) {
		console.log(response);
	});
}

executeExtractingData();

