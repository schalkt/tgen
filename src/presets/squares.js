

(function (tgen) {

    tgen.preset('squares', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "squares", {

                "count": [4, 14],
                "origin": [50, 50],
                "size": [2, 200],
                "rgba": [
                    [1, 255],
                    [1, 255],
                    [1, 255],
                    [0.05, 0.15]
                ]
            }],
            [0, "squares", {
                "blend": ["opacity", "lighten", "darken", "softlight", "multiply", "screen", "exclusion"],
                "count": [4, 14],
                "origin": [50, 50],
                "size": [2, 100],
                "rgba": [
                    [1, 255],
                    [1, 255],
                    [1, 255],
                    [0.05, 0.15]
                ]
            }],
            [0, "brightness", {
                "adjust": -10,
                "legacy": true
            }],
            [0, "vibrance", {
                "adjust": 50
            }],
            [1, "copy", 0],
            [1, "contrast", {
                "adjust": 50
            }]
        ]
    });

})(SeamlessTextureGenerator);
