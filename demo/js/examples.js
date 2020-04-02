$(document).ready(function() {

    // disable localStorage history
    tgen.config.historyLast = 0;

    // initialize the generator
    var generator = tgen.init(128, 128);

    var presets = [
        { "normalize": "limitless", "items": [
                [0, "spheres", { "blend": "lighten", "rgba": [184, 83, 188, 255], "origin": "random", "dynamic": false, "count": 22, "size": [4, 77], "seed": 122611 }],
                [1, "spheres", { "blend": "lighten", "rgba": [120, 65, 111, 255], "origin": "random", "dynamic": false, "count": 9, "size": [4, 77], "seed": 33901 }],
                [2, "copy", { "layer": 0 }],
                [2, "merge", { "blend": "backlight", "layer": 1, "opacity": null, "seed": 185155 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "waves", { "blend": "", "rgba": [52, 121, 105, 255], "level": 50, "xsines": 4, "ysines": 5, "channels": [1, 1, 1, 1] }],
                [1, "spheres", { "blend": "lighten", "rgba": [216, 192, 170, 255], "origin": "random", "dynamic": false, "count": 21, "size": [20, 70], "seed": 106992 }],
                [2, "copy", { "layer": 1 }],
                [2, "map", { "xamount": 252, "yamount": 59, "xchannel": 3, "ychannel": 0, "xlayer": 1, "ylayer": 0 }],
                [2, "colorize", { "level": 50, "rgba": [51, 93, 208, 255], "colormap": "!seashore" }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "spheres", { "blend": "lighten", "rgba": [152, 186, 161, 255], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 195265 }],
                [0, "spheres", { "blend": "lighten", "rgba": [199, 212, 230, 255], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 82152 }],
                [0, "invert", { "channels": [1, 1, 1], "adjust": 10, "seed": 86266 }],
                [0, "brightness", { "adjust": 10, "legacy": true, "seed": 218457 }],
                [0, "contrast", { "adjust": 20, "seed": 142360 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "subplasma", { "seed": 224572, "size": 3, "rgba": [196, 20, 86, 255] }],
                [0, "sinecolor", { "sines": 2, "channel": 2 }],
                [0, "subplasma", { "seed": 139770, "size": 3, "rgba": [112, 206, 218, 255], "blend": "difference" }],
                [0, "sinecolor", { "sines": 7, "channel": 1 }],
                [0, "subplasma", { "seed": 169867, "size": 3, "rgba": [120, 162, 25, 255], "blend": "darken" }],
                [0, "sinecolor", { "sines": 4, "channel": 0 }],
                [0, "grayscale", { "method": "average" }],
                [0, "brightness", { "adjust": 20, "legacy": true }],
                [0, "contrast", { "adjust": 20 }],
                [0, "vibrance", { "adjust": 20 }]
            ] },

        { "normalize": "limitless", "items": [
                [0, "subplasma", { "seed": 256737, "size": 2, "rgba": [247, 30, 81, 255] }],
                [0, "subplasma", { "seed": 71020, "size": 4, "rgba": [58, 61, 111, 255], "blend": "difference" }],
                [0, "subplasma", { "seed": 100971, "size": 1, "rgba": [151, 66, 53, 255], "blend": "difference" }],
                [0, "subplasma", { "seed": 211047, "size": 3, "rgba": [208, 35, 131, 255], "blend": "difference" }],
                [0, "subplasma", { "seed": 4268, "size": 2, "rgba": [160, 122, 175, 255], "blend": "difference" }],
                [0, "spheres", { "blend": "difference", "rgba": [91, 19, 65, 255], "origin": "random", "dynamic": true, "count": 10, "size": [25, 77], "seed": 217646 }],
                [0, "colorize", { "level": 50, "rgba": [44, 250, 98, 255], "colormap": "!fire" }],
                [0, "contrast", { "adjust": 50, "value": 42 }],
                [0, "sharpen", { "type": 1 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "spheres", { "blend": "lighten", "rgba": [224, 215, 58, 255], "origin": "random", "dynamic": false, "count": 21, "size": [20, 70], "seed": 101370 }],
                [0, "spheres", { "blend": "lineardodge", "rgba": [197, 110, 142, 255], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 2520 }],
                [0, "waves", { "blend": "softlight", "rgba": [16, 20, 101, 255], "level": 50, "xsines": 20, "ysines": 1 }],
                [0, "waves", { "blend": "softlight", "rgba": [231, 32, 153, 255], "level": 50, "xsines": 20, "ysines": 1 }],
                [0, "map", { "xamount": 117, "yamount": 60, "xchannel": 0, "ychannel": 2, "xlayer": 0, "ylayer": 0 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "subplasma", { "seed": 220402, "size": 3, "rgba": [190, 245, 158, 255] }],
                [0, "subplasma", { "seed": 229704, "size": 3, "rgba": [147, 147, 120, 255], "blend": "difference" }],
                [0, "subplasma", { "seed": 155950, "size": 3, "rgba": [141, 131, 36, 255], "blend": "difference" }],
                [0, "subplasma", { "seed": 117571, "size": 5, "rgba": [199, 114, 195, 255], "blend": "difference" }],
                [0, "subplasma", { "seed": 17974, "size": 4, "rgba": [241, 30, 223, 255], "blend": "difference" }],
                [0, "spheres", { "blend": "difference", "rgba": [215, 174, 251, 255], "origin": "random", "dynamic": false, "count": 21, "size": [20, 70], "seed": 125842 }],
                [0, "brightness", { "adjust": 20, "legacy": true }],
                [0, "contrast", { "adjust": 20 }],
                [0, "vibrance", { "adjust": 20 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "checkerboard", { "size": 32, "rgba": [19, 221, 6, 201], "blend": "" }],
                [0, "checkerboard", { "size": 16, "rgba": [47, 255, 137, 152], "blend": "opacity" }],
                [0, "checkerboard", { "size": 8, "rgba": [12, 21, 33, 235], "blend": "opacity" }],
                [0, "checkerboard", { "size": 4, "rgba": [77, 83, 118, 183], "blend": "opacity" }],
                [0, "checkerboard", { "size": 2, "rgba": [90, 65, 186, 138], "blend": "opacity" }],
                [0, "sharpen", { "type": 2 }],
                [0, "spheres", { "blend": "exclusion", "rgba": [87, 120, 242, 255], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 79003, "opacity": 255 }]
            ] },

        { "normalize": "limitless", "items": [
                [4, "spheres", { "blend": "lighten", "rgba": [237, 190, 61, 128], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 256410 }],
                [0, "copy", { "layer": 4 }],
                [4, "waves", { "blend": "linearlight", "rgba": [255, 145, 23, 383], "level": 50, "xsines": 9, "ysines": 4, "dynamic": true }],
                [1, "copy", { "layer": 4 }],
                [4, "spheres", { "blend": "multiply", "rgba": [193, 162, 159, 128], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 24224 }],
                [2, "copy", { "layer": 4 }],
                [4, "waves", { "blend": "softlight", "rgba": [21, 246, 165, 383], "level": 50, "xsines": 6, "ysines": 9, "dynamic": true }],
                [3, "copy", { "layer": 4 }],
                [4, "map", { "xamount": 94, "yamount": 48, "xchannel": 3, "ychannel": 2, "xlayer": 4, "ylayer": 4 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "dots", { "blend": "lighten", "gridX": 12, "gridY": 4, "size": [200, 400], "seed": 172943, "rgba": [98, 134, 138, 210], "shape": "sphere", "dynamic": true, "xsines": 7, "ysines": 8 }],
                [0, "dots", { "blend": "opacity", "gridX": 9, "gridY": 11, "size": [50, 200], "seed": 44921, "rgba": [203, 48, 46, 140], "shape": "sphere", "dynamic": true, "xsines": 10, "ysines": 5 }],
                [0, "sharpen", { "type": 1 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "fill", { "blend": "", "rgba": [0, 121, 223, 255] }],
                [0, "clouds", { "blend": "screen", "rgba": [255, 255, 255, 255], "seed": 113391, "roughness": 2, "colormap": null }],
                [0, "clouds", { "blend": "overlay", "rgba": [0, 147, 210, 255], "seed": 110549, "roughness": 4, "colormap": null }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "fill", { "blend": "", "rgba": [137, 49, 187, 226], "seed": 236451 }],
                [0, "clouds", { "blend": "difference", "rgba": [181, 117, 145, 255], "seed": 57197, "roughness": 4, "colormap": null }],
                [0, "clouds", { "blend": "difference", "rgba": [51, 104, 149, 255], "seed": 24250, "roughness": 16, "colormap": null }],
                [0, "clouds", { "blend": "linearlight", "rgba": [249, 174, 210, 255], "seed": 193985, "roughness": 3, "colormap": null }],
                [0, "spheres", { "blend": "softlight", "rgba": [191, 225, 136, 255], "origin": "random", "dynamic": true, "count": 14, "size": [20, 70], "seed": 3790 }],
                [0, "vibrance", { "adjust": 20, "seed": 78507 }],
                [0, "contrast", { "adjust": 20, "seed": 90727 }]
            ] },

        { "normalize": "limitless", "items": [
                [0, "checkerboard", { "size": [19, 19], "rgba": [186, 157, 177, 197], "blend": "", "seed": 57791 }],
                [0, "checkerboard", { "size": [15, 14], "rgba": [170, 88, 159, 229], "blend": "multiply", "seed": 94047 }],
                [0, "checkerboard", { "size": [4, 3], "rgba": [200, 152, 128, 156], "blend": "multiply", "seed": 12729 }],
                [0, "sharpen", { "type": 2, "seed": 188038 }],
                [0, "spheres", { "blend": "multiply", "rgba": [172, 7, 85, 255], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 200355, "opacity": 255 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "subplasma", { "seed": 17280, "size": 3, "rgba": [190, 203, 53, 255] }],
                [0, "subplasma", { "seed": 69250, "size": 3, "rgba": [107, 226, 245, 255], "blend": "darken" }],
                [0, "subplasma", { "seed": 228369, "size": 3, "rgba": [52, 193, 65, 255], "blend": "difference" }],
                [0, "subplasma", { "seed": 209667, "size": 4, "rgba": [12, 144, 247, 255], "blend": "linearlight" }],
                [0, "map", { "xamount": 38, "yamount": 52, "xchannel": 0, "ychannel": 1, "xlayer": 0, "ylayer": 0 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "circles", { "blend": "opacity", "rgba": [167, 232, 224, 111], "origin": "random", "count": 45, "size": [1, 5], "seed": 211385 }],
                [0, "circles", { "blend": "opacity", "rgba": [130, 122, 165, 139], "origin": "random", "count": 17, "size": [10, 15], "seed": 128522 }],
                [0, "circles", { "blend": "opacity", "rgba": [156, 33, 124, 151], "origin": "random", "count": 3, "size": [20, 25], "seed": 170341 }],
                [0, "spheres", { "blend": "softlight", "rgba": [243, 170, 160, 255], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 84501 }],
                [0, "circles", { "blend": "softlight", "rgba": [206, 37, 222, 255], "origin": "random", "count": 21, "size": [1, 15], "seed": 184653, "opacity": 128 }],
                [0, "noise", { "blend": "softlight", "mode": "monochrome", "channels": [255, 255, 255], "opacity": 32, "seed": 227018 }]
            ] },
        { "normalize": "limitless", "items": [
                [4, "clouds", { "blend": "lighten", "rgba": [18, 181, 228, 319], "seed": 22873, "roughness": 13, "colormap": null, "dynamic": true }],
                [0, "copy", { "layer": 4 }],
                [4, "dots", { "blend": "overlay", "gridX": 49, "gridY": 10, "size": [1, 250], "seed": 118601, "rgba": [77, 185, 174, 64], "shape": "sphere", "dynamic": true, "xsines": 6, "ysines": 1 }],
                [1, "copy", { "layer": 4 }],
                [4, "dots", { "blend": "linearburn", "gridX": 47, "gridY": 61, "size": [1, 250], "seed": 165674, "rgba": [128, 251, 30, 319], "shape": "sphere", "dynamic": true, "xsines": 13, "ysines": 2 }],
                [2, "copy", { "layer": 4 }],
                [4, "dots", { "blend": "lighten", "gridX": 31, "gridY": 62, "size": [1, 250], "seed": 257772, "rgba": [248, 88, 52, 64], "shape": "sphere", "dynamic": true, "xsines": 3, "ysines": 1 }],
                [3, "copy", { "layer": 4 }],
                [4, "map", { "xamount": 36, "yamount": 108, "xchannel": 3, "ychannel": 1, "xlayer": 4, "ylayer": 4 }]
            ] },

        { "normalize": "limitless", "items": [
                [4, "waves", { "blend": "lighten", "rgba": [186, 247, 41, 64], "level": 50, "xsines": 1, "ysines": 3, "dynamic": true }],
                [0, "copy", { "layer": 4 }],
                [4, "spheres", { "blend": "lineardodge", "rgba": [239, 208, 221, 319], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 28113 }],
                [1, "copy", { "layer": 4 }],
                [4, "spheres", { "blend": "multiply", "rgba": [95, 83, 214, 64], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 193156 }],
                [2, "copy", { "layer": 4 }],
                [4, "clouds", { "blend": "linearlight", "rgba": [226, 89, 38, 64], "seed": 220436, "roughness": 11, "colormap": null, "dynamic": true }],
                [3, "copy", { "layer": 4 }],
                [4, "map", { "xamount": 16, "yamount": 12, "xchannel": 2, "ychannel": 2, "xlayer": 4, "ylayer": 4 }]
            ] },
        { "normalize": "limitless", "items": [
                [4, "waves", { "blend": "lighten", "rgba": [187, 219, 176, 128], "level": 50, "xsines": 1, "ysines": 9, "dynamic": true }],
                [0, "copy", { "layer": 4 }],
                [4, "spheres", { "blend": "linearlight", "rgba": [250, 108, 51, 128], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 224136 }],
                [1, "copy", { "layer": 4 }],
                [4, "pyramids", { "blend": "linearlight", "rgba": [75, 226, 247, 128], "origin": "random", "dynamic": true, "count": 21, "size": [21, 100], "seed": 161476 }],
                [2, "copy", { "layer": 4 }],
                [4, "spheres", { "blend": "exclusion", "rgba": [128, 250, 253, 383], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 87468 }],
                [3, "copy", { "layer": 4 }],
                [4, "map", { "xamount": 38, "yamount": 95, "xchannel": 1, "ychannel": 1, "xlayer": 4, "ylayer": 4 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "waves", { "blend": "opacity", "rgba": [83, 15, 233, 255], "level": 50, "xsines": 6, "ysines": 6 }],
                [0, "dots", { "blend": "lighten", "gridX": 6, "gridY": 12, "size": [20, 250], "seed": 9665, "rgba": [178, 105, 139, 148], "shape": "rect", "dynamic": true, "xsines": 5, "ysines": 4 }],
                [0, "dots", { "blend": "multiply", "gridX": 4, "gridY": 5, "size": [20, 250], "seed": 195646, "rgba": [245, 131, 49, 193], "shape": "rect", "dynamic": true, "xsines": 5, "ysines": 9 }],
                [0, "sharpen", { "type": 1 }],
                [0, "spheres", { "blend": "multiply", "rgba": [44, 228, 248, 255], "origin": "random", "dynamic": true, "count": 21, "size": [20, 70], "seed": 245879, "opacity": 255 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "waves", { "blend": "", "rgba": [229, 153, 10, 255], "level": 50, "xsines": 3, "ysines": 6, "channels": [1, 1, 1, 1] }],
                [1, "spheres", { "blend": "lineardodge", "rgba": [10, 123, 207, 255], "origin": "random", "dynamic": false, "count": 21, "size": [20, 70], "seed": 140616 }],
                [2, "copy", { "layer": 1 }],
                [2, "map", { "xamount": 82, "yamount": 235, "xchannel": 1, "ychannel": 0, "xlayer": 0, "ylayer": 1 }]
            ] },

        { "normalize": "limitless", "items": [
                [0, "subplasma", { "seed": 242842, "size": 3, "rgba": [199, 16, 123, 255] }],
                [0, "subplasma", { "seed": 219222, "size": 4, "rgba": [186, 241, 104, 255], "blend": "darken" }],
                [0, "subplasma", { "seed": 261966, "size": 4, "rgba": [249, 47, 110, 255], "blend": "difference" }],
                [0, "subplasma", { "seed": 74493, "size": 2, "rgba": [177, 17, 191, 255], "blend": "linearlight" }],
                [0, "map", { "xamount": 73, "yamount": 31, "xchannel": 1, "ychannel": 2, "xlayer": 0, "ylayer": 0 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "subplasma", { "seed": 41873, "size": 5, "rgba": [96, 167, 115, 159], "blend": "opacity" }],
                [0, "subplasma", { "seed": 35198, "size": 4, "rgba": [207, 178, 14, 211], "blend": "difference" }],
                [0, "subplasma", { "seed": 23779, "size": 3, "rgba": [32, 65, 67, 221], "blend": "difference" }],
                [0, "subplasma", { "seed": 2889, "size": 4, "rgba": [86, 141, 115, 242], "blend": "difference" }],
                [0, "subplasma", { "seed": 9426, "size": 3, "rgba": [219, 19, 37, 229], "blend": "difference" }],
                [0, "spheres", { "blend": "difference", "rgba": [249, 236, 223, 189], "origin": "random", "dynamic": false, "count": 21, "size": [20, 70], "seed": 181280 }],
                [0, "brightness", { "adjust": 20, "legacy": true }],
                [0, "contrast", { "adjust": 20 }],
                [0, "vibrance", { "adjust": 20 }],
                [0, "colorize", { "level": 50, "rgba": [148, 229, 64, 255], "colormap": "!fire" }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "fill", { "blend": "opacity", "rgba": [14, 234, 138, 255] }],
                [0, "spheres", { "blend": "darken", "rgba": [221, 71, 60, 255], "origin": "random", "dynamic": true, "count": 21, "size": [10, 60], "seed": 148368 }],
                [0, "spheres", { "blend": "softlight", "rgba": [128, 116, 67, 255], "origin": "random", "dynamic": true, "count": 21, "size": [10, 60], "seed": 36989 }],
                [0, "spheres", { "blend": "lighten", "rgba": [17, 253, 2, 255], "origin": "random", "dynamic": true, "count": 44, "size": [10, 44], "seed": 154791 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "waves", { "blend": "", "rgba": [58, 167, 243, 255], "level": 50, "xsines": 5, "ysines": 2 }],
                [1, "pyramids", { "blend": "screen", "rgba": [145, 144, 187, 255], "origin": "random", "dynamic": true, "count": 21, "size": [21, 100], "seed": 71569 }],
                [2, "spheres", { "blend": "lighten", "rgba": [254, 225, 83, 255], "origin": "random", "dynamic": false, "count": 21, "size": [20, 70], "seed": 121729 }],
                [3, "merge", { "blend": "opacity", "layer": 0, "opacity": null }],
                [3, "merge", { "blend": "overlay", "layer": 1, "opacity": null }],
                [4, "copy", { "layer": 3 }],
                [4, "merge", { "blend": "difference", "layer": 2, "opacity": null }],
                [4, "brightness", { "adjust": 10, "legacy": true }],
                [4, "vibrance", { "adjust": 10 }],
                [4, "contrast", { "adjust": 20 }]
            ] },

        { "normalize": "limitless", "items": [
                [0, "clouds", { "blend": "opacity", "rgba": [4, 95, 48, 255], "seed": 25573, "roughness": 3, "colormap": null }],
                [0, "clouds", { "blend": "difference", "rgba": [103, 211, 216, 255], "seed": 1940, "roughness": 14, "colormap": null }],
                [0, "emboss", { "type": 2, "seed": 41759 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "squares", { "blend": "opacity", "rgba": [126, 178, 215, 0.07695393988397], "origin": [200, 200], "count": 7, "elements": [{ "x": 200, "y": 200, "size": 177 }, { "x": 200, "y": 200, "size": 139 }, { "x": 200, "y": 200, "size": 92 }, { "x": 200, "y": 200, "size": 147 }, { "x": 200, "y": 200, "size": 14 }, { "x": 200, "y": 200, "size": 36 }, { "x": 200, "y": 200, "size": 86 }], "size": [2, 200] }],
                [0, "squares", { "blend": "lighten", "rgba": [219, 119.98406219482, 144.92457580566, 0.14091341791209], "origin": [200, 200], "count": 7, "elements": [{ "x": 200, "y": 200, "size": 73 }, { "x": 200, "y": 200, "size": 26 }, { "x": 200, "y": 200, "size": 23 }, { "x": 200, "y": 200, "size": 54 }, { "x": 200, "y": 200, "size": 14 }, { "x": 200, "y": 200, "size": 28 }, { "x": 200, "y": 200, "size": 73 }], "size": [2, 100] }],
                [0, "brightness", { "adjust": -10, "legacy": true, "blend": "" }],
                [0, "vibrance", { "adjust": 50, "blend": "" }],
                [1, "copy", 0],
                [1, "contrast", { "adjust": 50, "blend": "" }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "waves", { "blend": "", "rgba": [89, 97, 231, 255], "level": 50, "xsines": 8, "ysines": 8, "channels": [1, 1, 1, 1], "seed": 243536 }],
                [1, "spheres", { "blend": "lineardodge", "rgba": [23, 114, 154, 255], "origin": "random", "dynamic": false, "count": 21, "size": [20, 70], "seed": 126517 }],
                [2, "copy", { "layer": 1 }],
                [2, "map", { "xamount": 51, "yamount": 225, "xchannel": 0, "ychannel": 0, "xlayer": 0, "ylayer": 0, "seed": 8534 }]
            ] },
        { "normalize": "limitless", "items": [
                [0, "waves", { "blend": "", "rgba": [128, 128, 128, 128], "level": 50, "xsines": 5, "ysines": 9, "seed": 107734 }],
                [0, "lines2", { "blend": "screen", "rgba": [97, 112, 121, 255], "type": "vertical", "size": [0.1, 7], "count": 10, "seed": 50420 }],
                [0, "lines2", { "blend": "lighten", "rgba": [183, 82, 159, 255], "type": "horizontal", "size": [0.1, 7], "count": 33, "seed": 11445 }],
                [0, "squares", { "blend": "", "rgba": [144, 250, 226, 255], "origin": "random", "count": 4, "size": [2, 50], "seed": 183722 }],
                [0, "squares", { "blend": "darken", "rgba": [81, 57, 157, 255], "origin": "random", "count": 44, "size": [7, 21], "seed": 162488 }],
                [0, "squares", { "blend": "softlight", "rgba": [5, 189, 145, 255], "origin": "random", "count": 38, "size": [4, 7], "seed": 122757 }],
                [0, "pyramids", { "blend": "lineardodge-invert", "rgba": [49, 254, 228, 255], "origin": "random", "dynamic": true, "count": 21, "size": [21, 100], "seed": 70415 }],
                [0, "noise", { "blend": "softlight", "mode": "monochrome", "channels": [255, 255, 255], "opacity": 0.2, "seed": 12668 }],
                [0, "grayscale", { "method": "average", "seed": 250368 }],
                [0, "lines2", { "blend": "opacity", "rgba": [32, 169, 239, 281], "type": "horizontal", "size": [0.1, 1], "count": 25, "seed": 164604 }],
                [0, "lines2", { "blend": "opacity", "rgba": [0, 0, 0, 281], "type": "vertical", "size": [0.2, 0, 5], "count": 21, "seed": 204537 }],
                [0, "sharpen", { "type": 1, "seed": 215753 }]
            ] },

    ];

    var addImage = function(key, canvas, selector) {
        var img = '<img src="' + canvas.toDataURL("image/png") + '" />';
        var images = $('<div class="img"><small>' + key + '</small>' + img + '</div>');
        $(selector).append(images);
    }

    for (var p = 0; p < presets.length; p++) {

        var texture = generator.render(presets[p]);
        addImage(p + 1, texture.toCanvas(), '#examples');

    }

    $('.hideme').html('');

});