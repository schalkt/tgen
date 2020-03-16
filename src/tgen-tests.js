(function(tgen) {

    // pattern test
    tgen.effect('test-pattern', {}, function($g, params) {

        var width = $g.texture.width;
        var height = $g.texture.height;
        var s;

        var check = function(x, y, rgba) {

            var color = $g.point.get(x, y);
            for (var key in rgba) {

                if (rgba[key] != color[key]) {
                    var msg = 'Not equal : ' + x + ' : ' + y + ' ' + JSON.stringify(rgba) + ', ' + JSON.stringify(color);
                    console.warn(msg);
                    //throw new Error(msg);
                }
            }

        };


        $g.point.blend = 'opacity';

        // transparent texture
        $g.texture.clear([255, 255, 255, 0]);
        // check white background
        check(0, 0, [255, 255, 255, 0]);

        // check opacity
        $g.point.rgba = [255, 0, 0, 128];
        $g.point.set(0, 0);
        check(0, 0, [255, 0, 0, 128]);
        $g.point.rgba = [0, 255, 0, 128];
        $g.point.set(0, 0);
        check(0, 0, [85, 170, 0, 128]);


        // check black background
        check(0, 0, [0, 0, 0, 255]);

        // check normalize
        $g.point.rgba = [-1024, 1024, 128.5, 127.6];
        $g.point.set(0, 0);
        check(0, 0, [0, 128, 64, 128]);

        // clear texture
        $g.texture.clear();

        // check opacity
        $g.point.rgba = [255, 0, 0, 128];
        $g.point.set(0, 0);
        $g.point.rgba = [0, 255, 0, 128];
        $g.point.set(0, 0);
        $g.point.rgba = [0, 0, 255, 128];
        $g.point.set(0, 0);
        check(0, 0, [32, 64, 128, 128]);

        // fill texture with white
        $g.texture.clear([255, 255, 255, 255]);
        // check white background
        check(0, 0, [255, 255, 255, 255]);

        // check opacity
        $g.point.rgba = [255, 0, 0, 128];
        $g.point.set(0, 0);
        $g.point.rgba = [0, 255, 0, 128];
        $g.point.set(0, 0);
        $g.point.rgba = [0, 0, 255, 128];
        $g.point.set(0, 0);
        check(0, 0, [63, 95, 159, 128]);

        $g.point.rgba = [0, 0, 255, 128];
        $g.point.set(0, 0);
        check(0, 0, [36, 73, 146, 128]);


        // clear texture
        $g.texture.clear();

        $g.point.rgba = [255, 255, 155, 255];
        $g.shape.rect($g, 1, 1, width - 2, height - 2);

        s = 20;
        $g.point.rgba = [0, 150, 0, 153];
        $g.shape.rect($g, 2, 2, s, s);
        $g.shape.rect($g, width - s - 2, 2, s, s);
        $g.shape.rect($g, 2, height - 2 - s, s, s);
        $g.shape.rect($g, width - 2 - s, height - 2 - s, s, s);

        check(s, s, [102, 192, 62, 153]);

        $g.point.rgba = [20, 20, 10, 51];
        $g.shape.rect($g, width / 2, height / 2, 178, 178, true);

        check(39, 39, [208, 208, 126, 51]);

        $g.point.rgba = [10, 20, 210, 178];
        $g.shape.rect($g, width - 5, height - 5, 10, 10);

        check(2, 2, [38, 72, 165, 178]);

        s = 20;
        $g.point.rgba = [10, 10, 210, 250];
        $g.shape.line($g, s, s, width - s, height - s);
        $g.shape.line($g, width - s, s, s, height - s);
        $g.shape.line($g, 0, height / 2, width, height / 2);
        $g.shape.line($g, width / 2, 0, width / 2, height);

        check(129, 127, [208, 208, 126, 51]);
        check(127, 129, [208, 208, 126, 51]);
        check(236, 20, [12, 14, 11, 250]);
        check(20, 20, [12, 14, 11, 250]);
        check(20, 235, [12, 14, 11, 250]);


        $g.point.rgba = [255, 55, 55, 128];
        $g.shape.rect($g, 10, 10, width - 20, height - 20);

        $g.point.rgba = [0, 0, 255, 76];
        $g.shape.rect($g, width - 2, height - 2, 4, 4);

        $g.point.rgba = [255, 255, 255, 255];
        $g.point.set(0, 0);
        $g.point.set(width - 1, 0);
        $g.point.set(0, height - 1);
        $g.point.set(width - 1, height - 1);

        $g.point.rgba = [25, 25, 0, 51];
        $g.shape.circle($g, width / 4, height / 4, width / 4, true);

        $g.point.rgba = [255, 255, 0, 25];
        $g.shape.circle($g, width, height, width, true);

        $g.shape.sphere($g, width / 4, height - height / 4, width / 2, true, [255, 0, 0, 0], true);
        $g.shape.sphere($g, width / 2, height - height / 4, width / 2, true, [0, 255, 0, 0], true);
        $g.shape.sphere($g, width - width / 4, height - height / 4, width / 2, true, [255, 255, 255, 0], true);
        $g.shape.pyramid($g, width - width / 4, height / 4, width / 2, height / 2, true, [0, 0, 0, 255], true);

        $g.do('brightness', { "adjust": 50 });
        $g.do('vibrance', { "adjust": 100 });
        $g.do('contrast', { "adjust": 20 });

        return params;

    });


    // all effect test with custom blends
    tgen.effect('test-all', {}, function($g, params) {

        var layer = 0;

        $g.normalize = 'clamped';

        // base layer
        $g.do('fill');
        $g.layers[layer++] = $g.texture.export();
        $g.do('waves', { "blend": "lighten" });
        $g.layers[layer++] = $g.texture.export();
        $g.do('spheres', { "blend": "difference" });
        $g.layers[layer++] = $g.texture.export();


        for (var key in $g.effects) {

            var effectName = $g.effects[key];

            // recursive check
            if (effectName != 'test-all') {

                $g.do(effectName);
                $g.layers[layer++] = $g.texture.export();

            }

        }

        return params;

    });


})(SeamlessTextureGenerator);