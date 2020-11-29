

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
