var projectData = [
		{
			"name" : "FOLUP V3",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=12895",
			"jira_obvious_filter_url" : "",
			"sonar_url" : "http://sonar.pyramid-consulting.com/sonar/dashboard/index/12166"
		},
		{
			"name" : "PCP",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=11966",
			"jira_obvious_filter_url" : "https://jira.pyramid-consulting.com/jira/secure/IssueNavigator.jspa?mode=hide&requestId=13792",
			"sonar_url" : "http://sonar.pyramid-consulting.com/sonar/dashboard/index/10113"
		},
		{
			"name" : "Belga Sport System",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=12262",
			"jira_obvious_filter_url" : "",
			"sonar_url" : "http://sonar.pyramid-consulting.com/sonar/dashboard/index/18978"
		},
		{
			"name" : "Belga Dashboard",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=12342",
			"jira_obvious_filter_url" : "",
			"sonar_url" : "http://sonar.pyramid-consulting.com/sonar/dashboard/index/20765"
		},
		{
			"name" : "ADP Dedicated team",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=12660",
			"jira_obvious_filter_url" : "",
			"sonar_url" : "http://sonar.pyramid-consulting.com/sonar/dashboard/index/2745"
		},
		{
			"name" : "Smollan Field Sales Manager",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=12594",
			"jira_obvious_filter_url" : "",
			"sonar_url" : "http://sonar.pyramid-consulting.com/sonar/dashboard/index/27548"
		},
		{
			"name" : "Lactalis Envie de bien manger",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=12851",
			"jira_obvious_filter_url" : "",
			"sonar_url" : "http://sonar.pyramid-consulting.com/sonar/dashboard/index/28096"
		},
		{
			"name" : "Mustela",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=12827",
			"jira_obvious_filter_url" : "",
			"sonar_url" : "http://sonar.pyramid-consulting.com/sonar/dashboard/index/24807"
		},
		{
			"name" : "Optic Shoping",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=12894",
			"jira_obvious_filter_url" : "",
			"sonar_url" : "http://sonar.pyramid-consulting.com/sonar/dashboard/index/23475"
		},
		{
			"name" : "Hello Doctor Dedicated Team",
			"jira_report_url" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=13033",
			"jira_obvious_filter_url" : "",
			"sonar_url" : ""
		} ];
$(document).ready(function() {
	$('#projectData').simple_datagrid();
	$('#btnSave').bind("click", function() {
		saveOptions();
		console.log("Save");
	});
	
	$('#btnDelete').bind("click", function() {
		console.log("Delete");
	});
});

function saveOptions() {
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
	//TODO need validation
	if(projectData || projectData == null) {
		projectData = [];
	}
	projectData.push(projectItem);
	localStorage["projectData"] = JSON.stringify(projectData);
}
function restoreOptions() {
	  
	projectData = JSON.parse(localStorage["projectData"]);
	console.log("Restore option");
}

document.addEventListener('DOMContentLoaded', restoreOptions);