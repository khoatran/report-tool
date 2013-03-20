var projectHaveData = 0;
function getProjectFromURL(url) {
	var i = 0;
	var result = null;
	for (i = 0; i < projects.length; i++) {
		if (projects[i].jira_report_url == url || projects[i].sonar_url == url
				|| projects[i].jira_obvious_filter_url == url) {
			result = projects[i];
			break;
		}
	}
	return result;
}

function mergeDataToProject(project, data) {
	if (data.from == "jira") {
		project.bugs = data.bugs;
		projectHaveData += 1;
	} else if (data.from == "sonar") {
		project.sonar = data.sonar;
	} else if (data.from == "jira-obvious") {
		project.obviousBug = data.obviousBug;
	}

}

function preprocessProjectData() {
	var project = null;
	for ( var i = 0; i < projects.length; i++) {
		project = projects[i];
		preprocessBugMetric(project);
	}
}
function getTotalExistingBugs(bugs) {
	var i = 0;
	var result = 0;
	for (i = 0; i < bugs.length; i++) {
		result += bugs[i].Total - bugs[i].Closed;
	}
	return result;
}

function getPersistTotalBug(bugs) {
	var i = 0;
	var result = 0;
	for (i = 0; i < bugs.length; i++) {
		result += bugs[i].Total;
	}
	return result;
}

function preprocessBugMetric(project) {

	var bugs = project.bugs;
	if (project.bugs == undefined) {
		return;
	}
	var totalExistBugs = getTotalExistingBugs(bugs);
	var totalPersistBugs = getPersistTotalBug(bugs);
	var existingBlockerBug = bugs[0].Total - bugs[0].Closed;
	var existingCriticalBug = bugs[1].Total - bugs[1].Closed;
	var existingMajorBug = bugs[2].Total - bugs[2].Closed;
	var totalExistingImpBugs = (existingBlockerBug + existingCriticalBug + existingMajorBug);
	var importantBugRatio = 0;
	var reopeningBugs = bugs[0].Reopened + bugs[1].Reopened + bugs[2].Reopened
			+ bugs[3].Reopened + bugs[4].Reopened + bugs[5].Reopened
			+ bugs[6].Reopened;
	var reopenBugRatio = 0;
	var obviousBugRatio = 0;
	if (project.obviousBug == undefined) {
		project.obviousBug = 0;
	}
	if (totalPersistBugs > 0) {
		obviousBugRatio = project.obviousBug / totalPersistBugs;
	}

	if (totalExistBugs > 0) {
		importantBugRatio = (existingBlockerBug + existingCriticalBug + existingMajorBug)
				/ totalExistBugs;
		reopenBugRatio = reopeningBugs / totalExistBugs;
	}
	project.obviousBugRatio = Math.round(obviousBugRatio * 100);
	project.reopenBugRatio = Math.round(reopenBugRatio * 100);
	project.importantBugRatio = Math.round(importantBugRatio * 100);
}

function renderProject() {
	buildReportTable(projects, "#projectReport");
}

function buildReportTable(data, tableID) {
	var tbody = $(tableID).find("tbody");
	tbody.empty();
	var i = 0;
	var htmlRowsString = "";
	for (i = 0; i < projects.length; i++) {
		htmlRowsString += buildReportRow(projects[i], i);
	}
	tbody.append(htmlRowsString);
}

function buildReportRow(project, index) {
	var sonarBlocker = 0;
	var sonarCritical = 0;
	var sonarMajor = 0;
	console.log(project);
	if(project.sonar != undefined) {
		sonarBlocker = project.sonar.blocker;
		sonarCritical = project.sonar.critical;
		sonarMajor = project.sonar.major;
	}
	
	var rowString = "<tr>";
	rowString += "<td>" + project.name + "</td>";
	rowString += "<td>" + project.importantBugRatio + "</td>";
	rowString += "<td>" + project.reopenBugRatio + "</td>";
	rowString += "<td>" + project.obviousBugRatio + "</td>";
	rowString += "<td>" + sonarBlocker + "</td>";
	rowString += "<td>" + sonarCritical + "</td>";
	rowString += "<td>" + sonarMajor + "</td>";
	rowString += "</tr>"
	return rowString;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var project = getProjectFromURL(sender.tab.url);

	mergeDataToProject(project, request);
	chrome.tabs.remove(sender.tab.id, function() {
	});
});

function openJiraReportAllProjects() {
	var i;

	for (i = 0; i < projects.length; i++) {
		if (projects[i].jira_report_url != "") {
			chrome.tabs.create({
				url : projects[i].jira_report_url
			}, function(tab) {
				chrome.tabs.executeScript(tab.id, {
					file : 'jquery.js'
				}, function() {
					chrome.tabs.executeScript(tab.id, {
						file : 'jira-extract.js'
					});
				});
			});
		}

	}
}

function openJiraObviousReportAllProjects() {
	var i;

	for (i = 0; i < projects.length; i++) {
		if (projects[i].jira_obvious_filter_url != "") {
			chrome.tabs.create({
				url : projects[i].jira_obvious_filter_url
			}, function(tab) {
				chrome.tabs.executeScript(tab.id, {
					file : 'jquery.js'
				}, function() {
					chrome.tabs.executeScript(tab.id, {
						file : 'jira-extract-obvious-bug.js'
					});
				});
			});
		}
	}
}

function openSonarReportAllProjects() {
	for (i = 0; i < projects.length; i++) {
		if (projects[i].sonar_url != "") {
			chrome.tabs.create({
				url : projects[i].sonar_url
			}, function(tab) {
				chrome.tabs.executeScript(tab.id, {
					file : 'jquery.js'
				}, function() {
					chrome.tabs.executeScript(tab.id, {
						file : 'sonar-extract.js'
					});
				});
			});
		}
	}
}

function doReport() {
	openJiraReportAllProjects();
	openJiraObviousReportAllProjects();
	openSonarReportAllProjects();
}

$(document).ready(function() {
	//projects = JSON.parse(localStorage["projectData"]);
	
	$("#extractDataButton").bind("click", function() {
		doReport();
	});

	$("#refreshReportButton").bind("click", function() {
		preprocessProjectData();
		renderProject();
	});
	doReport();
});
