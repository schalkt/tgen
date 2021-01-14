(function (tgen) {
  tgen.preset("dunes-magic", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "spheres",
        {
          blend: "lighten",
        },
      ],
      [
        0,
        "spheres",
        {
          blend: ["softlight", "lighten", "lineardodge"],
          dynamic: true,
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
          xamount: [1, 144],
          yamount: [1, 144],
          xchannel: [0, 3],
          ychannel: [0, 3],
          xlayer: 0,
          ylayer: 0,
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
