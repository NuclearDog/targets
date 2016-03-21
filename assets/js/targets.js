$(document).ready(function() {

	$(".date-picker").pickadate({
		container: $("main"),
		format: 'yyyy-mm-dd'
	});

	window.Targets = {};

	window.Targets.RESTClient = new window.RESTClient();
	window.Targets.RESTClient.options.baseUrl = 'http://targets.l.nucleardog.org/targets/';

	window.Targets.PageManager = new window.PageManager($("main"));
	window.Targets.PageManager.show('Trips');

});