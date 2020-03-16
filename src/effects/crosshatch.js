(function(tgen) {

    // crosshatch
    tgen.effect('crosshatch', {
        blend: tgen.blendSafe,
        rgba: "randomalpha",
        level: [1, 100],
        xadjust: "random",
        yadjust: "random",
    }, function($g, params) {


        if (params.xadjust === undefined || params.xadjust == 'random') {
            params.xadjust = $g.randRealSeed(0.1, 121);
        }
        if (params.yadjust === undefined || params.yadjust == 'random') {
            params.yadjust = $g.randRealSeed(0.1, 121);
        }
        if (params.rgba === undefined) {
            params.rgba = [$g.randIntSeed(0, 255), $g.randIntSeed(0, 255), $g.randIntSeed(0, 255), 255];
        }

        for (var x = 0; x < $g.texture.width; x++) {
            for (var y = 0; y < $g.texture.height; y++) {

                var c = 127 + 63.5 * Math.sin(x * x / params.xadjust) + 63.5 * Math.cos(y * y / params.yadjust);
                $g.point.rgba = $g.point.colorize([c, c, c, 255], params.rgba, params.level);
                $g.point.set(x, y);

            }
        }


        return params;

    });

})(SeamlessTextureGenerator);