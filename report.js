var projectHaveData = 0;
function getProjectFromURL(url) {
	var i = 0;
	var result = null;
	for (i = 0; i < projects.length; i++) {
		if (projects[i].jira_report_url == url || projects[i].sonar_url == url) {
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
	}
	else if(data.from == "sonar") {
		project.sonar = data.sonar;
	}
	console.log(project);
	if(projectHaveData == projects.length) {
		preprocessProjectData();
		renderProject();
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
		result += bugs[i].New + bugs[i].InProgress;
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
	
	var totalBug = getPersistTotalBug(bugs);
	var totalExistBugs = getTotalExistingBugs(bugs);

	var existingBlockerBug = bugs[0].New + bugs[0].InProgress;
	var existingCriticalBug = bugs[1].New + bugs[1].InProgress;
	var existingMajorBug = bugs[2].New + bugs[2].InProgress;

	var importantBugRatio = (existingBlockerBug + existingCriticalBug + existingMajorBug)
			/ totalExistBugs;

	var reopeningBugs = bugs[0].Reopened + bugs[1].Reopened + bugs[2].Reopened
			+ bugs[3].Reopened + bugs[4].Reopened + bugs[5].Reopened
			+ bugs[6].Reopened;
	var reopenBugRatio = reopeningBugs / totalExistBugs;
	project.reopenBugRatio = Math.round(reopenBugRatio * 100);
	project.importantBugRatio = Math.round(importantBugRatio * 100);
}

function renderProject() {
	var dataArray = [];
	var dataRow = null;
	var sonarBlocker = 0;
	var sonarCritical = 0;
	var sonarMajor = 0;
	
	for ( var i = 0; i < projects.length; i++) {
		sonarBlocker = 0;
		sonarCritical = 0;
		sonarMajor = 0;
		if(projects[i].sonar != undefined) {
			sonarBlocker = projects[i].sonar.blocker;
			sonarCritical = projects[i].sonar.critical;
			sonarMajor = projects[i].sonar.major
		}
		dataRow = [ projects[i].name, 
		            projects[i].importantBugRatio,
				projects[i].reopenBugRatio, 
				sonarBlocker,
				sonarCritical, 
				sonarMajor
				];
		dataArray.push(dataRow);
	}

	$('#projectReport').simple_datagrid({
		data : dataArray
	});
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var project = getProjectFromURL(sender.tab.url);
	console.log(request);
	mergeDataToProject(project, request);
	chrome.tabs.remove(sender.tab.id, function() {
	});
});

function openJiraReportAllProjects() {
	var i;

	for (i = 0; i < projects.length; i++) {
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
	openSonarReportAllProjects();
}

$(document).ready(function() {
	$("#refreshButton").bind("click", function() {
		doReport();
	});
	doReport();
});
