(function (tgen) {
  tgen.preset("z-dev", {
    width: 1024,
    height: 512,
    normalize: "limitless",
    items: [
      [
        0,
        "clouds",
        {
          seed: 5129359,
        },
      ],
      [
        0,
        "squares",
        {
          seed: 632731,
        },
      ],
      [
        1,
        "copy",
        {
          layer: 0,
        },
      ],
      [1, "equirectangular", {}],
    ],
  });
})(SeamlessTextureGenerator);
