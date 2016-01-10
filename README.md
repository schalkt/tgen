# tgen.js

Javascript seamless texture generator v0.4.3

## Sample textures

Try the online generator [here](http://seamless-texture.com/generator/) 

![sample textures](http://seamless-texture.com/generator/samples.jpg#20151028)

## Requirements

* Google Chrome or Firefox (or IE 10+)


## Quick usage and examples

```

    // initialize the generator
    var generator = tgen.init(256, 256);


    // --- texture 1 --------------------------------------------------------------

    var canvas1 = generator
            .do('waves')
            .toCanvas();

    // set img src, and width height
    $('#img1').attr('src', canvas1.toDataURL("image/png")).css({width: canvas1.width, height: canvas1.height});


    // --- texture 2 --------------------------------------------------------------

    var canvas2 = generator
            .do('fill')
            .do('waves', {blend: 'difference'})
            .do('waves', {blend: 'difference'})
            .do('contrast', {"adjust": 50})
            .toCanvas();

    // set img src, and width height
    $('#img2').attr('src', canvas2.toDataURL("image/png")).css({width: canvas2.width, height: canvas2.height});


    // --- texture 3 --------------------------------------------------------------

    var texture3 = generator
            .clear() // remove previous layers
            .do('fill')
            .do('clouds', {blend: 'difference'})
            .do('spheres', {blend: 'lineardodge', 'dynamic': true})
            .do('vibrance', {"adjust": 50});

    var canvas3 = texture3.toCanvas();

    // set img src, and width height
    $('#img3').attr('src', canvas3.toDataURL("image/png")).css({width: canvas3.width, height: canvas3.height});


    // --- texture 4 --------------------------------------------------------------

    // get the generated params of texture3
    var params = texture3.params();

    // get number of layers
    var layers = params.items.length;

    // change the color of clouds
    params.items[layers - 3][2].rgba = [255, 50, 10, 0.85];

    // change the blending method
    params.items[layers - 2][2].blend = 'overlay';

    // generate new texture with modified params of texture3
    var canvas4 = generator.render(params).toCanvas();

    // set img src, and width height
    $('#img4').attr('src', canvas4.toDataURL("image/png")).css({width: canvas4.width, height: canvas4.height});


    // --- texture 5 --------------------------------------------------------------

    var params = {
        "width":  256, // texture width in pixel
        "height": 256, // texture height in pixel
        "items":  [
            [0, "lines2", { // layer number and effect name
                "blend": "opacity", // layer blend mode
                "count": 21, // square count
                "size":  [5, 15], // random size between 5-15%
                "rgba":  [
                    255, // fixed red channel
                    [128, 192], // random green channel between 128 and 192
                    [200, 255], // random blue channel between 200 and 255
                    [0.2, 0.6] // random opacity between 0.2 and 0.6
                ]
            }],
            [1, "spheres", { // second layer
                "blend":   "lighten",
                "origin":  "random",
                "dynamic": true, //
                "count":   21,
                "size":    [20, 100],
                "rgba":    [200, 200, 200, 0.7]
            }],
            [2, "copy", 0], // copy layer 0 to layer 1
            [2, "merge", { // merge layer 1 in to 2
                "layer": 1,
                "blend": "lighten"
            }],
            [2, "brightness", {"adjust": -10, "legacy": true}], // set brightness
            [2, "vibrance", {"adjust": 50}], // set vibrance
            [2, "contrast", {"adjust": 50}] // set contrast
        ]
    };

    // generate
    var canvas5 = generator.render(params).toCanvas();

    // set img src, and width height
    $('#img5').attr('src', canvas5.toDataURL("image/png")).css({width: canvas5.width, height: canvas5.height});


    // --- texture 6 --------------------------------------------------------------

    // change layer of texture 5 merge blend method
    params.items[3] = [2, "merge", {
        "layer": 1,
        "blend": "difference"
    }];

    // render and add new effects
    var canvas6 = generator
            .render(params)
            .do('sharpen')
            .do('noise')
            .toCanvas();

    // set img src, and width height
    $('#img6').attr('src', canvas6.toDataURL("image/png")).css({width: canvas6.width, height: canvas6.height});


    // --- available effects -------------------------------------------------------

    // dump all effects and default config parameters
    for (key in tgen.defaults) {

        var params = tgen.defaults[key];
        var item = $('<span><h2>' + key + '</h2>' + JSON.stringify(params) + '</span>');
        $('.defaults').append(item);

    }
        
```

## Available blend modes
* opacity
* multiply
* screen
* overlay
* difference
* exclusion
* darken
* lighten
* lineardodge
* linearlight
* linearburn
* softlight

## Available effects
* waves
* clouds
* subplasma
* crosshatch
* squares
* circles
* pyramids
* spheres (cells with invert)
* lines (under development)
* lines2 (horizontal and vertical)
* noise (color or monochrome)
* checkerboard
* colorbar (gradients)


## Available filters
* brightness
* contrast
* grayscale (ligthness, average, luminosity)
* colorize (colormap)
* invert
* threshold
* vibrance
* sinecolor
* gamma


## Available other options
* fill
* blur
* sharpen
* emboss
* edgedetect
* sobel
* convolution filter
* merge (copy layer with blend)
* map
* copy (copy layer without blend)
* history (store last x generated texture params in localStorage)

## Available color normalize
* limitless
* clamped
* pingpong

## Available events
* beforeRender
* afterRender
* beforeEffect
* afterEffect

# Soon
* plasma
* fractals
* more shapes
* copy from outer canvas
* sprites
* electricity
* etc.

# License
MIT

# Thank you
* BoyC/Conspiracy for [a.D.D.i.c.t 2](http://conspiracy.hu/release/tool/addict2/) source
* mrdoob for the inspiration [texgen.js](https://github.com/mrdoob/texgen.js)
* [Ace](http://ace.c9.io/) - The High Performance Code Editor

# Todo
* different results (v0.3.0 -> v0.4.0): 287, 210