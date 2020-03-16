(function(tgen) {

    // grayscale
    tgen.filter('grayscale', {
        method: ['ligthness', 'average', 'luminosity']
    }, function($g, params) {

        if (typeof params == 'string') {
            params = {
                method: params
            }
        }

        if (typeof params.method == 'object') {
            params.method = $g.randItem(params.method);
        }

        switch (params.method) {

            case 'ligthness':
                $g.walk(function(color) {
                    var minmax = Math.max(color[0], color[1], color[2]) + Math.min(color[0], color[1], color[2]);
                    return [
                        minmax,
                        minmax,
                        minmax,
                        color[3]
                    ];
                });
                break;

            case 'average':
                $g.walk(function(color) {
                    var avg = (color[0] + color[1] + color[2]) / 3;
                    return [
                        avg,
                        avg,
                        avg,
                        color[3]
                    ];
                });
                break;

            case 'luminosity':
                $g.walk(function(color) {
                    var lum = $g.calc.luminance(color);
                    return [
                        lum,
                        lum,
                        lum,
                        color[3]
                    ];
                });
                break;

        }

        return params;

    });

})(SeamlessTextureGenerator);