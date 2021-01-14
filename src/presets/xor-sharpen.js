(function (tgen) {
  tgen.preset("xor-sharpen", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "xor",
        {
          zoom: [1, 4],
        },
      ],
      [
        1,
        "xor",
        {
          zoom: [1, 7],
        },
      ],
      [
        2,
        "xor",
        {
          zoom: [1, 14],
        },
      ],
      [3, "copy", 0],
      [
        3,
        "merge",
        {
          layer: 1,
          blend: "random",
        },
      ],
      [
        3,
        "merge",
        {
          layer: 2,
          blend: "random",
        },
      ],
      [3, "sharpen"],
      [
        3,
        "brightness",
        {
          adjust: 10,
          legacy: true,
        },
      ],
      [
        3,
        "vibrance",
        {
          adjust: 50,
        },
      ],
      [
        3,
        "contrast",
        {
          adjust: 50,
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
