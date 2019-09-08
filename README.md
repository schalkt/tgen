# tgen.js

Seamless texture generator in Javascript

[![preview](https://img.shields.io/badge/preview-click_here-green.svg?style=flat-square)](https://texture-generator.com/generator/demo/)
[![npm](https://img.shields.io/npm/dt/seamless-texture-generator.svg?style=flat-square)](https://www.npmjs.com/package/seamless-texture-generator)
[![GitHub issues](https://img.shields.io/github/issues/schalkt/tgen.svg?style=flat-square)](https://github.com/schalkt/tgen/issues)
[![Build Status](https://travis-ci.org/schalkt/tgen.svg?branch=master)](https://travis-ci.org/schalkt/tgen)
[![npm](https://img.shields.io/npm/v/seamless-texture-generator.svg?style=flat-square)](https://www.npmjs.com/package/seamless-texture-generator)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/seamless-texture-generator/badge)](https://www.jsdelivr.com/package/npm/seamless-texture-generator)

## Try the online generator [here](https://texture-generator.com/generator/)

![examples](https://texture-generator.com/generator/demo/images/examples.jpg#20190908)

## Requirements

* Google Chrome, Firefox, Edge (or IE 10+)

## Quick usage and examples

```javascript
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
        "debug": true, // render info to console log, default value: false
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

### Available blends [demo here](https://texture-generator.com/generator/demo/blends.html)

![blends](https://texture-generator.com/generator/demo/images/blends.jpg#20190908)

### Available effects [demo here](https://texture-generator.com/generator/demo/effects.html)

![effects](https://texture-generator.com/generator/demo/images/effects.jpg#20190908)

### Available filters [demo here](https://texture-generator.com/generator/demo/filters.html)

![filters](https://texture-generator.com/generator/demo/images/filters.jpg#20190908)

### Available color normalize [demo here](https://texture-generator.com/generator/demo/normalize.html)

![normalize](https://texture-generator.com/generator/demo/images/normalize.jpg#20190908)

### Available other options

* map (cool effect)
* merge (copy layer with blend)
* copy (copy layer without blend)
* history (store last x generated texture params in localStorage)

### Available events

* beforeRender
* afterRender
* beforeEffect
* afterEffect

## License

MIT

## Thank you and greetings to

* BoyC/Conspiracy - [a.D.D.i.c.t 2](http://conspiracy.hu/release/tool/addict2/)
* mrdoob - [texgen.js](https://github.com/mrdoob/texgen.js)
* [Ace](http://ace.c9.io/) - The High Performance Code Editor

## Build

* `npm install` or `yarn install`
* `gulp dev` for development release
* `gulp prod` for production release

## Todo

* plasma
* fractals
* more shapes
* sprites
* electricity
* image import
* copy from outer canvas
* more examples
* fix colorbar mirror : false (black image)
* [cubemap-toastmap-generator](https://jonaszeitler.se/cubemap-toastmap-generator/)