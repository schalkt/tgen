module.exports = function (tgen) {

    // WIP - equirectangular
    // https://stackoverflow.com/questions/51869432/converting-360-degree-view-to-equirectangular-in-node-js

    tgen.function(
        "equirectangular",
        {
            layer: null,
        },
        function ($g, params) {
            if (params.layer === null) {
                params.layer = $g.layers.length - 1;
            }

            var buffer = new $g.buffer();
            var width = $g.texture.width;
            var height = $g.texture.height;
            var x, y, rgba, offset, theta_deg, phi_deg, r, dx, dy, inputx, inputy;

            var radius = height / 2;
            var PI = Math.PI;
            var centerx = width / 2;
            var centery = height / 2;

            for (x = 0; x < width; x++) {
                for (y = 0; y < height; y++) {
                    theta_deg = 360 - (x * 360) / width - 180;
                    phi_deg = 180 - (y * 180) / height;
                    r = Math.sin((phi_deg * PI) / 180);
                    dx = Math.cos((theta_deg * PI) / 180) * r;
                    dy = Math.sin((theta_deg * PI) / 180) * r;
                    inputx = Math.round(dx * radius + centerx);
                    inputy = Math.round(dy * radius + centery);

                    rgba = $g.point.get(inputx, inputy);

                    // 32 32 180 90 1 1.2246467991473532e-16 -1 32 0
                    //console.log(x, y, theta_deg, phi_deg, r, dx, dy, inputx, inputy);

                    offset = $g.texture.offset(x, y);
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
        }
    );

};