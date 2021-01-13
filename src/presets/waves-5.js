

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
