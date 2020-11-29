

(function (tgen) {

    tgen.preset('rrrr', {
        "width": 256,
        "height": 256,
        "normalize": "compress",
        "items": [
            [0, ["spheres", "pyramids", "waves", "subplasma", "dots", "clouds", "noise", "lines2", "colorbar", "checkerboard",
                "lines", "squares", "circles", "crosshatch", "xor"
            ], {
                    "blend": ["lighten", "opacity", "screen"],
                    "rgba": [
                        [0, 255],
                        [0, 255],
                        [0, 255],
                        [0.2, 0.9]
                    ],
                    "dynamic": "random"
                }],

            [1, "copy", 0],

            [1, ["spheres", "pyramids", "waves", "subplasma", "dots", "clouds", "noise", "lines2", "colorbar", "checkerboard",
                "lines", "squares", "circles", "crosshatch", "xor"
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

            [2, "copy", 1],

            [2, ["spheres", "pyramids", "waves", "subplasma", "dots", "clouds", "noise", "lines2", "colorbar", "checkerboard",
                "lines", "squares", "circles", "crosshatch", "xor"
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

            [3, "copy", 2],

            [3, "map", {
                "xamount": [2, 177],
                "yamount": [2, 177],
                "xchannel": [0, 2],
                "ychannel": [0, 2],
                "xlayer": [0, 2],
                "ylayer": [0, 2]
            }]
        ]
    });

})(SeamlessTextureGenerator);
