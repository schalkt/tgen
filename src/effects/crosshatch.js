(function(tgen) {

    // crosshatch
    tgen.effect('crosshatch', {
        blend: tgen.blendSafe,
        rgba: "randomalpha",
        level: [1, 100],
        xadjust: "random",
        yadjust: "random",
    }, function($g, params) {

        params.xadjust = $g.randRealByArraySeed(params.xadjust, [0.1, 121]);
        params.yadjust = $g.randRealByArraySeed(params.yadjust, [0.1, 121]);
        
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