module.exports = function (tgen) {
  tgen.preset("spheres", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "spheres",
        {
          blend: "lighten",
          count: [7, 21],
        },
      ],
      [
        1,
        "spheres",
        {
          blend: "lighten",
          count: [4, 7],
        },
      ],
      [
        1,
        "merge",
        {
          layer: 0,
          blend: "lighten",
        },
      ],
      [
        1,
        "brightness",
        {
          adjust: 20,
        },
      ],
      [
        1,
        "contrast",
        {
          adjust: 20,
        },
      ],
    ],
  });
};
