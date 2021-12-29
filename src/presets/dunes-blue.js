module.exports = function (tgen) {
  tgen.preset("dunes-blue", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "pyramids",
        {
          blend: "lighten",
          rgba: [
            [0, 10],
            [20, 80],
            [150, 255],
            [0.7, 1],
          ],
        },
      ],
      [
        0,
        "pyramids",
        {
          blend: "lineardodge",
          dynamic: true,
          rgba: [170, 170, 170, [0.7, 1]],
        },
      ],
      [
        0,
        "waves",
        {
          blend: "softlight",
        },
      ],
      [
        0,
        "waves",
        {
          blend: "softlight",
        },
      ],
      [
        0,
        "map",
        {
          xamount: [10, 144],
          yamount: [10, 144],
          xchannel: [0, 3],
          ychannel: [0, 3],
          xlayer: 0,
          ylayer: 0,
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
          adjust: 30,
        },
      ],
    ],
  });
};
