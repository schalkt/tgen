(function (fn) {

	var tgen = window[fn];


	var time;

	tgen.event('beforeEffect', 'save start time', function ($g, effect) {
		time = new Date().getTime();
	});

	tgen.event('afterEffect', 'log', function ($g, effect) {

		var elapsed = new Date().getTime() - time;
		console.log(effect.layer, elapsed, effect.name, effect.params);

	});


})('tgen');