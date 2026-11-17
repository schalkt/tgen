module.exports = function (tgen) {
  // Full random pool: every generative effect (no filters/functions/test-*)
  const allEffects = [
    "blobplasma",
    "cells",
    "checkerboard",
    "circles",
    "clouds",
    "colorbar",
    "colorplasma",
    "crosses",
    "crosshatch",
    "diamonds",
    "dots",
    "electricity",
    "hexagons",
    "julia",
    "lines",
    "lines2",
    "lines3",
    "mandelbrot",
    "marble",
    "noise",
    "pentagons",
    "pyramids",
    "spheres",
    "squares",
    "stars",
    "subplasma",
    "triangles",
    "warpplasma",
    "waves",
    "xor",
  ];

  tgen.preset("rrrr3", {
    width: 256,
    height: 256,
    normalize: "compress",
    items: [
      [
        0,
        allEffects,
        {
          rgba: [
            [32, 255],
            [32, 255],
            [32, 255],
            [0.5, 0.9],
          ],
          dynamic: "random",
        },
      ],
      [
        0,
        allEffects,
        {
          blend: "random",
          rgba: [
            [0, 255],
            [0, 255],
            [0, 255],
            [0.1, 0.9],
          ],
          dynamic: "random",
        },
      ],
      [
        1,
        allEffects,
        {
          rgba: [
            [32, 255],
            [32, 255],
            [32, 255],
            [0.5, 0.9],
          ],
          dynamic: "random",
        },
      ],
      [
        1,
        allEffects,
        {
          blend: "random",
          rgba: [
            [0, 255],
            [0, 255],
            [0, 255],
            [0.1, 0.9],
          ],
          dynamic: "random",
        },
      ],
      [
        2,
        "copy",
        {
          layer: 0,
        },
      ],
      [
        2,
        "merge",
        {
          layer: 1,
          blend: "random",
        },
      ],
      [
        2,
        [
          "brightness",
          "contrast",
          "vibrance",
          "sharpen",
          "emboss",
          "posterize",
          "sinecolor",
          "backlight",
        ],
        {
          adjust: [10, 40],
          level: [20, 80],
        },
      ],
      [
        2,
        "map",
        {
          xamount: [2, 177],
          yamount: [2, 177],
          xchannel: [0, 4],
          ychannel: [0, 4],
          xlayer: [0, 2],
          ylayer: [0, 2],
        },
      ],
    ],
  });
};
