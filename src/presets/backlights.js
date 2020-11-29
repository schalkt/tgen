

(function (tgen) {

    tgen.preset('backlights', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "count": [4, 42],
                "size": [4, 77],
                "rgba": [
                    [64, 200],
                    [64, 200],
                    [64, 200], 255
                ]
            }],
            [1, "spheres", {
                "count": [4, 42],
                "size": [4, 77],
                "rgba": [
                    [64, 200],
                    [64, 200],
                    [64, 200], 255
                ]
            }],
            [2, "copy", 0],
            [2, "merge", {
                "layer": 1,
                "blend": "backlight"
            }]
        ]
    });

})(SeamlessTextureGenerator);
