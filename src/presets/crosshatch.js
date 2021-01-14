(function (tgen) {
  tgen.preset("crosshatch", {
    width: 256,
    height: 256,
    items: [
      [0, "crosshatch"],
      [
        0,
        "waves",
        {
          blend: "random",
        },
      ],
      [
        0,
        "brightness",
        {
          adjust: 20,
          legacy: true,
        },
      ],
      [
        0,
        "contrast",
        {
          adjust: 10,
        },
      ],
      [
        0,
        "vibrance",
        {
          adjust: 100,
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
