

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
