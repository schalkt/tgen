(function (tgen) {
  tgen.preset("waves-cool-rotate", {
    width: 512,
    height: 512,
    items: [
      [
        0,
        "spheres",
        {
          blend: "lighten",
          origin: "random",
          dynamic: false,
          count: 21,
          size: [20, 70],
        },
      ],
      [
        0,
        "spheres",
        {
          blend: "lineardodge",
          origin: "random",
          dynamic: true,
          count: 21,
          size: [20, 70],
        },
      ],
      [
        0,
        "waves",
        {
          blend: "softlight",
          level: 50,
          xsines: 20,
          ysines: 1,
        },
      ],
      [
        0,
        "waves",
        {
          blend: "softlight",
          level: 50,
          xsines: 20,
          ysines: 1,
        },
      ],
      [
        0,
        "map",
        {
          xamount: [21, 121],
          yamount: [21, 121],
          xchannel: 0,
          ychannel: 2,
          xlayer: 0,
          ylayer: 0,
        },
      ],
      [null, "copy", {}],
      [
        null,
        "rotate",
        {
          type: 1,
          angle: 90,
          times: [1, 3],
          blend: "random",
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
