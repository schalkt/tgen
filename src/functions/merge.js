module.exports = function (tgen) {

    // merge one or more layer
    tgen.function(
        "merge",
        {
            blend: "opacity",
            opacity: null,
            layer: 0,
        },
        function ($g, params) {
            if ($g.layers[params.layer] === undefined) {
                return params;
            }

            var imageData = $g.layers[params.layer];

            for (var y = 0; y < $g.texture.height; y++) {
                for (var x = 0; x < $g.texture.width; x++) {
                    var offset = $g.texture.offset(x, y);

                    $g.point.rgba = [
                        imageData[offset],
                        imageData[offset + 1],
                        imageData[offset + 2],
                        params.opacity ? params.opacity : imageData[offset + 3],
                    ];

                    $g.point.set(x, y);
                }
            }

            return params;
        }
    );

};