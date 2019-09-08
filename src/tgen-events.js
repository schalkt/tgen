(function (tgen) {

	var time;
	var fulltime;

	tgen.event('beforeEffect', 'save start time', function ($g, effect) {
		time = new Date().getTime();
	});

	tgen.event('afterEffect', 'log', function ($g, effect) {

		var elapsed = new Date().getTime() - time;
		$g.log(effect.layer, elapsed, effect.name, effect.params);

	});

	tgen.event('beforeRender', 'log', function ($g, params) {
		fulltime = new Date().getTime();
	});

	tgen.event('afterRender', 'log', function ($g, params) {

		var elapsed = new Date().getTime() - fulltime;
		$g.log(elapsed, params);

	});


})(SeamlessTextureGenerator);