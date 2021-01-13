

(function (tgen) {

    tgen.preset('dots', {
        "width": 256,
        "height": 256,
        "items": [
            [0, "dots", {
                "blend": ["opacity", "lighten"],
                "shape": "sphere",
                "size": [200, 400],
                "gridX": [4, 12],
                "gridY": [4, 12],
                "xsines": [4, 12],
                "ysines": [4, 12]
            }],
            [0, "dots", {
                "blend": "random",
                "shape": "sphere",
                "size": [50, 200],
                "gridX": [4, 12],
                "gridY": [4, 12],
                "xsines": [4, 12],
                "ysines": [4, 12]
            }],
            [0, "sharpen"]
        ]
    });

})(SeamlessTextureGenerator);
