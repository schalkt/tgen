# tgen.js

Javascript seamless texture generator v0.2.0


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

Try the random generator [here](http://seamless-texture.com/generator/) :)

![sample textures](http://schalk.hu/projects/tgen/samples.jpg#20150406)

## Requirements

* Google Chrome or Firefox (or IE 10+)

## Extended usage

> Look at all of presets in the index.html

```javascript
   var params = {
        "width": 256, // texture size in pixel
        "height": 256, // texture size in pixel
        "items": [
            [0, "squares", { // layer number and type
                "blend": "opacity", // layer blend mode
                "count": 7, // square count
                "origin": [200, 200], // min,max in percent, 200%, 200%
                "size": [2,200], // random between 2-200%
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
                "size": [2,200],
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

    tgen().render(params).getCanvas(function (canvas) {
        $('body').css('background-image', 'url(' + canvas.toDataURL("image/png") + ')');
    });

```

**Regenerating the same texture with different color**

```javascript

// render random waves
var texture = tgen(256).waves();

// get generated params
var params = texture.params();

// change first item color
params.items[0][2].rgba = [255,50,10,0.85];
var texture2 = tgen().render(params);

$('body').css('background-image', 'url(' + texture2.toCanvas().toDataURL("image/png") + ')');

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
* clouds
* subplasma
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
* map
* copy (copy layer without blend)
* history (store last x generated texture params in localStorage)

# Soon
* plasma
* fractals
* shapes
* copy from outer canvas
* blur
* sharpen
* emboss
* etc.

# License
MIT

# Thank you
* BoyC/Conspiracy for [a.D.D.i.c.t 2](http://conspiracy.hu/release/tool/addict2/) source
* mrdoob for the inspiration [texgen.js](https://github.com/mrdoob/texgen.js)
* [Ace](http://ace.c9.io/) - The High Performance Code Editor