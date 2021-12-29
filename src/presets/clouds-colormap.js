module.exports = function (tgen) {
  tgen.preset("clouds-colormap", {
    width: 512,
    height: 512,
    items: [
      [0, "fill"],
      [
        0,
        "clouds",
        {
          blend: "difference",
        },
      ],
      [1, "copy", 0],
      [
        1,
        "clouds",
        {
          blend: "difference",
        },
      ],
      [2, "copy", 1],
      [
        2,
        "clouds",
        {
          blend: [
            "exclusion",
            "lighten",
            "darken",
            "overlay",
            "screen",
            "linearlight",
            "lineardodge",
          ],
        },
      ],
      [3, "copy", 2],
      [
        3,
        "spheres",
        {
          blend: "softlight",
          rgba: "random",
          count: [7, 21],
          size: [20, 70],
          dynamic: true,
        },
      ],
      [
        3,
        "map",
        {
          xamount: [14, 121],
          yamount: [14, 121],
          xchannel: [0, 3],
          ychannel: [0, 3],
          xlayer: [0, 3],
          ylayer: [0, 3],
        },
      ],
      [
        3,
        "vibrance",
        {
          adjust: 20,
        },
      ],
      [
        3,
        "contrast",
        {
          adjust: 20,
        },
      ],
    ],
  });
};
