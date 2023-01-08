module.exports = function (tgen) {
  tgen.preset("z-error-blend2", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "dots",
        {
          blend: "difference-invert",
          rgba: [[0, 255], [0, 255], 120, 0.9],
          shape: "rect",
          size: [200, 200],
          gridX: [7, 7],
          gridY: [7, 7],
          xsines: [7, 7],
          ysines: [7, 7],
        },
      ],
    ],
  });
};
