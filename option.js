var projectData = [];
var currentIdx = -1;

$(document).ready(function() {
	$('#btnSave').bind("click", function() {
		saveOptions();
	});

	$('#btnCancel').bind("click", function() {
		console.log("Cancel");
	});
});

function saveOptions() {
	if (projectData == undefined || projectData == null) {
		projectData = [];
	}
	if (validate()==true) {
		var projectName = $("#projectName").val().trim();
		var jiraQualityReportURL = $("#jiraQualityURL").val().trim();
		var jiraObviousBugURL = $("#jiraObviousBugURL").val().trim();
		var sonarURL = $("#sonarURL").val().trim();
		if(currentIdx == -1) {
			var projectItem = {
					"name" : projectName,
					"jira_report_url" : jiraQualityReportURL,
					"jira_obvious_filter_url" : jiraObviousBugURL,
					"sonar_url" : sonarURL
			};
			projectData.push(projectItem);
		}
		else {
			var project = projectData[currentIdx];
			project.name = projectName;
			project.jira_report_url = jiraQualityReportURL;
			project.jira_obvious_filter_url = jiraObviousBugURL;
			project.sonar_url = sonarURL;
		}
		localStorage["projectData"] = JSON.stringify(projectData);
		
		resetForm();
		reloadProjectGrid();
	}
}

function resetForm() {
	$("#projectName").val("");
	$("#jiraQualityURL").val("");
	$("#jiraObviousBugURL").val("");
	$("#sonarURL").val("");
	
	$("#jiraQualityURLGroup").removeClass("error");
	$("#projectNameGroup").removeClass("error");
	$("#jiraObviousBugURLGroup").removeClass("error");
	$("#errSonarURL").removeClass("error");
	
	$("#errProjectName").html("");
	$("#errJiraQualityURL").html("");
	$("#errJiraObviousBugURL").html("");
	$("#errSonarURL").html("");
	currentIdx = -1;
}
function validate() {
	var projectName = $("#projectName").val().trim();
	var jiraQualityReportURL = $("#jiraQualityURL").val().trim();
	var jiraObviousBugURL = $("#jiraObviousBugURL").val().trim();
	var sonarURL = $("#sonarURL").val().trim();
	if(projectName == "") {
		$("#projectNameGroup").addClass("error");
		$("#errProjectName").html("Project name cannot be empty");
		return false;
	} else {
		$("#projectNameGroup").removeClass("error").addClass("success");
		$("#errProjectName").html("");
	}
	
	if(jiraQualityReportURL == "") {
		$("#jiraQualityURLGroup").addClass("error");
		$("#errJiraQualityURL").html("Jira quality report URL cannot be empty");
		return false;
	}
	if(currentIdx == -1 && jiraQualityReportURL != "" && urlExistInProjectData(jiraQualityReportURL)==true) {
		$("#jiraQualityURLGroup").addClass("error");
		$("#errJiraQualityURL").html("Jira quality report URL exists in other projects");
		return false;
	} else {
		$("#jiraQualityURLGroup").removeClass("error").addClass("success");
		$("#errJiraQualityURL").html("");
	}
	
	if(currentIdx == -1 && jiraObviousBugURL != "" && urlExistInProjectData(jiraObviousBugURL)==true) {
		$("#jiraObviousBugURLGroup").addClass("error");
		$("#errJiraObviousBugURL").html("Jira Obvious filter URL exists in other projects");
		return false;
	} else {
		$("#jiraObviousBugURLGroup").removeClass("error").addClass("success");
		$("#errJiraObviousBugURL").html("");
	}

	if(currentIdx == -1 && sonarURL != "" && urlExistInProjectData(sonarURL) == true) {
		$("#sonarURLGroup").removeClass("info").addClass("error");
		$("#errSonarURL").html("Sonar URL exists in other projects");
		return false;
	}
	$("#errSonarURL").removeClass("error").addClass("success");
	$("#errSonarURL").html("");
	
	return true;
}

function urlExistInProjectData(url) {
	var i=0;
	for(i=0; i < projectData.length; i++) {
		if(projectData[i].jira_report_url==url ||
				projectData[i].jira_obvious_filter_url==url ||
				projectData[i].sonar_url==url) {
			return true;
		}
	}
	return false;
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
	$(".btnModify").bind("click", onModifyProject);
	$(".btnDelete").bind("click", onDeleteProject);
}

function onModifyProject() {
	var rowString = $(this).parent().parent().find('.rowNo').html();
	var rowNum = parseInt(rowString);
	currentIdx = rowNum - 1;
	
	var project = projectData[currentIdx];
	$("#projectName").val(project.name);
	$("#jiraQualityURL").val(project.jira_report_url);
	$("#jiraObviousBugURL").val(project.jira_obvious_filter_url);
	$("#sonarURL").val(project.sonar_url);
	
}

function onDeleteProject() {
	var rowString = $(this).parent().parent().find('.rowNo').html();
	var rowNum = parseInt(rowString);
	currentIdx = rowNum - 1;
	var result =confirm("Are you sure to delete this project?");
	if(result == true) {
		projectData.splice(currentIdx, 1);
		localStorage["projectData"] = JSON.stringify(projectData);
		resetForm();
		reloadProjectGrid();
	}
}

function buildProjectRow(project, index) {
	var rowString = "<tr>";
	var emptyLinkCol = "<td><i class='icon-thumbs-down'></i></td>";
	var actionCol = "<td><button class='btn btn-success btnModify'>Modify</button> <button class='btn btn-danger btnDelete'>Delete</button></td>"
	rowString += "<td class='rowNo'>" + (index + 1) + "</td>";
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