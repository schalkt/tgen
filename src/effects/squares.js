(function(tgen) {

    // squares
    tgen.effect('squares', {
        blend: tgen.blendFlat,
        rgba: "randomalpha",
        origin: "random",
        count: [1, 42],
        size: [
            [1, 77],
            [1, 77]
        ],
        seed: [1, Number.MAX_SAFE_INTEGER]
    }, function($g, params) {

        params.size[0] = $g.randByArraySeed(params.size[0], false);    
        params.size[1] = $g.randByArraySeed(params.size[1], false);

        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.rect($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), $g.percentXY(xys.size), false);

        }

        return params;

    });

})(SeamlessTextureGenerator);