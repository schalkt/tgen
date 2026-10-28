module.exports = function (tgen) {
  tgen.preset("z-dev-electricity", {
    width: 256,
    height: 256,

    items: [
      // big arcs
      [0, "fill", { rgba: [2, 4, 12, 255] }],
      [
        0,
        "electricity",
        {
          type: "field",
          rgba: [60, 140, 255, 255],
          scale: 2,
          layers: [2, 3],
          thickness: [0.012, 0.02],
        },
      ],
      // small, fainter arcs
      [1, "fill", { rgba: [2, 4, 12, 255] }],
      [
        1,
        "electricity",
        {
          type: "field",
          rgba: [40, 100, 220, 160],
          scale: [5, 7],
          layers: [2, 4],
          thickness: [0.006, 0.01],
          glow: [0.2, 0.4],
        },
      ],
      [1, "merge", { layer: 0, blend: "screen" }],
    ],
  });
};
