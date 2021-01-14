(function (tgen) {
  tgen.preset("plasma-shadows", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "subplasma",
        {
          size: [3, 5],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "difference",
          size: [3, 5],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "difference",
          size: [3, 5],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "difference",
          size: [3, 5],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "difference",
          size: [3, 5],
        },
      ],
      [
        0,
        "spheres",
        {
          blend: "multiply",
          dynamic: true,
        },
      ],
      [
        0,
        "brightness",
        {
          adjust: 40,
        },
      ],
      [
        0,
        "contrast",
        {
          adjust: 40,
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
})(SeamlessTextureGenerator);
