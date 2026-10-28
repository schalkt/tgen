$(document).ready(function () {
  // disable localStorage history
  tgen.config.historyLast = 0;

  // initialize the generator
  const generator = tgen.init(128, 128);

  let params = {
    items: [
      [0, "fill"],
      [1, "noise"],
      [
        2,
        "spheres",
        {
          blend: "lighten",
          origin: "random",
          dynamic: false,
          count: 21,
          size: [21, 42],
        },
      ],
      [
        3,
        "pyramids",
        {
          blend: "difference-invert",
          rgba: [242, 198, 13, 183],
          origin: "random",
          dynamic: true,
          count: 17,
          size: [6.13875885419558, 65.06580611909934],
          seed: 698883,
        },
      ],
      [
        4,
        "squares",
        {
          blend: "lighten",
          rgba: [215, 177, 225, 187],
          origin: "random",
          count: 77,
          size: [1.960330601878923, 20.631680655331365],
          seed: 13618783,
        },
      ],
      [
        5,
        "circles",
        {
          blend: "lighten",
          rgba: [59, 82, 184, 147],
          origin: "random",
          count: 15,
          size: [19.960330601878923, 5.631680655331365],
          seed: 9805408,
        },
      ],
      [
        6,
        "lines",
        {
          blend: "opacity",
          rgba: [57, 161, 112, 77],
          size: 201,
          count: 210,
        },
      ],
      [
        7,
        "lines2",
        {
          blend: "screen",
          rgba: [175, 199, 23, 153],
          type: "vertical",
          size: [0.1, 21],
          count: 18,
          seed: 6005181,
        },
      ],
      [
        8,
        "subplasma",
        {
          seed: 4771973,
          size: 4,
          rgba: [126, 131, 133, 238],
        },
      ],
      [
        9,
        "waves",
        {
          blend: "lineardodge",
          rgba: [6, 48, 52, 230],
          level: 68,
          xsines: 13,
          ysines: 4,
          seed: 5090682,
        },
      ],
      [
        10,
        "crosshatch",
        {
          blend: "screen",
          rgba: [52, 92, 86, 230],
          level: 39,
          xadjust: 74.62633158935496,
          yadjust: 45.021245801724405,
          seed: 4889645,
        },
      ],
      [
        11,
        "clouds",
        {
          blend: "lighten",
          rgba: [55, 125, 255, 255],
          seed: 11904915,
          roughness: 5,
          colormap: null,
        },
      ],
      [
        12,
        "colorbar",
        {
          type: "vertical",
          colormap: "fire",
          mirror: true,
          seed: 10080281,
        },
      ],
      [
        13,
        "checkerboard",
        {
          rgba: [14, 121, 197, 177],
          even: false,
          size: 16,
          seed: 6079974,
        },
      ],
      [
        14,
        "dots",
        {
          blend: "lighten",
          gridX: 11,
          gridY: 10,
          size: [200, 400],
          seed: 3205906,
          rgba: [29, 137, 198, 226],
          shape: "sphere",
          dynamic: true,
          xsines: 9,
          ysines: 5,
        },
      ],
      [
        15,
        "xor",
        {
          rgba: [175, 110, 20, 213],
          level: 43,
          zoom: 4,
          seed: 150948,
        },
      ],
      [
        16,
        "cells",
        {
          blend: "opacity",
          mode: "edge",
          count: 18,
          colorize: 1,
          invert: 1,
          rgba: [64, 192, 255, 255],
          seed: 4211,
        },
      ],
      [
        17,
        "diamonds",
        {
          blend: "opacity",
          layout: "grid",
          style: "faceted",
          gridX: 5,
          gridY: 5,
          shade: [0.6, 1],
          rgba: [80, 160, 230, 255],
          seed: 9183,
        },
      ],
      [
        18,
        "hexagons",
        {
          blend: "lighten",
          origin: "random",
          count: 28,
          size: [6, 22],
          rgba: [96, 210, 170, 210],
          seed: 51723,
        },
      ],
      [
        19,
        "stars",
        {
          blend: "lighten",
          origin: "random",
          count: 34,
          size: [4, 18],
          rgba: [250, 214, 90, 230],
          seed: 80412,
        },
      ],
      [
        20,
        "pentagons",
        {
          blend: "lighten",
          origin: "random",
          count: 26,
          size: [6, 22],
          rgba: [230, 110, 150, 210],
          seed: 33190,
        },
      ],
      [
        21,
        "triangles",
        {
          blend: "lighten",
          origin: "random",
          count: 30,
          size: [6, 24],
          rgba: [150, 130, 240, 210],
          seed: 64457,
        },
      ],
      [
        22,
        "crosses",
        {
          blend: "lighten",
          origin: "random",
          count: 30,
          size: [5, 20],
          rgba: [240, 90, 70, 220],
          seed: 27718,
        },
      ],
      [
        23,
        "mandelbrot",
        {
          blend: "opacity",
          rgba: [255, 255, 255, 255],
          colormap: "rainbow",
          density: 3,
          iteration: 250,
          threshold: 1,
          x: 50,
          y: 50,
          size: 600,
          focusX: 69.3,
          focusY: 87.1,
          power: 2,
          angle: 0,
          seed: 1,
        },
      ],
      [
        24,
        "julia",
        {
          blend: "opacity",
          rgba: [255, 255, 255, 255],
          c: [-0.4, 0.6],
          power: 2,
          angle: 0,
          colormap: "ice",
          density: 4,
          iteration: 200,
          x: 50,
          y: 50,
          size: 100,
          seed: 1,
        },
      ],
    ],
  };

  const addImage = function (key, canvas, selector) {
    const img = '<img src="' + canvas.toDataURL("image/png") + '" />';
    const images = $(
      '<div class="img"><small>' + key + "</small>" + img + "</div>"
    );
    $(selector).append(images);
  };

  let i;

  for (i = 0; i < params.items.length; i++) {
    if (params.items[i][2] === undefined) {
      params.items[i][2] = {};
    }
    if (params.items[i][2].rgba === undefined) {
      params.items[i][2].rgba = [[128, 255], [128, 255], [128, 255], 255];
    }
    if (params.items[i][2].seed === undefined) {
      params.items[i][2].seed = 7771;
    }
  }

  const texture = generator.render(params);

  for (i = 0; i < params.items.length; i++) {
    addImage(
      params.items[i][1],
      texture.toCanvas(texture.layers[i]),
      "#effects"
    );
  }

  $(".hideme").html("");
});
