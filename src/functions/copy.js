module.exports = function (tgen) {

    // layer copy to the current layer
    tgen.function(
        "copy",
        {
            layer: null,
        },
        function ($g, params) {
            if (typeof params == "number") {
                params = {
                    layer: params,
                };
            }

            if (params.layer === null) {
                params.layer = $g.layers.length - 1;
            }

            if ($g.layers[params.layer] != undefined) {
                $g.texture.data = $g.layerCopy(params.layer);
            }

            return params;
        }
    );

};