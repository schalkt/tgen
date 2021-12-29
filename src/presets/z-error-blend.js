module.exports = function (tgen) {
  tgen.preset("z-error-blend", {
    width: 512,
    height: 512,
    items: [
      [
        0,
        "clouds",
        {
          colormap: "redblue",
          seed: 32,
          roughness: 4,
        },
      ],
      [
        1,
        "clouds",
        {
          colormap: "seashore",
          seed: 211,
          roughness: 4,
        },
      ],
      [2, "copy"],
      [
        2,
        "merge",
        {
          layer: 0,
          blend: "multiply",
        },
      ],
      [
        3,
        "copy",
        {
          layer: 0,
        },
      ],
      [
        3,
        "clouds",
        {
          colormap: "seashore",
          blend: "multiply",
          seed: 211,
          roughness: 4,
        },
      ],
    ],
  });
};
