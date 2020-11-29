

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
