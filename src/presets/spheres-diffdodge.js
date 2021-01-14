(function (tgen) {
  tgen.preset("spheres-diffdodge", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "spheres",
        {
          blend: "difference",
          count: [7, 21],
        },
      ],
      [
        0,
        "spheres",
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
    ],
  });
})(SeamlessTextureGenerator);
