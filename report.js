var projects = [
		{
			"name" : "Hello Doctor Dedicated Team",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=13033",
			"sonar_url" : ""
		},
		{
			"name" : "Lactalis EDBM",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=12851",
			"sonar_url" : ""
		} ];
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
	}
	projectHaveData += 1;
	if (projectHaveData == projects.length) {
		preprocessProjectData();
		renderProject();
	}
}

function preprocessProjectData() {
	var project = null;
	for(var i=0;i<projects.length;i++) {
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
	
	
	var importantBugRatio = (existingBlockerBug + existingCriticalBug + existingMajorBug) / totalExistBugs;
	
	var reopeningBugs = bugs[0].Reopened + bugs[1].Reopened + bugs[2].Reopened +
	bugs[3].Reopened + bugs[4].Reopened + bugs[5].Reopened + bugs[6].Reopened;
	var reopenBugRatio = reopeningBugs/ totalExistBugs;
	project.reopenBugRatio = reopenBugRatio;
	project.importantBugRatio = importantBugRatio;
}
function renderProject() {
	var table = "";
	table = "<table width='600px'><tr>" +
	"<th>Project</th>" + 
	"<th>Importance bug ratio</th>" + 
	"<th>Reopen bug ratio</th>" +
	"</tr>";
	
	for(var i=0;i<projects.length;i++) {
		var row = "<tr>";
		row += "<th>" + projects[i].name + "</th>";
		row += "<th>" + projects[i].importantBugRatio + "</th>";
		row += "<th>" + projects[i].reopenBugRatio + "</th>";
		row += "</tr>";
		table += row;
	}
	
	table += "</table>";
	$("#report").html(table);
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var project = getProjectFromURL(sender.tab.url);
	mergeDataToProject(project, request);
	sendResponse({
		"project" : project
	});

});

function openJiraReportAllProjects() {
	var i;
	var tabs = new Array();
	for (i = 0; i < projects.length; i++) {
		chrome.tabs.create({
			url : projects[i].jira_report_url
		}, function(tab) {
			tabs.push(tab);
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

openJiraReportAllProjects();
