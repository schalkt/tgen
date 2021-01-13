

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
