(function (tgen) {
  tgen.preset("clouds-emboss", {
    width: 512,
    height: 512,
    items: [
      [0, "clouds"],
      [
        0,
        "clouds",
        {
          blend: "difference",
        },
      ],
      [0, "emboss"],
    ],
  });
})(SeamlessTextureGenerator);
