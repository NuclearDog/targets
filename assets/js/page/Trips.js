window.Page = window.Page || {};

window.Page.Trips = function(el) {
	var base = this;

	base.options = {
		el: null,
		$el: null
	};

	base.state = {
		templates: null
	};

	base.initialize = function() {
		base.options.$el = $(el);
		base.options.el = base.options.$el.get(0);
		base.options.$el.hide();
		base.bindMethods();
	};

	base.bindMethods = function() {
		$("#trips", base.options.el).on('click', '.trip', function(ev) {
			var trip = $(this).data('trip');
			window.Targets.PageManager.show('TargetList', { trip: trip });
		});

		$("#trips", base.options.el).on('click', '.delete', function(ev) {
			ev.stopPropagation();
			var trip = $(this).closest('.trip').data('trip');
			var $el = $(this).closest('.trip');
			window.Targets.RESTClient.destroy('trip', trip.id)
			.then(function() {
				$el.remove()
			});
		});

		$("#AddTrip", base.options.el).on('click', function(ev) {
			ev.preventDefault();
			var date = $("#Date", base.options.el).val();
			var location_id = $("#Location", base.options.el).val();
			window.Targets.RESTClient.create('trip', { date: date, location_id: location_id })
			.then(function(trip) {
				window.Targets.PageManager.show('TargetList', { trip: trip });
			});
		});
	};

	base.show = function(data) {
		base.options.$el.show();
		$("#Date", base.options.el).val('');
		base.refresh();
	};

	base.hide = function() {
		base.options.$el.hide();
	};

	base.refresh = function() {
		$("#trips", base.options.el).empty();
		window.Targets.RESTClient.read('trip').then(function(trips) {
			for (var i=0; i<trips.length; i++)
			{
				var tripEl = $(base.state.templates['Trip']);
				$(".date", tripEl).text(trips[i].date);
				$(tripEl).data('trip', trips[i]);
				$("#trips", base.options.el).append(tripEl);
			}
		});

		$("#Location", base.options.el).empty().append("<option></option>");
		window.Targets.RESTClient.read('location').then(function(locations) {
			for (var i=0; i<locations.length; i++)
			{
				var locationEl = $("<option></option>").attr('value', locations[i].id).text(locations[i].name);
				$("#Location", base.options.el).append(locationEl);
			}
		});

	};

	return base;
};