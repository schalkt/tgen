

(function (tgen) {

    tgen.preset('sci-fi-wall2', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "waves", {}],
            [0, "dots", {
                "blend": ["lighten", "opacity", "multiply"],
                "shape": "rect",
                "size": [10, 280],
                "gridX": [2, 14],
                "gridY": [2, 14],
                "xsines": [2, 14],
                "ysines": [2, 14]
            }],
            [0, "dots", {
                "blend": ["lighten", "opacity", "multiply"],
                "shape": "rect",
                "size": [10, 280],
                "gridX": [2, 14],
                "gridY": [2, 14],
                "xsines": [2, 14],
                "ysines": [2, 14]
            }],
            [0, "pyramids", {
                "blend": ["softlight", "overlay"],
                "dynamic": false,
                "count": 10
            }],
            [0, "sharpen", {
                "type": 1
            }],
            [0, "spheres", {
                "blend": ["multiply", "darken"],
                "dynamic": true,
                "opacity": 255
            }]
        ]
    });

})(SeamlessTextureGenerator);
