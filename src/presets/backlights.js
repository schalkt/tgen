module.exports = function (tgen) {
  tgen.preset("backlights", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "spheres",
        {
          count: [7, 42],
          size: [14, 77],
          blend: "opacity",
          rgba: [[94, 240], [94, 240], [94, 240], 1],
        },
      ],
      [
        1,
        "spheres",
        {
          count: [7, 42],
          size: [14, 77],
          blend: "opacity",
          rgba: [[94, 240], [94, 240], [94, 240], 1],
        },
      ],
      [2, "copy", 0],
      [
        2,
        "merge",
        {
          layer: 1,
          blend: "backlight",
        },
      ],
    ],
  });
};
