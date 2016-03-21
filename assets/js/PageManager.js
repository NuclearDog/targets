window.PageManager = function(container) {
	var base = this;

	base.options = {
		container: null,
		$container: null,
		pageSelector: '.page'
	};

	base.state = {
		pages: null,
		visible: null
	};

	base.initialize = function() {
		base.options.$container = $(container);
		base.options.container = base.options.$container.get(0);
		base.initializePages();
		base.bindMethods();
	};

	base.initializePages = function() {
		base.state.pages = [];
		$(base.options.pageSelector, base.options.container).each(function() {
			var pageId = $(this).data('id');
			var page = new window.Page[pageId](this);
			base.state.pages[pageId] = page;
			page.state.templates = {};

			$("script[type='text/x-template']").each(function() {
				var id = $(this).data('id');
				page.state.templates[id] = $(this).text();
			});


			page.initialize();
		});
	};

	base.bindMethods = function() {
		$(window).on('popstate', function(ev) {
			if (ev.originalEvent.state == undefined) return;
			var state = ev.originalEvent.state;
			base.show(state.id, state.data);
		});
	};

	base.show = function(id, data) {
		if (base.state.visible != null)
		{
			base.state.pages[base.state.visible].hide();
			base.state.visible = null;
		}

		window.history.pushState({ id: id, data: data }, id, '#' + id);

		base.state.visible = id;
		base.state.pages[id].show(data);
	};

	base.initialize();
	return base;
};