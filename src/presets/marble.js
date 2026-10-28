module.exports = function (tgen) {
  tgen.preset("marble", {
    width: 256,
    height: 256,

    items: [
      // white-grey base with soft patches
      [0, "fill", { rgba: [236, 234, 230, 255] }],
      [
        0,
        "clouds",
        {
          blend: "multiply",
          rgba: [255, 255, 255, 255],
          roughness: [2, 6],
          colormap: [
            { percent: 0, rgba: [212, 208, 202, 255] },
            { percent: 100, rgba: [255, 255, 255, 255] },
          ],
        },
      ],
      // fine grey veins
      [
        0,
        "electricity",
        {
          type: "field",
          blend: "multiply",
          rgba: [170, 165, 160, 110],
          core: 0,
          glow: [0.05, 0.15],
          scale: [4, 6],
          layers: [2, 3],
          octaves: 3,
          warp: [0.6, 1.2],
          thickness: [0.004, 0.008],
        },
      ],
      // main brownish veins
      [
        0,
        "electricity",
        {
          type: "field",
          blend: "multiply",
          rgba: [150, 115, 85, 210],
          core: 0,
          glow: [0.3, 0.5],
          scale: 2,
          layers: [1, 3],
          octaves: 4,
          warp: [0.8, 1.4],
          thickness: [0.004, 0.009],
        },
      ],
      [0, "blur"],
      // grain
      [0, "noise", { mode: "monochrome", blend: "multiply", opacity: 10 }],
    ],
  });
};
