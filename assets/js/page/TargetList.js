window.Page = window.Page || {};

window.Page.TargetList = function(el) {
	var base = this;

	base.options = {
		el: null,
		$el: null
	};

	base.state = {
		templates: null,
		trip: null
	};

	base.initialize = function() {
		base.options.$el = $(el);
		base.options.el = base.options.$el.get(0);
		base.options.$el.hide();
		base.bindMethods();
	};

	base.bindMethods = function() {
		$("#targets", base.options.el).on('click', '.target', function(ev) {
			var target = $(this).data('target');
			window.Targets.PageManager.show('Target', { 'target': target });
		});

		$("#targets", base.options.el).on('click', '.delete', function(ev) {
			ev.stopPropagation();
			var target = $(this).closest('.target').data('target');
			var $el = $(this).closest('.target');

			window.Targets.RESTClient.destroy('target', target.id)
			.then(function() {
				$el.remove();
			});

		});

		$("#AddTarget", base.options.el).on('click', function(ev) {
			var target = {
				targettype_id: $("#TargetType", base.options.el).val(),
				distance: $("#Distance", base.options.el).val(),
				sequence: $("#Sequence", base.options.el).val(),
				trip_id: base.state.trip.id
			};

			window.Targets.RESTClient.create('target', target)
			.then(function(target) {
				window.Targets.PageManager.show('Target', { target: target });
			});
		});
	};

	base.show = function(data) {
		base.options.$el.show();
		base.state.trip = data.trip;
		base.refresh();
	};

	base.refresh = function() {
		$("#targets", base.options.el).empty();
		window.Targets.RESTClient.read('target', undefined, { trip_id: base.state.trip.id })
		.then(function(targets) {
			for (var i=0; i<targets.length; i++)
			{
				var targetEl = $(base.state.templates['Target']);
				$(targetEl).data('target', targets[i]);
				$(".sequence", targetEl).text(targets[i].sequence);
				$(".distance", targetEl).text(targets[i].distance);
				$("#targets", base.options.el).append(targetEl);
			}
		});

		$("#TargetType", base.options.el).empty().append("<option></option>");
		window.Targets.RESTClient.read('targettype', undefined)
		.then(function(targetTypes) {
			for (var i=0; i<targetTypes.length; i++)
			{
				$("#TargetType", base.options.el).append(
					$("<option></option>")
						.data('targetType', targetTypes[i])
						.text(targetTypes[i].name)
						.attr('value', targetTypes[i].id)
				);
			}
		});

	};

	base.hide = function() {
		base.options.$el.hide();
	};

	return base;
};