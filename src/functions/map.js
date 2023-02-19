module.exports = function (tgen) {

    // map effect - aDDict2
    tgen.function(
        "map",
        {
            seed: null,
            xamount: [4, 512],
            yamount: [4, 512],
            xchannel: [0, 2], // 0=r, 1=g, 2=b, 3=a
            ychannel: [0, 2], // 0=r, 1=g, 2=b, 3=a
            xlayer: 0,
            ylayer: 0,
        },
        function ($g, params) {
            params.xamount = $g.randByArraySeed(params.xamount);
            params.yamount = $g.randByArraySeed(params.yamount);
            params.xchannel = $g.randByArraySeed(params.xchannel);
            params.ychannel = $g.randByArraySeed(params.ychannel);
            params.xlayer = $g.randByArraySeed(params.xlayer);
            params.ylayer = $g.randByArraySeed(params.ylayer);

            const buffer = new $g.buffer();
            const width = $g.texture.width;
            const height = $g.texture.height;

            let size = $g.texture.size();
            let ximageData = $g.layers[params.xlayer];
            let yimageData = $g.layers[params.ylayer];
            let x, y, ox, oy, rgba, offset, sx, sy;

            if (!ximageData || !ximageData[0]) {
                return;
            }

            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {
                    
                    offset = $g.texture.offset(x, y);
                    sx = ximageData[offset + params.xchannel];
                    sy = yimageData[offset + params.ychannel];

                    if (width % 16 == 0) {
                        ox = $g.wrapx(x + ((sx * params.xamount * width) >> 16));
                    } else {
                        ox = x + (sx * params.xamount * width) / (width * width);
                    }

                    if (height % 16 == 0) {
                        oy = $g.wrapy(y + ((sy * params.yamount * height) >> 16));
                    } else {
                        oy = y + (sy * params.yamount * height) / (height * height);
                    }

                    rgba = $g.point.get(ox, oy);

                    buffer.data[offset] = rgba[0];
                    buffer.data[offset + 1] = rgba[1];
                    buffer.data[offset + 2] = rgba[2];
                    buffer.data[offset + 3] = rgba[3];
                }
            }

            while (size--) {
                $g.texture.data[size] = buffer.data[size];
            }

            return params;
        }
    );

};