(function (tgen) {
  tgen.preset("starfield", {
    width: 512,
    height: 512,
    items: [
      [
        0,
        "fill",
        {
          rgba: [[30, 60], [30, 60], [30, 60], 1],
        },
      ],
      [
        0,
        "clouds",
        {
          blend: "softlight",
          rgba: [232, 126, 226, 1],
          roughness: [2, 4],
        },
      ],
      [
        0,
        "clouds",
        {
          blend: "overlay",
          rgba: [44, 108, 208, 1],
          roughness: [2, 4],
        },
      ],
      [
        0,
        "pyramids",
        {
          blend: "screen",
          rgba: [255, 255, 255, 0.5],
          count: 170,
          size: 0.5,
        },
      ],
      [
        0,
        "pyramids",
        {
          blend: "screen",
          rgba: [255, 255, 255, 1],
          count: 170,
          size: 1,
        },
      ],
      [
        0,
        "pyramids",
        {
          blend: "lineardodge",
          rgba: [255, 255, 255, 1],
          count: 7,
          size: [1, 3],
        },
      ],
      [
        0,
        "brightness",
        {
          adjust: 10,
          legacy: true,
        },
      ],
      [
        0,
        "vibrance",
        {
          adjust: 50,
        },
      ],
      [
        0,
        "contrast",
        {
          adjust: 50,
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
