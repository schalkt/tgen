module.exports = function (tgen) {
  tgen.preset("z-dev-mandel", {
    width: 256,
    height: 256,

    items: [
      [0, "fill", { rgba: [0, 0, 0] }],
      [
        0,
        "mandelbrot",
        {
          blend: "opacity",
          rgba: [255, 255, 255, 255],
          colormap: "random",
          iteration: [120, 300],
          threshold: 2,
          size: [1200, 1600],
        },
      ]     
    ],
  });
};
