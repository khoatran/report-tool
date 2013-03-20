var projectData = [];
		
$(document).ready(function() {

	$('#btnSave').bind("click", function() {
		saveOptions();
		console.log("Save");
	});

	$('#btnCancel').bind("click", function() {
		console.log("Cancel");
	});
});

function saveOptions() {
	if (projectData || projectData == null) {
		projectData = [];
	}
	if (validate()) {
		var projectName = $("#projectName").val();
		var jiraQualityReportURL = $("#jiraQualityURL").val();
		var jiraObviousBugURL = $("#jiraObviousBugURL").val();
		var sonarURL = $("#sonarURL").val();
		var projectItem = {
			"name" : projectName,
			"jira_report_url" : jiraQualityReportURL,
			"jira_obvious_filter_url" : jiraObviousBugURL,
			"sonar_url" : sonarURL
		};
		projectData.push(projectItem);
		localStorage["projectData"] = JSON.stringify(projectData);
		reloadProjectGrid();
	}
}
function validate() {
	var projectName = $("#projectName").val();
	var jiraQualityReportURL = $("#jiraQualityURL").val();
	var jiraObviousBugURL = $("#jiraObviousBugURL").val();
	var sonarURL = $("#sonarURL").val();

	return projectName != "" && jiraQualityReportURL != "";
}

function reloadProjectGrid() {
	var i = 0;
	var project = null;
	var tbody = $("#projectData").find("tbody");
	tbody.empty();
	var i = 0;
	var htmlRowsString = "";
	for (i = 0; i < projectData.length; i++) {
		htmlRowsString += buildProjectRow(projectData[i], i);
	}
	tbody.append(htmlRowsString);
}

function buildProjectRow(project, index) {
	var rowString = "<tr>";
	var emptyLinkCol = "<td><i class='icon-thumbs-down'></i></td>";
	var actionCol = "<td><button class='btn btn-success btnModify'>Modify</button> <button class='btn btn-danger btnDelete'>Delete</button></td>"
	rowString += "<td>" + (index + 1) + "</td>";
	rowString += "<td>" + project.name + "</td>";
	if (project.jira_report_url != "") {
		rowString += "<td><a class='btn btn-link' href='"
				+ project.jira_report_url + "'>Link</a></td>";
	} else {
		rowString += emptyLinkCol;
	}
	if (project.jira_obvious_filter_url != "") {
		rowString += "<td><a class='btn btn-link' href='"
				+ project.jira_obvious_filter_url + "'>Link</a></td>";
	} else {
		rowString += emptyLinkCol;
	}
	if (project.sonar_url != "") {
		rowString += "<td><a class='btn btn-link' href='" + project.sonar_url
				+ "'>Link</a></td>";
	} else {
		rowString += emptyLinkCol;
	}
	rowString += actionCol;
	rowString += "</tr>";
	return rowString;
}

function restoreOptions() {
	projectData = JSON.parse(localStorage["projectData"]);
	reloadProjectGrid();
}

document.addEventListener('DOMContentLoaded', restoreOptions);