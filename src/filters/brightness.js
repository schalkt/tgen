(function(tgen) {

    // brightness
    // photoshop ok with legacy mode
    tgen.filter('brightness', {
        adjust: 50,
        legacy: true
    }, function($g, params) {


        if (params.legacy === true) {


            $g.walk(function(color) {

                return [
                    Math.min(color[0] + params.adjust, 255),
                    Math.min(color[1] + params.adjust, 255),
                    Math.min(color[2] + params.adjust, 255),
                    color[3]
                ];

            });

        } else {

            // TODO fix
            $g.walk(function(color) {

                return [
                    color[0] = Math.min((255 / color[0]) * (params.adjust / 255), 255),
                    color[1] = Math.min((255 / color[1]) * (params.adjust / 255), 255),
                    color[2] = Math.min((255 / color[2]) * (params.adjust / 255), 255),
                    color[3]
                ];

            });

        }

        return params;

    });

})(SeamlessTextureGenerator);