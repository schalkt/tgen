

(function (tgen) {

    tgen.preset('stone-and-flowers', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "subplasma", {
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "subplasma", {
                "blend": "difference",
                "size": [3, 5]
            }],
            [0, "spheres", {
                "blend": "difference",
                "dynamic": false
            }],
            [0, "brightness", {
                "adjust": 20
            }],
            [0, "contrast", {
                "adjust": 20
            }],
            [0, "vibrance", {
                "adjust": 20
            }]
        ]
    });

})(SeamlessTextureGenerator);
