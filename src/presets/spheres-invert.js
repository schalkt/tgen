module.exports = function (tgen) {
  tgen.preset("spheres-invert", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "spheres",
        {
          blend: "difference",
          count: [21, 32],
        },
      ],
      [0, "invert"],
      [
        1,
        "spheres",
        {
          blend: "difference",
          count: [21, 48],
        },
      ],
      [1, "invert"],
      [
        2,
        "merge",
        {
          layer: 0,
        },
      ],
      [
        2,
        "merge",
        {
          layer: 1,
          blend: "difference",
        },
      ],
    ],
  });
};
