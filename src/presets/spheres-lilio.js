

(function (tgen) {

    tgen.preset('spheres-lilio', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "spheres", {
                "blend": "lighten",
                "count": [21, 44]
            }],
            [1, "spheres", {
                "blend": "lineardodge",
                "count": [21, 44]
            }],
            [2, "merge", {
                "layer": 0
            }],
            [2, "merge", {
                "layer": 1,
                "blend": "overlay"
            }]
        ]
    });

})(SeamlessTextureGenerator);
