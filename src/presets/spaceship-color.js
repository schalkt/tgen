

(function (tgen) {

    tgen.preset('spaceship-color', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves", {
                "blend": "",
                "rgba": [128, 128, 128, 0.5]
            }],
            [0, "lines2", {
                "blend": ["opacity", "screen"],
                "count": [4, 44],
                "size": [0.1, 7]
            }],
            [0, "lines2", {
                "blend": "random",
                "type": "horizontal",
                "count": [4, 44],
                "size": [0.1, 7]
            }],
            [0, "squares", {
                "blend": ["opacity", "darken", "softlight", ""]
            }],
            [0, "squares", {
                "blend": ["opacity", "darken", "softlight", ""],
                "count": [4, 44],
                "size": [7, 21]
            }],
            [0, "squares", {
                "blend": ["opacity", "darken", "softlight", ""],
                "count": [21, 44],
                "size": [4, 7]
            }],
            [0, "pyramids", {
                "blend": "random",
                "dynamic": true
            }],
            [0, "noise", {
                "blend": "softlight",
                "opacity": 0.2
            }],
            [0, "lines2", {
                "blend": ["opacity"],
                "rgba": [
                    [32, 255],
                    [32, 255],
                    [32, 255],
                    [0.1, 0.5]
                ],
                "type": "horizontal",
                "count": [21, 44],
                "size": [0.1, 1]
            }],
            [0, "lines2", {
                "blend": ["opacity"],
                "rgba": [0, 0, 0, [0.1, 0.5]],
                "count": [4, 21],
                "size": [0.2, 0, 5]
            }],
            [0, "sharpen", {
                "type": 1
            }]
        ]
    });

})(SeamlessTextureGenerator);
