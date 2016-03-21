window.Page = window.Page || {};

window.Page.Target = function(el) {
	var base = this;

	base.options = {
		el: null,
		$el: null
	};

	base.mode = {
		MODE_NULL: 0,
		MODE_ADD: 1,
		MODE_SUBTRACT: 2
	};

	base.state = {
		templates: null,
		target: null,
		targetType: null,
		shots: [],
		mode: base.mode.MODE_NULL
	};

	base.initialize = function() {
		base.options.$el = $(el);
		base.options.el = base.options.$el.get(0);
		base.options.$el.hide();
		base.bindMethods();
	};

	base.bindMethods = function() {

		$(".brush", base.options.el).on('click', function(ev) {
			ev.preventDefault();
			$(".brush", base.options.el).removeClass('selected');
			$(this).addClass('selected');

			switch ($(this).data('brush'))
			{
				case 'null':
					base.state.mode = base.mode.MODE_NULL;
					break;
				case 'add':
					base.state.mode = base.mode.MODE_ADD;
					break;
				case 'subtract':
					base.state.mode = base.mode.MODE_SUBTRACT;
					break;
			}
		});

		$(base.options.$el).on('mousedown', function(ev) {
			if (base.state.mode != base.mode.MODE_ADD)
				return;

			if ($(ev.target).hasClass('brush')) return;

			var offset = $(this).offset();

			var scale = $(this).width() / (base.state.targetType.centerx * 2);
			var targetX = (ev.originalEvent.pageX - offset.left) / scale;
			var targetY = (ev.originalEvent.pageY - offset.top) / scale;

			var targetXMm = (targetX - base.state.targetType.centerx) / base.state.targetType.dpi * 25.4;
			var targetYMm = (targetY - base.state.targetType.centery) / base.state.targetType.dpi * 25.4;

			var sequence = base.state.shots.length + 1;

			var shot = {
				target_id: base.state.target.id,
				sequence: sequence,
				xoffsetmm: targetXMm,
				yoffsetmm: targetYMm
			};

			window.Targets.RESTClient.create('shot', shot)
			.then(function(shot) {
				base.state.shots.push(shot);
				base.renderShots();
			});


		});

		$(window).on('resize', base.renderShots);

		$(base.options.el).on('click', '.shot', function(ev) {
			if (base.state.mode != base.mode.MODE_SUBTRACT)
				return;

			ev.stopPropagation();
			var $el = $(this);
			var shot = $(this).data('shot');
			window.Targets.RESTClient.destroy('shot', shot.id)
			.then(function() {
				$el.remove();
			});
		});

	};

	base.show = function(data) {
		base.options.$el.show();
		base.state.target = data.target;
		$(".shot", base.options.el).remove();
		base.state.shots = [];
		base.refresh();
	};

	base.refresh = function() {

		window.Targets.RESTClient.read('targettype', base.state.target.targettype_id)
		.then(function(targetType) {
			base.state.targetType = targetType;
			$("#Target", base.options.el).attr('src', '/assets/target/' + targetType.slug + '.png');

		});

		$("#Target", base.options.el).on('load', function() {
			window.Targets.RESTClient.read('shot', undefined, { target_id: base.state.target.id })
			.then(function(shots) {
				base.state.shots = shots;
				base.renderShots();
			});
		});

	};

	base.renderShots = function() {
		for (var i=0; i<base.state.shots.length; i++)
		{
			if (base.state.shots[i]['el'] == undefined)
			{
				// 24px target hole, actual image 64px, hole should be ~0.22in
				base.state.shots[i]['el'] = $(base.state.templates['Shot']).get(0);
				$(base.state.shots[i]['el']).data('shot', base.state.shots[i]);
				$(base.options.el).append(base.state.shots[i]['el']);
			}

			var scale = $("#Target", base.options.el).width() / (base.state.targetType.centerx * 2);
			var offsetXMm = base.state.shots[i].xoffsetmm;
			var offsetYMm = base.state.shots[i].yoffsetmm;
			var centerX = (((offsetXMm / 25.4) * base.state.targetType.dpi) + base.state.targetType.centerx * 1) * scale;
			var centerY = (((offsetYMm / 25.4) * base.state.targetType.dpi) + base.state.targetType.centery * 1) * scale;

			var $el = $(base.state.shots[i]['el']);

			var targetSize = 0.22 * base.state.targetType.dpi * ($("#Target", base.options.el).width() / (base.state.targetType.centerx * 2))
			targetSize /= 0.625; // scale for actual hole size in image
			$el.width(targetSize).height(targetSize);
			$el.css({
				'top': (centerY - ($el.width() / 2)) + 'px',
				'left': (centerX - ($el.height() / 2)) + 'px'
			});

		}
	};

	base.hide = function() {
		base.options.$el.hide();
	};

	return base;
};