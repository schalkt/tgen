module.exports = function (tgen) {
  tgen.preset("mergetest", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "waves",
        {
          blend: "",
        },
      ],
      [
        1,
        "pyramids",
        {
          blend: ["lighten", "difference", "screen"],
          dynamic: true,
        },
      ],
      [
        2,
        "spheres",
        {
          blend: ["lighten", "difference", "screen"],
        },
      ],
      [
        3,
        "merge",
        {
          layer: 0,
        },
      ],
      [
        3,
        "merge",
        {
          layer: 1,
          blend: "overlay",
        },
      ],
      [4, "copy", 3],
      [
        4,
        "merge",
        {
          layer: 2,
          blend: "difference",
        },
      ],
      [
        4,
        "brightness",
        {
          adjust: 10,
          legacy: true,
        },
      ],
      [
        4,
        "vibrance",
        {
          adjust: 10,
        },
      ],
      [
        4,
        "contrast",
        {
          adjust: 20,
        },
      ],
    ],
  });
};
