(function (tgen) {
  tgen.preset("craters", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "fill",
        {
          rgba: [
            [144, 255],
            [144, 255],
            [144, 255],
            [0.8, 1],
          ],
        },
      ],
      [
        0,
        "spheres",
        {
          blend: [
            "overlay",
            "linearlight",
            "multiply",
            "difference",
            "softlight",
            "darken",
            "opacity",
            "lineardodge",
          ],
          dynamic: true,
        },
      ],
      [
        0,
        "spheres",
        {
          blend: [
            "overlay",
            "linearlight",
            "multiply",
            "difference",
            "softlight",
            "darken",
            "opacity",
            "lineardodge",
          ],
          dynamic: true,
        },
      ],
      [
        0,
        "map",
        {
          xamount: [1, 77],
          yamount: [1, 77],
          xchannel: [0, 3],
          ychannel: [0, 3],
          xlayer: 0,
          ylayer: 0,
        },
      ],
      [
        0,
        "brightness",
        {
          adjust: 10,
        },
      ],
      [
        0,
        "contrast",
        {
          adjust: 20,
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
