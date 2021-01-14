(function (tgen) {
  tgen.preset("clouds-color", {
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
      [
        0,
        "clouds",
        {
          blend: "difference",
        },
      ],
      [
        0,
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
      [
        0,
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
        0,
        "vibrance",
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
