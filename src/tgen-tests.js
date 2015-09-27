(function (fn) {

    var tgen = window[fn];


    // pattern test
    tgen.effect('test-pattern', {}, function ($g, params) {


        var width = $g.texture.width;
        var height = $g.texture.height;

        $g.point.blend = 'opacity';

        $g.point.rgba = [255, 255, 155, 1];
        $g.shape.rect($g, 1, 1, width - 2, height - 2);

        var s = 20;
        $g.point.rgba = [0, 150, 0, 0.6];
        $g.shape.rect($g, 2, 2, s, s);
        $g.shape.rect($g, width - s - 2, 2, s, s);
        $g.shape.rect($g, 2, height - 2 - s, s, s);
        $g.shape.rect($g, width - 2 - s, height - 2 - s, s, s);

        $g.point.rgba = [20, 20, 10, 0.2];
        $g.shape.rect($g, width / 2, height / 2, 178, 178, true);

        $g.point.rgba = [10, 20, 210, 0.7];
        $g.shape.rect($g, width - 5, height - 5, 10, 10);

        var s = 20;
        $g.point.rgba = [0, 0, 0, 1];

        $g.shape.line($g, s, s, width - s, height - s);
        $g.shape.line($g, width - s, s, s, height - s);
        $g.shape.line($g, 0, height / 2, width, height / 2);
        $g.shape.line($g, width / 2, 0, width / 2, height);


        $g.point.rgba = [255, 55, 55, 0.5];
        $g.shape.rect($g, 10, 10, width - 20, height - 20);

        $g.point.rgba = [0, 0, 255, 0.3];
        $g.shape.rect($g, width - 2, height - 2, 4, 4);

        $g.point.rgba = [255, 255, 255, 1];
        $g.point.set(0, 0);
        $g.point.set(width - 1, 0);
        $g.point.set(0, height - 1);
        $g.point.set(width - 1, height - 1);


        $g.point.rgba = [25, 25, 0, 0.2];
        $g.shape.circle($g, width / 4, height / 4, width / 4, true);
		$g.shape.sphere($g, width - width / 4, height - height / 4, width /2, true, [255,255,255,1], true);

        $g.point.rgba = [255, 255, 0, 0.1];
        $g.shape.circle($g, width, height, width, true);

        $g.do('brightness', {"adjust": 50});
        $g.do('vibrance', {"adjust": 100});
        $g.do('contrast', {"adjust": 20});

        return params;

    });


    // all effect test with custom blends
    tgen.effect('test-all', {}, function ($g, params) {

        // base layer
        $g.do('fill');
        $g.do('waves', {"blend": "lighten"});
        $g.do('spheres', {"blend": "difference"});

        var layer = 0;

        for (var key in $g.effects) {

            var effectName = $g.effects[key];

            // recursive check
            if (effectName != 'test-all') {
                $g.do(effectName);
                $g.canvases[layer++] = $g.toCanvas();
            }

        }

        return params;

    });


})('tgen');