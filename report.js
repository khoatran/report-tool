var projects = [ {
	"name" : "Hello Doctor Dedicated Team",
	"jira_quality_report" : "https://jira.pyramid-consulting.com/jira/secure/QualityReport.jspa?pid=13033"
}];

function openReportOfAllProjects() {
	var i;
	for (i=0; i<projects.length;i++) {
		chrome.tabs.create({url: projects[i].jira_quality_report});		
	}
}
openReportOfAllProjects();