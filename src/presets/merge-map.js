

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
