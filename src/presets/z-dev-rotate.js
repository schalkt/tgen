(function (tgen) {
  tgen.preset("z-dev-rotate", {
    width: 512,
    height: 512,
    preset: {
      name: "random",
      seed: null,
    },
    items: [
      [null, "copy", {}],
      [
        null,
        "rotate",
        {
          type: 1,
          angle: 90,
          times: [1, 4],
          blend: "random",
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
