(function(tgen) {

    // colorize
    tgen.filter('colorize', {
        level: 50,
        rgba: "random",
        colormap: null
    }, function($g, params) {

        $g.colormap.init(params.colormap, 255, function(cmap) {
            params.colormap = cmap;
        });

        $g.walk(function(color) {

            if ($g.colormap.data) {

                var avg = (color[0] + color[1] + color[2]) / 3;
                var c = $g.colormap.get(avg, params.rgba);
                // preserve aplha
                c[3] = color[3];
                return c;

            } else {
                return $g.point.colorize(color, params.rgba, params.level);
            }

        });

        return params;

    });

})(SeamlessTextureGenerator);