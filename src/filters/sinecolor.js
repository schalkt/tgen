(function(tgen) {

    // sinecolor - aDDict2
    tgen.filter('sinecolor', {
        sines: [1, 7],
        channel: [0, 2]
    }, function($g, params) {

        params.sines = $g.randByArray(params.sines);
        params.channel = $g.randByArray(params.channel);

        $g.walk(function(color) {

            var n = parseInt(Math.sin(color[params.channel] * ($g.calc.pi / 180.0) * (255 / 360) * params.sines) * 255);
            color[params.channel] = Math.abs(n);
            return color;

        });

        return params;

    });

})(SeamlessTextureGenerator);