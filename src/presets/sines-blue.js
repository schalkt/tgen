(function (tgen) {
  tgen.preset("sines-blue", {
    width: 512,
    height: 512,
    items: [
      [
        0,
        "subplasma",
        {
          size: [1, 5],
          rgba: [[0, 255], [0, 255], [77, 255], 1],
        },
      ],
      [
        0,
        "sinecolor",
        {
          channel: [0, 2],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "random",
          size: [1, 5],
          rgba: "randomalpha",
        },
      ],
      [
        0,
        "sinecolor",
        {
          channel: [0, 2],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "random",
          size: [1, 5],
          rgba: "randomalpha",
        },
      ],
      [
        0,
        "sinecolor",
        {
          channel: [0, 2],
        },
      ],
      [
        0,
        "colorize",
        {
          colormap: "ice",
        },
      ],
      [
        0,
        "brightness",
        {
          adjust: 20,
        },
      ],
      [
        0,
        "contrast",
        {
          adjust: 20,
        },
      ],
      [
        0,
        "vibrance",
        {
          adjust: 20,
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
