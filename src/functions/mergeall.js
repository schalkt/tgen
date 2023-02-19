module.exports = function (tgen) {

    // merge all layers
    tgen.function(
        "mergeall",
        {
            blend: "opacity",
            firstcopy: true,
            opacity: null,
        },
        function ($g, params) {
            var length = $g.layers.length;

            for (var i = 0; i <= length; i++) {
                //var imageData = $g.layers[i];

                if (i === 0 && params.firstcopy === true) {
                    $g.do("copy", {
                        layer: 0,
                    });
                } else {
                    $g.do("merge", {
                        blend: params.blend,
                        layer: i,
                        opacity: params.opacity,
                    });
                }
            }

            return params;
        }
    );

};