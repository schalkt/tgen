

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
