function extractSonarData() {

	var blockerStr = jQuery("#m_blocker_violations").html().replace(",", "");
	var blocker = parseInt(blockerStr);
	
	var criticalStr = jQuery("#m_critical_violations").html().replace(",", "");
	var critical = parseInt(criticalStr);
	
	var majorStr = jQuery("#m_major_violations").html().replace(",", "");
	var major = parseInt(majorStr);
	
	var totalViolationStr = jQuery("#m_violations").html().replace(",", "");
	var totalViolation = parseInt(totalViolationStr);
	
	var lineOfCodeStr = jQuery("#m_ncloc").html().replace(",", "");
	var lineOfCode =  parseInt(lineOfCodeStr);
	
	var commentDensityStr = jQuery("#m_comment_lines_density").html().replace("%", "");
	var commentDensity = parseFloat(commentDensityStr);
	
	var violationDensityStr = jQuery("#m_violations_density").html().replace("%", "");
	var violationDensity = parseFloat(violationDensityStr);
	return {"blocker": blocker, "critical": critical,
		"major": major, "totalViolation": totalViolation,
		"lineOfCode": lineOfCode, "commentDensity": commentDensity,
		"violationDensity": violationDensity};
}


function executeExtractingData() {
	var sonarData = extractSonarData();
	var currentURL = window.location.toString();
	var messageData = {};
	messageData.from = "sonar";
	messageData.sonar = sonarData;

	chrome.extension.sendMessage(messageData, function(response) {
		
	});
}

executeExtractingData();