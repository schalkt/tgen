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

            const buffer = new $g.buffer();
            const width = $g.texture.width;
            const height = $g.texture.height;
            const PI = Math.PI;
            const radius = height / 2;
            const centerx = width / 2;
            const centery = height / 2;
            
            let size = $g.texture.size();
            let x, y, rgba, offset, theta_deg, phi_deg, r, dx, dy, inputx, inputy;         

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
        
            while (size--) {
                $g.texture.data[size] = buffer.data[size];
            }

            return params;
        }
    );

};