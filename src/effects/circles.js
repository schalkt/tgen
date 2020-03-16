(function(tgen) {

    // circles
    tgen.effect('circles', {
        blend: tgen.blendFlat,
        rgba: "randomalpha",
        origin: "random",
        count: [1, 42],
        size: [
            [1, 42],
            [1, 42]
        ],
        seed: [1, 16777216]
    }, function($g, params) {

        if (typeof params.size[0] == 'object') {
            params.size[0] = $g.randByArraySeed(params.size[0], false);
        }

        if (typeof params.size[1] == 'object') {
            params.size[1] = $g.randByArraySeed(params.size[1], false);
        }

        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.circle($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true);

        }

        return params;

    });

})(SeamlessTextureGenerator);