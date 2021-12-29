module.exports = function (tgen) {
  tgen.preset("sines-plasma", {
    width: 512,
    height: 512,
    items: [
      [
        0,
        "subplasma",
        {
          size: [1, 5],
          rgba: [[32, 255], [32, 255], [32, 255], 1],
        },
      ],
      [
        0,
        "sinecolor",
        {
          blend: "random",
          channel: [0, 2],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "random",
          size: [1, 5],
          rgba: "randomalpha",
        },
      ],
      [
        0,
        "sinecolor",
        {
          blend: "random",
          channel: [0, 2],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "random",
          size: [1, 5],
          rgba: "randomalpha",
        },
      ],
      [
        0,
        "sinecolor",
        {
          blend: "random",
          channel: [0, 2],
        },
      ],
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
