(function (fn) {

    var tgen = window[fn];

    // console.log
    tgen.event('afterEffect', 'log', function ($g, effect) {
        console.log(effect.layer, effect.name, effect.params);
    });

	tgen.event('afterRender', 'log2', function ($g, effect) {
		console.log('----',effect.layer, effect.name, effect.params);
	});


})('tgen');