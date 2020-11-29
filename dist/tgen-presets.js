

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



(function (tgen) {

    tgen.preset('bubbles', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "circles", {
                "blend": "opacity",
                "rgba": [
                    [32, 255],
                    [32, 255],
                    [32, 255],
                    [32, 200]
                ],
                "count": [32, 48],
                "size": [1, 5]
            }],
            [0, "circles", {
                "blend": "opacity",
                "rgba": [
                    [32, 255],
                    [32, 255],
                    [32, 255],
                    [32, 200]
                ],
                "count": [15, 20],
                "size": [10, 15]
            }],
            [0, "circles", {
                "blend": "opacity",
                "rgba": [
                    [32, 255],
                    [32, 255],
                    [32, 255],
                    [32, 200]
                ],
                "count": [2, 3],
                "size": [20, 25]
            }],
            [0, "spheres", {
                "blend": "softlight",
                "dynamic": true
            }],
            [0, "circles", {
                "blend": "softlight",
                "opacity": 128
            }],
            [0, "noise", {
                "blend": "softlight",
                "opacity": 32
            }]
        ]
    });

})(SeamlessTextureGenerator);

(function (tgen) {

    tgen.preset('cells', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "lighten",
                "count": 21,
                "rgba": [255, 255, 255, 1]
            }],
            [0, "invert"],
            [1, "spheres", {
                "blend": "lighten",
                "count": 21,
                "rgba": [155, 155, 155, 1]
            }],
            [1, "invert"],
            [1, "merge", {
                "layer": 0,
                "blend": ["overlay", "lighten", "difference"]
            }],
            [1, "colorize"],
            [1, "brightness", {
                "adjust": -10,
                "legacy": true
            }],
            [1, "vibrance", {
                "adjust": 50
            }],
            [1, "contrast", {
                "adjust": 50
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('checkerboards-multiply', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "checkerboard", {
                "size": [
                    [16, 21],
                    [16, 21]
                ],
                "rgba": "randomalpha",
                "blend": ""
            }],
            [0, "checkerboard", {
                "size": [
                    [5, 16],
                    [5, 16]
                ],
                "rgba": "randomalpha",
                "blend": "multiply"
            }],
            [0, "checkerboard", {
                "size": [
                    [2, 4],
                    [2, 4]
                ],
                "rgba": "randomalpha",
                "blend": "multiply"
            }],
            [0, "sharpen", {
                "type": 2
            }],
            [0, "spheres", {
                "blend": "multiply",
                "dynamic": true,
                "opacity": 255
            }]
        ]
        
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('checkerboards', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "checkerboard", {
                "size": 32,
                "rgba": "randomalpha",
                "blend": ""
            }],
            [0, "checkerboard", {
                "size": 16,
                "rgba": "randomalpha",
                "blend": "opacity"
            }],
            [0, "checkerboard", {
                "size": 8,
                "rgba": "randomalpha",
                "blend": "opacity"
            }],
            [0, "checkerboard", {
                "size": 4,
                "rgba": "randomalpha",
                "blend": "opacity"
            }],
            [0, "checkerboard", {
                "size": 2,
                "rgba": "randomalpha",
                "blend": "opacity"
            }],
            [0, "sharpen", {
                "type": 2
            }],
            [0, "spheres", {
                "blend": "random",
                "dynamic": true
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('checkerboards2', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "checkerboard", {
                "size": [
                    [17, 32],
                    [17, 32]
                ],
                "rgba": "randomalpha",
                "blend": ""
            }],
            [0, "checkerboard", {
                "size": [
                    [9, 16],
                    [9, 16]
                ],
                "rgba": "randomalpha",
                "blend": "random"
            }],
            [0, "checkerboard", {
                "size": [
                    [5, 8],
                    [5, 8]
                ],
                "rgba": "randomalpha",
                "blend": "random"
            }],
            [0, "checkerboard", {
                "size": [
                    [2, 4],
                    [2, 4]
                ],
                "rgba": "randomalpha",
                "blend": "random"
            }],
            [0, "sharpen", {
                "type": 2
            }],
            [0, "spheres", {
                "blend": "random",
                "dynamic": true,
                "opacity": 255
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('circles', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "circles", {

                "count": 7,
                "origin": [50, 50],
                "size": [2, 100],
                "rgba": [
                    [1, 255],
                    [1, 255],
                    [1, 255],
                    [0.05, 0.15]
                ]
            }],
            [0, "circles", {
                "blend": ["opacity", "lighten", "darken", "softlight", "multiply", "screen", "exclusion"],
                "count": 7,
                "origin": [50, 50],
                "size": [2, 50],
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



(function (tgen) {

    tgen.preset('clouds-color', {
        "width": 512,
        "height": 512,
        "items": [
            [0, "fill"],
            [0, "clouds", {
                "blend": "difference"
            }],
            [0, "clouds", {
                "blend": "difference"
            }],
            [0, "clouds", {
                "blend": ["exclusion", "lighten", "darken", "overlay", "screen", "linearlight", "lineardodge"]
            }],
            [0, "spheres", {
                "blend": "softlight",
                "rgba": "random",
                "count": [7, 21],
                "size": [20, 70],
                "dynamic": true
            }],
            [0, "vibrance", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }]

        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('clouds-colormap', {
        "width": 512,
        "height": 512,
        "items": [
            [0, "fill"],
                [0, "clouds", {
                    "blend": "difference"
                }],
                [1, "copy", 0],
                [1, "clouds", {
                    "blend": "difference"
                }],
                [2, "copy", 1],
                [2, "clouds", {
                    "blend": ["exclusion", "lighten", "darken", "overlay", "screen", "linearlight", "lineardodge"]
                }],
                [3, "copy", 2],
                [3, "spheres", {
                    "blend": "softlight",
                    "rgba": "random",
                    "count": [7, 21],
                    "size": [20, 70],
                    "dynamic": true
                }],
                [3, "map", {
                    "xamount": [14, 121],
                    "yamount": [14, 121],
                    "xchannel": [0, 3],
                    "ychannel": [0, 3],
                    "xlayer": [0, 3],
                    "ylayer": [0, 3]
                }],
                [3, "vibrance", {
                    "adjust": 20
                }],
                [3, "contrast", {
                    "adjust": 20
                }]

        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('clouds-emboss', {
        "width": 512,
        "height": 512,
        "items": [
            [0, "clouds"],
            [0, "clouds", {
                "blend": "difference"
            }],
            [0, "emboss"]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('clouds', {
        "width": 512,
        "height": 512,
        "items": [

            [0, "fill", {
                "rgba": [0, [50, 150],
                    [200, 255], 1
                ]
            }],
            [0, "clouds", {
                "blend": "screen",
                "rgba": [255, 255, 255, 1],
                "roughness": [2, 5]
            }],
            [0, "clouds", {
                "blend": "overlay",
                "rgba": [
                    [0, 20],
                    [0, 150],
                    [200, 255], 1
                ],
                "roughness": [2, 4]
            }]

        ]
    });

})(SeamlessTextureGenerator);

(function (tgen) {

    tgen.preset('craters', {
        "width": 256,        
        "height": 256,
        "items": [
            [0, "fill", {
                "rgba": [
                    [144, 255],
                    [144, 255],
                    [144, 255],
                    [0.8, 1]
                ]
            }],
            [0, "spheres", {
                "blend": ["overlay", "linearlight", "multiply", "difference", "softlight", "darken", "opacity", "lineardodge"],
                "dynamic": true
            }],
            [0, "spheres", {
                "blend": ["overlay", "linearlight", "multiply", "difference", "softlight", "darken", "opacity", "lineardodge"],
                "dynamic": true
            }],
            [0, "map", {
                "xamount": [1, 77],
                "yamount": [1, 77],
                "xchannel": [0, 3],
                "ychannel": [0, 3],
                "xlayer": 0,
                "ylayer": 0
            }],
            [0, "brightness", {
                "adjust": 10
            }],
            [0, "contrast", {
                "adjust": 20
            }]


        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('crosshatch', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "crosshatch"],
            [0, "waves", {
                "blend": "random"
            }],
            [0, "brightness", {
                "adjust": 20,
                "legacy": true
            }],
            [0, "contrast", {
                "adjust": 10
            }],
            [0, "vibrance", {
                "adjust": 100
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('dots', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "dots", {
                "blend": ["opacity", "lighten"],
                "shape": "sphere",
                "size": [200, 400],
                "gridX": [4, 12],
                "gridY": [4, 12],
                "xsines": [4, 12],
                "ysines": [4, 12]
            }],
            [0, "dots", {
                "blend": "random",
                "shape": "sphere",
                "size": [50, 200],
                "gridX": [4, 12],
                "gridY": [4, 12],
                "xsines": [4, 12],
                "ysines": [4, 12]
            }],
            [0, "sharpen"]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('dunes-blue', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "pyramids", {
                "blend": "lighten",
                "rgba": [
                    [0, 10],
                    [20, 80],
                    [150, 255],
                    [0.7, 1]
                ]
            }],
            [0, "pyramids", {
                "blend": "lineardodge",
                "dynamic": true,
                "rgba": [170, 170, 170, [0.7, 1]]
            }],
            [0, "waves", {
                "blend": "softlight"
            }],
            [0, "waves", {
                "blend": "softlight"
            }],
            [0, "map", {
                "xamount": [10, 144],
                "yamount": [10, 144],
                "xchannel": [0, 3],
                "ychannel": [0, 3],
                "xlayer": 0,
                "ylayer": 0
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 30
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('dunes-magic', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "lighten"
            }],
            [0, "spheres", {
                "blend": ["softlight", "lighten", "lineardodge"],
                "dynamic": true
            }],
            [0, "waves", {
                "blend": "softlight"
            }],
            [0, "waves", {
                "blend": "softlight"
            }],
            [0, "map", {
                "xamount": [1, 144],
                "yamount": [1, 144],
                "xchannel": [0, 3],
                "ychannel": [0, 3],
                "xlayer": 0,
                "ylayer": 0
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('fire', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "subplasma", {
                "size": [2, 4]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [1, 4]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [1, 4]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [1, 4]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [1, 4]
            }],
            [0, "spheres", {
                "blend": ["difference"],
                "size": [25, 77],
                "count": 10,
                "dynamic": true
            }],
            [0, "colorize", {
                "colormap": "!fire"
            }],
            [0, "contrast", {
                "value": 42
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('gradients', {
        "width": 512,
        "height": 512,
        "items": [
            [0, "colorbar", {
                "mirror": true,
                "colormap": ["fire", "ice", "dusk", "seashore", "random"]
            }],
            [1, "colorbar", {
                "mirror": true,
                "type": "vertical",
                "colormap": [{
                    "percent": 0,
                    "rgba": [
                        [0, 255],
                        [0, 255],
                        [0, 255], 1
                    ]
                }, {
                    "percent": 50,
                    "rgba": [
                        [0, 255],
                        [0, 255],
                        [0, 255], 1
                    ]
                }, {
                    "percent": 100,
                    "rgba": [
                        [0, 255],
                        [0, 255],
                        [0, 255], 1
                    ]
                }]
            }],
            [2, "copy"],
            [2, "merge", {
                "layer": 0,
                "blend": ["multiply", "lighten", "exclusion", "screen", "lineardodge"]
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('lines', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "lines", {

                "size": [110, 210],
                "count": [100, 440],
                "freq1s": [21, 150],
                "freq1c": [21, 150],
                "freq2s": [21, 150],
                "freq2c": [21, 150],
                "rgba": [
                    [1, 255],
                    [1, 255],
                    [1, 255],
                    [0.3, 0.5]
                ]
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('lines2', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "lines2"],
            [0, "lines2"],
            [0, "lines2"]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('map2', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves", {
                "blend": "",
                "channels": [1, 1, 1, 1]
            }],
            [1, "spheres", {
                "blend": ["lineardodge", "lighten"]
            }],
            [2, "copy", 1],
            [2, "map", {
                "xamount": [2, 255],
                "yamount": [2, 255],
                "xchannel": [0, 3],
                "ychannel": [0, 3],
                "xlayer": [0, 1],
                "ylayer": [0, 1]
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('merge-map', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "pyramids", {
                "blend": "difference",
                "count": [14, 44]
            }],
            [0, "pyramids", {
                "blend": "lineardodge",
                "count": [7, 14]
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }],
            [1, "spheres", {
                "dynamic": true,
                "blend": "lineardodge",
                "count": [14, 21]
            }],
            [2, "copy", 0],
            [2, "merge", {
                "layer": 1,
                "blend": "lineardodge"
            }],
            [2, "map", {
                "xamount": [44, 77],
                "yamount": [77, 121],
                "xchannel": [0, 3],
                "ychannel": [0, 3],
                "xlayer": 1,
                "ylayer": 1
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('mergetest', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves", {
                "blend": ""
            }],
            [1, "pyramids", {
                "blend": ["lighten", "difference", "screen"],
                "dynamic": true
            }],
            [2, "spheres", {
                "blend": ["lighten", "difference", "screen"]
            }],
            [3, "merge", {
                "layer": 0
            }],
            [3, "merge", {
                "layer": 1,
                "blend": "overlay"
            }],
            [4, "copy", 3],
            [4, "merge", {
                "layer": 2,
                "blend": "difference"
            }],
            [4, "brightness", {
                "adjust": 10,
                "legacy": true
            }],
            [4, "vibrance", {
                "adjust": 10
            }],
            [4, "contrast", {
                "adjust": 20
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('plasma-diffs', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "subplasma", {
                "size": [1, 4]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [1, 4]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [1, 4]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [1, 4]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [1, 4]
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('plasma-mergemap', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "subplasma", {
                "size": [2, 4]
            }],
            [0, "subplasma", {
                "blend": "darken",
                "size": [2, 4]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [2, 4]
            }],
            [0, "subplasma", {
                "blend": "linearlight",
                "size": [2, 4]
            }],
            [0, "map", {
                "xamount": [21, 77],
                "yamount": [21, 77],
                "xchannel": [0, 3],
                "ychannel": [0, 3],
                "xlayer": 0,
                "ylayer": 0
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('plasma-shadows', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "subplasma", {
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "spheres", {
                "blend": "multiply",
                "dynamic": true
            }],
            [0, "brightness", {
                "adjust": 40
            }],
            [0, "contrast", {
                "adjust": 40
            }],
            [0, "vibrance", {
                "adjust": 20
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('pyramids-map', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "pyramids", {
                "blend": "difference",
                "count": [7, 21]
            }],
            [0, "pyramids", {
                "blend": "lineardodge",
                "count": [4, 7]
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }],
            [1, "copy", 0],
            [1, "map", {
                "xamount": [44, 77],
                "yamount": [77, 121],
                "xchannel": [0, 3],
                "ychannel": [0, 3],
                "xlayer": [0, 1],
                "ylayer": [0, 1]
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('pyramids', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "pyramids", {
                "blend": ["difference", "lighten"]
            }],
            [1, "pyramids", {
                "blend": ["difference", "lighten"]
            }],
            [2, "copy", 0],
            [2, "merge", {
                "layer": 1,
                "blend": ["exclusion", "difference", "lighten", "lineardodge", "screen", "darken"]
            }],
            [2, "brightness", {
                "adjust": 80
            }],
            [2, "contrast", {
                "adjust": 140
            }],
            [2, "vibrance", {
                "adjust": 70
            }]
        ]
    });

})(SeamlessTextureGenerator);



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



(function (tgen) {

    tgen.preset('sci-fi-wall', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves", {}],
            [0, "dots", {
                "blend": ["lighten", "opacity", "multiply"],
                "shape": "rect",
                "size": [20, 250],
                "gridX": [2, 12],
                "gridY": [2, 12],
                "xsines": [2, 12],
                "ysines": [2, 12]
            }],
            [0, "dots", {
                "blend": ["lighten", "opacity", "multiply"],
                "shape": "rect",
                "size": [20, 250],
                "gridX": [2, 12],
                "gridY": [2, 12],
                "xsines": [2, 12],
                "ysines": [2, 12]
            }],
            [0, "sharpen", {
                "type": 1
            }],
            [0, "spheres", {
                "blend": ["multiply", "darken"],
                "dynamic": true,
                "opacity": 255
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('sci-fi-wall2', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves", {}],
            [0, "dots", {
                "blend": ["lighten", "opacity", "multiply"],
                "shape": "rect",
                "size": [10, 280],
                "gridX": [2, 14],
                "gridY": [2, 14],
                "xsines": [2, 14],
                "ysines": [2, 14]
            }],
            [0, "dots", {
                "blend": ["lighten", "opacity", "multiply"],
                "shape": "rect",
                "size": [10, 280],
                "gridX": [2, 14],
                "gridY": [2, 14],
                "xsines": [2, 14],
                "ysines": [2, 14]
            }],
            [0, "pyramids", {
                "blend": ["softlight", "overlay"],
                "dynamic": false,
                "count": 10
            }],
            [0, "sharpen", {
                "type": 1
            }],
            [0, "spheres", {
                "blend": ["multiply", "darken"],
                "dynamic": true,
                "opacity": 255
            }]
        ]
    });

})(SeamlessTextureGenerator);


(function (tgen) {

    tgen.preset('sines-blue', {
        "width": 512,
        "height": 512,
        "items": [
            [0, "subplasma", {
                "size": [1, 5],
                "rgba": [
                    [0, 255],
                    [0, 255],
                    [77, 255], 1
                ]
            }],
            [0, "sinecolor", {
                "channel": [0, 2]
            }],
            [0, "subplasma", {
                "blend": "random",
                "size": [1, 5],
                "rgba": "randomalpha"
            }],
            [0, "sinecolor", {
                "channel": [0, 2]
            }],
            [0, "subplasma", {
                "blend": "random",
                "size": [1, 5],
                "rgba": "randomalpha"
            }],
            [0, "sinecolor", {
                "channel": [0, 2]
            }],
            [0, "colorize", {
                "colormap": "ice"
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }],
            [0, "vibrance", {
                "adjust": 20
            }]

        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('sines-chrome', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "subplasma", {
                "size": 3,
                "rgba": [
                    [0, 255],
                    [0, 255],
                    [77, 255], 1
                ]
            }],
            [0, "sinecolor", {
                "channel": 2
            }],
            [0, "subplasma", {
                "blend": ["difference", "darken", "lighten"],
                "size": 3,
                "rgba": [
                    [0, 255],
                    [77, 255],
                    [0, 255], 1
                ]
            }],
            [0, "sinecolor", {
                "channel": 1
            }],
            [0, "subplasma", {
                "blend": ["difference", "darken", "lighten"],
                "size": 3,
                "rgba": [
                    [77, 255],
                    [0, 255],
                    [0, 255], 1
                ]
            }],
            [0, "sinecolor", {
                "channel": 0
            }],
            [0, "grayscale"],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }],
            [0, "vibrance", {
                "adjust": 20
            }]

        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('sines-color', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "subplasma", {
                "size": 3,
                "rgba": [
                    [0, 255],
                    [0, 255],
                    [77, 255], 1
                ]
            }],
            [0, "sinecolor", {
                "channel": 2
            }],
            [0, "subplasma", {
                "blend": ["difference", "darken", "lighten"],
                "size": 3,
                "rgba": [
                    [0, 255],
                    [77, 255],
                    [0, 255], 1
                ]
            }],
            [0, "sinecolor", {
                "channel": 1
            }],
            [0, "subplasma", {
                "blend": ["difference", "darken", "lighten"],
                "size": 3,
                "rgba": [
                    [77, 255],
                    [0, 255],
                    [0, 255], 1
                ]
            }],
            [0, "sinecolor", {
                "channel": 0
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }],
            [0, "vibrance", {
                "adjust": 20
            }]

        ]
    });

})(SeamlessTextureGenerator);


(function (tgen) {

    tgen.preset('sines-plasma', {
        "width": 512,
        "height": 512,
        "items": [
            [0, "subplasma", {
                "size": [1, 5],
                "rgba": [
                    [32, 255],
                    [32, 255],
                    [32, 255], 1
                ]
            }],
            [0, "sinecolor", {
                "blend": "random",
                "channel": [0, 2]
            }],
            [0, "subplasma", {
                "blend": "random",
                "size": [1, 5],
                "rgba": "randomalpha"
            }],
            [0, "sinecolor", {
                "blend": "random",
                "channel": [0, 2]
            }],
            [0, "subplasma", {
                "blend": "random",
                "size": [1, 5],
                "rgba": "randomalpha"
            }],
            [0, "sinecolor", {
                "blend": "random",
                "channel": [0, 2]
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }],
            [0, "vibrance", {
                "adjust": 20
            }]

        ]
    });

})(SeamlessTextureGenerator);



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



(function (tgen) {

    tgen.preset('spaceship-hull', {
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
            [0, "grayscale"],
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



(function (tgen) {

    tgen.preset('spheres-blend', {
        "width": 512,
        "height": 512,
        "items": [
            [0, "fill", {
                "blend": "opacity",
                "rgba": "random"
            }],
            [0, "spheres", {
                "blend": "random",
                "origin": "random",
                "dynamic": true,
                "count": 21,
                "size": [10, 60]
            }],
            [0, "spheres", {
                "blend": "random",
                "origin": "random",
                "dynamic": true,
                "count": 21,
                "size": [10, 60]
            }],
            [0, "spheres", {
                "blend": "random",
                "origin": "random",
                "dynamic": true,
                "count": 44,
                "size": [10, 44]
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('spheres-diffdodge', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "difference",
                "count": [7, 21]
            }],
            [0, "spheres", {
                "blend": "lineardodge",
                "count": [4, 7]
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('spheres-invert', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "difference",
                "count": [21, 32]
            }],
            [0, "invert"],
            [1, "spheres", {
                "blend": "difference",
                "count": [21, 48]
            }],
            [1, "invert"],
            [2, "merge", {
                "layer": 0
            }],
            [2, "merge", {
                "layer": 1,
                "blend": "difference"
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('spheres-lilio', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "lighten",
                "count": [21, 44]
            }],
            [1, "spheres", {
                "blend": "lineardodge",
                "count": [21, 44]
            }],
            [2, "merge", {
                "layer": 0
            }],
            [2, "merge", {
                "layer": 1,
                "blend": "overlay"
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('spheres-map', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "difference",
                "count": [7, 21]
            }],
            [0, "spheres", {
                "blend": "lineardodge",
                "count": [4, 7]
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }],
            [1, "copy", 0],
            [1, "map", {
                "xamount": [44, 77],
                "yamount": [77, 121],
                "xchannel": [0, 3],
                "ychannel": [0, 3],
                "xlayer": [0, 1],
                "ylayer": [0, 1]
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('spheres-map2', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "lighten",
                "count": 21
            }],
            [1, "spheres", {
                "blend": "lighten",
                "count": 21
            }],
            [1, "merge", {
                "layer": 0,
                "blend": ["overlay",
                    "lighten", "difference"
                ]
            }],
            [1, "map", {
                "xamount": [21, 177],
                "yamount": [21, 177],
                "xchannel": [0, 3],
                "ychannel": [0, 3],
                "xlayer": [0, 1],
                "ylayer": [0, 1]
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('spheres-worm', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": ["lighten", "lineardodge"],
                "count": [14, 21]
            }],
            [1, "spheres", {
                "blend": ["lighten", "lineardodge"],
                "count": [14, 21]
            }],
            [2, "merge", {
                "layer": 0
            }],
            [2, "merge", {
                "layer": 1,
                "blend": "darken"
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('spheres', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "lighten",
                "count": [7, 21]
            }],
            [1, "spheres", {
                "blend": "lighten",
                "count": [4, 7]
            }],
            [1, "merge", {
                "layer": 0,
                "blend": "lighten"
            }],
            [1, "brightness", {
                "adjust": 20
            }],
            [1, "contrast", {
                "adjust": 20
            }]
        ]
    });

})(SeamlessTextureGenerator);



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



(function (tgen) {

    tgen.preset('starfield', {
        "width": 512,
        "height": 512,
        "items": [
            [0, "fill", {
                "rgba": [
                    [30, 60],
                    [30, 60],
                    [30, 60], 1
                ]
            }],
            [0, "clouds", {
                "blend": "softlight",
                "rgba": [232, 126, 226, 1],
                "roughness": [2, 4]
            }],
            [0, "clouds", {
                "blend": "overlay",
                "rgba": [44, 108, 208, 1],
                "roughness": [2, 4]
            }],
            [0, "pyramids", {
                "blend": "screen",
                "rgba": [255, 255, 255, 0.5],
                "count": 170,
                "size": 0.5
            }],
            [0, "pyramids", {
                "blend": "screen",
                "rgba": [255, 255, 255, 1],
                "count": 170,
                "size": 1
            }],
            [0, "pyramids", {
                "blend": "lineardodge",
                "rgba": [255, 255, 255, 1],
                "count": 7,
                "size": [1, 3]
            }],
            [0, "brightness", {
                "adjust": 10,
                "legacy": true
            }],
            [0, "vibrance", {
                "adjust": 50
            }],
            [0, "contrast", {
                "adjust": 50
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('stone-and-flowers', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "subplasma", {
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "spheres", {
                "blend": "difference",
                "dynamic": false
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }],
            [0, "vibrance", {
                "adjust": 20
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('waves-3', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves"],
            [0, "waves", {
                "blend": "difference",
                "xsines": [1, 3],
                "ysines": [1, 4]
            }],
            [0, "waves", {
                "blend": "linearburn",
                "xsines": [1, 3],
                "ysines": [1, 4]
            }],
            [0, "brightness", {
                "adjust": 80,
                "legacy": true
            }],
            [0, "vibrance", {
                "adjust": 20
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('waves-4', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves"],
            [0, "waves", {
                "blend": "softlight"
            }],
            [0, "waves", {
                "blend": "difference"
            }],
            [0, "waves", {
                "blend": "linearburn"
            }],
            [0, "brightness", {
                "adjust": 40,
                "legacy": true
            }],
            [0, "vibrance", {
                "adjust": 10
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('waves-5-map', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves"],
            [0, "waves", {
                "blend": "difference"
            }],
            [0, "waves", {
                "blend": "linearburn"
            }],
            [0, "waves", {
                "blend": "difference"
            }],
            [0, "waves", {
                "blend": "linearburn"
            }],
            [0, "subplasma", {
                "blend": ["multiply", "difference"]
            }],
            [0, "brightness", {
                "adjust": 10,
                "legacy": true
            }],
            [0, "vibrance", {
                "adjust": 10
            }],
            [0, "map"]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('waves-5', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves"],
            [0, "waves", {
                "blend": "difference"
            }],
            [0, "waves", {
                "blend": "linearburn"
            }],
            [0, "waves", {
                "blend": "difference"
            }],
            [0, "waves", {
                "blend": "linearburn"
            }],
            [0, "brightness", {
                "adjust": 10,
                "legacy": true
            }],
            [0, "vibrance", {
                "adjust": 10
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('waves-cool', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "lighten",
                "origin": "random",
                "dynamic": false,
                "count": 21,
                "size": [20, 70]
            }],
            [0, "spheres", {
                "blend": "lineardodge",
                "origin": "random",
                "dynamic": true,
                "count": 21,
                "size": [20, 70]
            }],
            [0, "waves", {
                "blend": "softlight",
                "level": 50,
                "xsines": 20,
                "ysines": 1
            }],
            [0, "waves", {
                "blend": "softlight",
                "level": 50,
                "xsines": 20,
                "ysines": 1
            }],
            [0, "map", {
                "xamount": [21, 121],
                "yamount": [21, 121],
                "xchannel": 0,
                "ychannel": 2,
                "xlayer": 0,
                "ylayer": 0
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('xor-sharpen', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "xor", {
                "zoom": [1, 4]
            }],
            [1, "xor", {
                "zoom": [1, 7]
            }],
            [2, "xor", {
                "zoom": [1, 14]
            }],
            [3, "copy", 0],
            [3, "merge", {
                "layer": 1,
                "blend": "random"
            }],
            [3, "merge", {
                "layer": 2,
                "blend": "random"
            }],
            [3, "sharpen"],
            [3, "brightness", {
                "adjust": 10,
                "legacy": true
            }],
            [3, "vibrance", {
                "adjust": 50
            }],
            [3, "contrast", {
                "adjust": 50
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('xor', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "xor", {
                "zoom": [1, 14]
            }],
            [1, "xor", {
                "zoom": [1, 21]
            }],
            [2, "xor", {
                "zoom": [1, 42]
            }],

            [3, "copy", 0],
            [3, "merge", {
                "layer": 1,
                "blend": "random"
            }],
            [3, "merge", {
                "layer": 2,
                "blend": "random"
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('z-dev', {
        "width": 256,
        "height": 256,
        "normalize": "pingpong",
        "items": [
            [0, "waves"],
            [0, "waves", {
                "blend": "difference",
                "xsines": [1, 3],
                "ysines": [1, 4]
            }],
            [0, "waves", {
                "blend": "linearburn",
                "xsines": [1, 3],
                "ysines": [1, 4]
            }],
            [0, "brightness", {
                "adjust": 80,
                "legacy": true
            }],
            [0, "vibrance", {
                "adjust": 20
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('z-error-blend', {
        "width": 512,
        "height": 512,
        "items": [
            [0, "clouds", {
                "colormap": "redblue",
                "seed": 32,
                "roughness": 4
            }],
            [1, "clouds", {
                "colormap": "seashore",
                "seed": 211,
                "roughness": 4
            }],
            [2, "copy"],
            [2, "merge", {
                "layer": 0,
                "blend": "multiply"
            }],
            [3, "copy", {
                "layer": 0
            }],
            [3, "clouds", {
                "colormap": "seashore",
                "blend": "multiply",
                "seed": 211,
                "roughness": 4
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('z-error-blend2', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "dots", {
                "blend": ["difference-invert", "lineardodge-invert", "backlight"],
                "rgba": [
                    [0, 255],
                    [0, 255], 120, 0.9
                ],
                "shape": "rect",
                "size": [100, 280],
                "gridX": [2, 7],
                "gridY": [2, 7],
                "xsines": [2, 7],
                "ysines": [2, 7]
            }]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('z-error-blend3', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "checkerboard", {
                "blend": "screen",
                "rgba": [
                    57,
                    88,
                    37,
                    173
                ],
                "even": false,
                "size": [
                    20,
                    22
                ],
                "dynamic": true,
                "seed": 11510151
            }
            ]
        ]
    });

})(SeamlessTextureGenerator);



(function (tgen) {

    tgen.preset('z-test-pattern', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "test-pattern"]
        ]
    });

})(SeamlessTextureGenerator);
