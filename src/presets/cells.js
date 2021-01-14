(function (tgen) {
  tgen.preset("cells", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "spheres",
        {
          blend: "lighten",
          count: 21,
          rgba: [255, 255, 255, 1],
        },
      ],
      [0, "invert"],
      [
        1,
        "spheres",
        {
          blend: "lighten",
          count: 21,
          rgba: [155, 155, 155, 1],
        },
      ],
      [1, "invert"],
      [
        1,
        "merge",
        {
          layer: 0,
          blend: ["overlay", "lighten", "difference"],
        },
      ],
      [1, "colorize"],
      [
        1,
        "brightness",
        {
          adjust: -10,
          legacy: true,
        },
      ],
      [
        1,
        "vibrance",
        {
          adjust: 50,
        },
      ],
      [
        1,
        "contrast",
        {
          adjust: 50,
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
