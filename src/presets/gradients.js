module.exports = function (tgen) {
  tgen.preset("gradients", {
    width: 512,
    height: 512,
    items: [
      [
        0,
        "colorbar",
        {
          mirror: true,
          colormap: ["fire", "ice", "dusk", "seashore", "random"],
        },
      ],
      [
        1,
        "colorbar",
        {
          mirror: true,
          type: "vertical",
          colormap: [
            {
              percent: 0,
              rgba: [[0, 255], [0, 255], [0, 255], 1],
            },
            {
              percent: 50,
              rgba: [[0, 255], [0, 255], [0, 255], 1],
            },
            {
              percent: 100,
              rgba: [[0, 255], [0, 255], [0, 255], 1],
            },
          ],
        },
      ],
      [2, "copy"],
      [
        2,
        "merge",
        {
          layer: 0,
          blend: ["multiply", "lighten", "exclusion", "screen", "lineardodge"],
        },
      ],
    ],
  });
};
