(function(tgen) {

    // spheres
    tgen.effect('spheres', {
        blend: tgen.blendSafe,
        rgba: "randomalpha",
        origin: "random",
        dynamic: "random",
        count: [1, 77],
        size: [
            [1, 92],
            [1, 92]
        ],
        seed: [1, 16777216]
    }, function($g, params) {

        if (params.dynamic === "random") {
            params.dynamic = $g.randInt(0, 1) === 1 ? true : false;
        }

        if (typeof params.size[0] == 'object') {
            params.size[0] = $g.randByArray(params.size[0], false);
        }

        if (typeof params.size[1] == 'object') {
            params.size[1] = $g.randByArray(params.size[1], false);
        }

        for (var i = 0; i < params.count; i++) {

            var xys = $g.xysize(i, params);
            $g.shape.sphere($g, $g.percentX(xys.x), $g.percentY(xys.y), $g.percentXY(xys.size), true, params.rgba, params.dynamic);

        }

        return params;

    });

})(SeamlessTextureGenerator);