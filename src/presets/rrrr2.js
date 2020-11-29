

(function (tgen) {

    tgen.preset('rrrr2', {
        "width": 256,
        "height": 256,
        "normalize": "compress",
        "items": [
            [0, ["spheres", "pyramids", "waves", "subplasma", "dots", "clouds", "noise", "lines2", "colorbar", "checkerboard",
                "lines", "squares", "circles", "crosshatch"
            ], {
                    "rgba": [
                        [32, 255],
                        [32, 255],
                        [32, 255],
                        [0.5, 0.9]
                    ],
                    "dynamic": "random"
                }],

            [0, ["spheres", "pyramids", "waves", "subplasma", "dots", "clouds", "noise", "lines2", "colorbar", "checkerboard",
                "lines", "squares", "circles", "crosshatch"
            ], {
                    "blend": "random",
                    "rgba": [
                        [0, 255],
                        [0, 255],
                        [0, 255],
                        [0.1, 0.9]
                    ],
                    "dynamic": "random"
                }],

            [1, ["spheres", "pyramids", "waves", "subplasma", "dots", "clouds", "noise", "lines2", "colorbar", "checkerboard",
                "lines", "squares", "circles", "crosshatch"
            ], {
                    "rgba": [
                        [32, 255],
                        [32, 255],
                        [32, 255],
                        [0.5, 0.9]
                    ],
                    "dynamic": "random"
                }],

            [1, ["spheres", "pyramids", "waves", "subplasma", "dots", "clouds", "noise", "lines2", "colorbar", "checkerboard",
                "lines", "squares", "circles", "crosshatch"
            ], {
                    "blend": "random",
                    "rgba": [
                        [0, 255],
                        [0, 255],
                        [0, 255],
                        [0.1, 0.9]
                    ],
                    "dynamic": "random"
                }],

            [2, "copy", {
                "layer": 0
            }],

            [2, "merge", {
                "layer": 1,
                "blend": "random"
            }],
            [2, "brightness", {
                "adjust": 20
            }],
            [2, "contrast", {
                "adjust": 30
            }],
            [2, "map", {
                "xamount": [2, 177],
                "yamount": [2, 177],
                "xchannel": [0, 4],
                "ychannel": [0, 4],
                "xlayer": [0, 2],
                "ylayer": [0, 2]
            }]
        ]

    });

})(SeamlessTextureGenerator);
