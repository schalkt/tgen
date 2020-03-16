(function(tgen) {

    // waves
    tgen.effect('waves', {
        blend: tgen.blendSafe,
        rgba: "randomalpha",
        level: [1, 100],
        xsines: [1, 14],
        ysines: [1, 14]
    }, function($g, params) {


        if (params.xsines === undefined) {
            params.xsines = $g.randIntSeed(1, 10);
        } else if (typeof params.xsines == 'object') {
            params.xsines = $g.randIntSeed(params.xsines[0], params.xsines[1]);
        }

        if (params.ysines === undefined) {
            params.ysines = $g.randIntSeed(1, 10);
        } else if (typeof params.ysines == 'object') {
            params.ysines = $g.randIntSeed(params.ysines[0], params.ysines[1]);
        }

        if (params.rgba === undefined) {
            var o = (params.opacity !== undefined) ? params.opacity : 255;
            params.rgba = $g.rgba([
                [0, 255],
                [0, 255],
                [0, 255],
                o
            ]);
        }


        for (var x = 0; x < $g.texture.width; x++) {
            for (var y = 0; y < $g.texture.height; y++) {

                var c = 127 + 63.5 * Math.sin(x / $g.texture.width * params.xsines * 2 * $g.calc.pi) + 63.5 * Math.sin(y / $g.texture.height * params.ysines * 2 * $g.calc.pi);
                if (typeof params.channels == "object") {
                    $g.point.rgba = [params.channels[0] ? c : 0, params.channels[1] ? c : 0, params.channels[2] ? c : 0, params.channels[3] ? c : 0];
                } else {
                    $g.point.rgba = $g.point.colorize([c, c, c, 255], params.rgba, params.level);
                }

                $g.point.set(x, y);

            }
        }

        return params;

    });

})(SeamlessTextureGenerator);