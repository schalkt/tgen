module.exports = function (tgen) {
  tgen.preset("cells", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "cells",
        {
          blend: "random",
          count: [7, 42],
          mode: "f1",
        },
      ],
      [
        1,
        "cells",
        {
          blend: "random",
          count: [7, 42],
          mode: "edge",
        },
      ],
      [
        1,
        "merge",
        {
          layer: 0,
          blend: ["overlay", "lighten", "difference"],
        },
      ],
      [1, "colorize"],
      [
        1,
        "brightness",
        {
          adjust: -10,
          legacy: true,
        },
      ],
      [
        1,
        "vibrance",
        {
          adjust: 50,
        },
      ],
      [
        1,
        "contrast",
        {
          adjust: 50,
        },
      ],
    ],
  });
};
