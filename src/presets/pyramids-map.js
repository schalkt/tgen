(function (tgen) {
  tgen.preset("pyramids-map", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "pyramids",
        {
          blend: "difference",
          count: [7, 21],
        },
      ],
      [
        0,
        "pyramids",
        {
          blend: "lineardodge",
          count: [4, 7],
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
      [1, "copy", 0],
      [
        1,
        "map",
        {
          xamount: [44, 77],
          yamount: [77, 121],
          xchannel: [0, 3],
          ychannel: [0, 3],
          xlayer: [0, 1],
          ylayer: [0, 1],
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
