(function (tgen) {
  tgen.preset("checkerboards", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "checkerboard",
        {
          size: 32,
          rgba: "randomalpha",
          blend: "",
        },
      ],
      [
        0,
        "checkerboard",
        {
          size: 16,
          rgba: "randomalpha",
          blend: "opacity",
        },
      ],
      [
        0,
        "checkerboard",
        {
          size: 8,
          rgba: "randomalpha",
          blend: "opacity",
        },
      ],
      [
        0,
        "checkerboard",
        {
          size: 4,
          rgba: "randomalpha",
          blend: "opacity",
        },
      ],
      [
        0,
        "checkerboard",
        {
          size: 2,
          rgba: "randomalpha",
          blend: "opacity",
        },
      ],
      [
        0,
        "sharpen",
        {
          type: 2,
        },
      ],
      [
        0,
        "spheres",
        {
          blend: "random",
          dynamic: true,
        },
      ],
    ],
  });
})(SeamlessTextureGenerator);
