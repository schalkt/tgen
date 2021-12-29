module.exports = function (tgen) {
  tgen.preset("checkerboards2", {
    width: 256,
    height: 256,
    items: [
      [
        0,
        "checkerboard",
        {
          size: [
            [17, 32],
            [17, 32],
          ],
          rgba: "randomalpha",
          blend: "",
        },
      ],
      [
        0,
        "checkerboard",
        {
          size: [
            [9, 16],
            [9, 16],
          ],
          rgba: "randomalpha",
          blend: "random",
        },
      ],
      [
        0,
        "checkerboard",
        {
          size: [
            [5, 8],
            [5, 8],
          ],
          rgba: "randomalpha",
          blend: "random",
        },
      ],
      [
        0,
        "checkerboard",
        {
          size: [
            [2, 4],
            [2, 4],
          ],
          rgba: "randomalpha",
          blend: "random",
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
          opacity: 255,
        },
      ],
    ],
  });
};
