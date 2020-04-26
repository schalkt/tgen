(function(tgen) {

    // layer copy to the current layer
    tgen.function('copy', {
        "layer": null
    }, function($g, params) {

        if (typeof params == 'number') {
            params = {
                "layer": params
            };
        }

        if (params.layer === null) {
            params.layer = $g.layers.length - 1;
        }

        if ($g.layers[params.layer] != undefined) {
            $g.texture.data = $g.layerCopy(params.layer);
        }

        return params;

    });


    // merge all layers
    tgen.function('mergeall', {
        blend: "opacity",
        firstcopy: true,
        opacity: null
    }, function($g, params) {

        var length = $g.layers.length;

        for (var i = 0; i <= length; i++) {

            var imageData = $g.layers[i];

            if (i === 0 && params.firstcopy === true) {

                $g.do('copy', {
                    layer: 0,
                });

            } else {

                $g.do('merge', {
                    blend: params.blend,
                    layer: i,
                    opacity: params.opacity
                });

            }

        }

        return params;

    });

    // merge one or more layer
    tgen.function('merge', {
        blend: "opacity",
        layer: 0,
        opacity: null
    }, function($g, params) {

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
                    params.opacity ? params.opacity : imageData[offset + 3]
                ];

                $g.point.set(x, y);

            }
        }

        return params;

    });

    // map effect - aDDict2
    tgen.function('map', {
        xamount: [5, 255],
        yamount: [5, 255],
        xchannel: [0, 2], // 0=r, 1=g, 2=b, 3=a
        ychannel: [0, 2], // 0=r, 1=g, 2=b, 3=a
        xlayer: 0,
        ylayer: 0
    }, function($g, params) {

        params.xamount = $g.randByArraySeed(params.xamount);
        params.yamount = $g.randByArraySeed(params.yamount);
        params.xchannel = $g.randByArraySeed(params.xchannel);
        params.ychannel = $g.randByArraySeed(params.ychannel);
        params.xlayer = $g.randByArraySeed(params.xlayer);
        params.ylayer = $g.randByArraySeed(params.ylayer);

        var buffer = new $g.buffer();

        var width = $g.texture.width;
        var height = $g.texture.height;
        var ximageData = $g.layers[params.xlayer];
        var yimageData = $g.layers[params.ylayer];
        var x, y, ox, oy, rgba, offset, sx, sy;

        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {

                offset = $g.texture.offset(x, y);
                sx = ximageData[offset + params.xchannel];
                sy = yimageData[offset + params.ychannel];

                if ((width % 16) == 0) {
                    ox = $g.wrapx(x + ((sx * params.xamount * width) >> 16));
                } else {
                    ox = x + ((sx * params.xamount * width) / (width * width));
                }

                if ((height % 16) == 0) {
                    oy = $g.wrapy(y + ((sy * params.yamount * height) >> 16));
                } else {
                    oy = y + ((sy * params.yamount * height) / (height * height));
                }

                rgba = $g.point.get(ox, oy);

                buffer.data[offset] = rgba[0];
                buffer.data[offset + 1] = rgba[1];
                buffer.data[offset + 2] = rgba[2];
                buffer.data[offset + 3] = rgba[3];

            }
        }

        var size = $g.texture.size();
        while (size--) {
            $g.texture.data[size] = buffer.data[size];
        }

        return params;

    });


})(SeamlessTextureGenerator);