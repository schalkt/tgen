module.exports = function (tgen) {
  tgen.preset("sines-chrome", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "subplasma",
        {
          size: 3,
          rgba: [[0, 255], [0, 255], [77, 255], 1],
        },
      ],
      [
        0,
        "sinecolor",
        {
          channel: 2,
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: ["difference", "darken", "lighten"],
          size: 3,
          rgba: [[0, 255], [77, 255], [0, 255], 1],
        },
      ],
      [
        0,
        "sinecolor",
        {
          channel: 1,
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: ["difference", "darken", "lighten"],
          size: 3,
          rgba: [[77, 255], [0, 255], [0, 255], 1],
        },
      ],
      [
        0,
        "sinecolor",
        {
          channel: 0,
        },
      ],
      [0, "grayscale"],
      [
        0,
        "brightness",
        {
          adjust: 20,
        },
      ],
      [
        0,
        "contrast",
        {
          adjust: 20,
        },
      ],
      [
        0,
        "vibrance",
        {
          adjust: 20,
        },
      ],
    ],
  });
};
