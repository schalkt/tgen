module.exports = function (tgen) {
  tgen.preset("z-error-blend2", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "dots",
        {
          blend: ["difference-invert", "lineardodge-invert", "backlight"],
          rgba: [[0, 255], [0, 255], 120, 0.9],
          shape: "rect",
          size: [100, 280],
          gridX: [2, 7],
          gridY: [2, 7],
          xsines: [2, 7],
          ysines: [2, 7],
        },
      ],
    ],
  });
};
