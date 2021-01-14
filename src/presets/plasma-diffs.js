(function (tgen) {
  tgen.preset("plasma-diffs", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "subplasma",
        {
          size: [1, 4],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "difference",
          size: [1, 4],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "difference",
          size: [1, 4],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "difference",
          size: [1, 4],
        },
      ],
      [
        0,
        "subplasma",
        {
          blend: "difference",
          size: [1, 4],
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
