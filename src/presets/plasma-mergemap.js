

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
