# tgen.js

Javascript seamless texture generator v0.1


## Quick usage

```javascript

<script src="tgen.js"></script>

var canvas = tgen(256)
            .waves()
            .waves({blend: 'difference'})
            .contrast({"adjust": 50})
            .toCanvas();

$('body').css('background-image', 'url(' + canvas.toDataURL("image/png") + ')');

```

## Sample textures

Try the random generator [here](http://schalk.hu/projects/tgen/) :)

![sample textures](http://schalk.hu/projects/tgen/samples.jpg)


## Extended usage

```javascript
   var params = {
        "width": 256, // texture size in pixel
        "height": 256, // texture size in pixel
        "items": [
            [0, "squares", { // layer number and type
                "blend": "opacity", // layer blend mode
                "count": 7, // square count
                "origin": [200, 200], // min,max in percent, 200%, 200%
                "sizeMin": 2, // percent 2%
                "sizeMax": 200,  // percent 200%
                "rgba": [
                    128, // fixed red channel
                    [1, 255], // random green channel between 1 and 255
                    [1, 255], // random blue channel between 1 and 255
                    [0.05, 0.15] // random opacity between 0.05 and 0.15
                ]
            }],
            [0, "squares", {
                "blend": "lighten",
                "count": 7,
                "origin": [200, 200],
                "sizeMin": 2,
                "sizeMax": 100,
                "rgba": [
                    [1, 255],
                    [1, 255],
                    [1, 255],
                    [0.05, 0.15]
                ]
            }],
            [0, "brightness", {"adjust": -10, "legacy": true}],
            [0, "vibrance", {"adjust": 50}],
            [1, "copy", 0], // copy layer 0 to layer 1
            [1, "contrast", {"adjust": 50}]
        ]
    };

    tgen().params(params).getCanvas(function (canvas) {
        $('body').css('background-image', 'url(' + canvas.toDataURL("image/png") + ')');
    });

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

## Available types
* waves
* crosshatch
* squares
* circles
* spheres (cells with invert)
* lines (under development)
* noise (color or monochrome)

## Available color modifications
* brightness
* contrast
* grayscale (ligthness, average, luminosity)
* colorize
* invert
* threshold
* vibrance

## Available other options
* fill
* merge (copy layer with blend)
* copy (copy layer without blend)
* history (store last x generated texture params in localStorage)

# Soon
* subplasma
* fractals
* shapes
* copy from outer canvas
* map effect
* blur
* sharpen
* emboss
* etc.

# License
MIT

# Thank you
* BoyC/Conspiracy for [a.D.D.i.c.t 2](http://conspiracy.hu/release/tool/addict2/) source
* mrdoob for the inspiration [texgen.js](https://github.com/mrdoob/texgen.js)
