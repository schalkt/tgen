

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
