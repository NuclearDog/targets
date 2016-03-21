
window.RESTClient = function() {
	var base = this;

	base.options = {
		baseUrl: '/'
	};

	base.state = {

	};

	base.initialize = function() {
	};

	base.create = function(object, data) {
		return new Promise(function(resolve, reject) {
			var uri = URI(base.options.baseUrl);
			uri.segment(object);

			$.ajax({
				data: data,
				dataType: 'json',
				method: 'POST',
				url: uri.toString()
			})
			.done(function(data) {
				resolve(data.data);
			})
			.fail(function(xhr, status, errorThrown) {
				reject();
			});
		});
	};

	base.read = function(object, id, filters) {
		return new Promise(function(resolve, reject) {
			var uri = URI(base.options.baseUrl);
			uri.segment(object);
			if (id !== undefined)
				uri.segment(id + '');

			$.ajax({
				data: filters,
				dataType: 'json',
				method: 'GET',
				url: uri.toString()
			})
			.done(function(data) {
				resolve(data.data);
			})
			.fail(function(xhr, status, errorThrown) {
				reject();
			});
		});
	};

	base.update = function(object, id, data) {
		return new Promise(function(resolve, reject) {
			var uri = URI(base.options.baseUrl);
			uri.segment(object);
			if (id !== undefined)
				uri.segment(id + '');

			$.ajax({
				data: data,
				dataType: 'json',
				method: 'PUT',
				url: uri.toString()
			})
			.done(function(data) {
				resolve();
			})
			.fail(function(xhr, status, errorThrown) {
				reject();
			});

		});
	};

	base.destroy = function(object, id) {
		return new Promise(function(resolve, reject) {
			var uri = URI(base.options.baseUrl);
			uri.segment(object);
			if (id !== undefined)
				uri.segment(id + '');

			$.ajax({
				data: null,
				dataType: 'json',
				method: 'DELETE',
				url: uri.toString()
			})
			.done(function(data) {
				resolve();
			})
			.fail(function(xhr, status, errorThrown) {
				reject();
			});
		});
	};

	return base;
};