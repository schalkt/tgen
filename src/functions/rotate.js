module.exports = function (tgen) {

    tgen.function(
        "rotate",
        {
            seed: null,
            angle: 90,
            times: [1, 3],
            type: 1,
            blend: tgen.blendSafe,
        },
        function ($g, params) {
            
            params.type = $g.randByArraySeed(params.type);

            if (params.angle === null) {
                params.angle = $g.randItemByArraySeed(params.angle, [90, 180, 270]);
            } else {
                params.angle = $g.randByArraySeed(params.angle);
            }

            params.times = $g.randByArraySeed(params.times);

            const buffer = new $g.buffer();            
            const width = $g.texture.width;
            const height = $g.texture.height;
            
            let rad = params.angle * (Math.PI / 180);
            let size = $g.texture.size();
            let i, x, y, rgba, rgba1, rgba2, offset, newX, newY;

            const rotateType1 = function () {
                for (x = 0; x < width; x++) {
                    for (y = 0; y < height; y++) {
                        newX = Math.ceil(Math.cos(rad) * x - Math.sin(rad) * y);
                        newY = Math.ceil(Math.sin(rad) * x + Math.cos(rad) * y);

                        rgba1 = $g.point.get(x, y);
                        rgba2 = $g.point.get(newX, newY);
                        rgba = $g.blend(params.blend, rgba2, rgba1);

                        offset = $g.texture.offset(x, y);
                        buffer.data[offset] = rgba[0];
                        buffer.data[offset + 1] = rgba[1];
                        buffer.data[offset + 2] = rgba[2];
                        buffer.data[offset + 3] = rgba[3];
                    }
                }

                while (size--) {
                    $g.texture.data[size] = buffer.data[size];
                }
            };

            const rotateType2 = function () {
                for (x = 0; x < width; x++) {
                    for (y = 0; y < height; y++) {
                        newX = Math.ceil(Math.cos(rad) * x - Math.sin(rad) * y);
                        newY = Math.ceil(Math.sin(rad) * x + Math.cos(rad) * y);

                        rgba1 = $g.point.get(x, y);
                        rgba2 = $g.point.get(newX, newY);
                        rgba = $g.blend(params.blend, rgba2, rgba1);

                        offset = $g.texture.offset(newX, newY);

                        buffer.data[offset] = rgba[0];
                        buffer.data[offset + 1] = rgba[1];
                        buffer.data[offset + 2] = rgba[2];
                        buffer.data[offset + 3] = rgba[3];
                    }
                }
                while (size--) {
                    $g.texture.data[size] = buffer.data[size];
                }
            };

            for (i = 1; i <= params.times; i++) {
                size = $g.texture.size();
                rad = i * params.angle * (Math.PI / 180);

                if (params.type === 1) {
                    rotateType1();
                } else {
                    rotateType2();
                }
            }

            return params;
        }
    );

};