

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
