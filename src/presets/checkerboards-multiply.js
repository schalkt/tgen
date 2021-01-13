

(function (tgen) {

    tgen.preset('checkerboards-multiply', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "checkerboard", {
                "size": [
                    [16, 21],
                    [16, 21]
                ],
                "rgba": "randomalpha",
                "blend": ""
            }],
            [0, "checkerboard", {
                "size": [
                    [5, 16],
                    [5, 16]
                ],
                "rgba": "randomalpha",
                "blend": "multiply"
            }],
            [0, "checkerboard", {
                "size": [
                    [2, 4],
                    [2, 4]
                ],
                "rgba": "randomalpha",
                "blend": "multiply"
            }],
            [0, "sharpen", {
                "type": 2
            }],
            [0, "spheres", {
                "blend": "multiply",
                "dynamic": true,
                "opacity": 255
            }]
        ]
        
    });

})(SeamlessTextureGenerator);
