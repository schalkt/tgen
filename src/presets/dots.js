/**
 * Build the "dots" preset config with the given dot shape.
 * Shared by dots.js and dots2.js (they differ only in shape).
 * @param {string} shape
 * @returns {object}
 */
function build(shape) {
  const layer = (blend, size) => [
    0,
    "dots",
    {
      blend,
      shape,
      size,
      gridX: [4, 12],
      gridY: [4, 12],
      xsines: [4, 12],
      ysines: [4, 12],
    },
  ];

  return {
    width: 256,
    height: 256,
    items: [
      layer(["opacity", "lighten"], [200, 400]),
      layer("random", [50, 200]),
      [0, "sharpen"],
    ],
  };
}

module.exports = function (tgen) {
  tgen.preset("dots", build("sphere"));
};

module.exports.build = build;
