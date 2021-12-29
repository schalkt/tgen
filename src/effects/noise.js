module.exports = function (tgen) {
  // noise
  tgen.effect(
    "noise",
    {
      seed: null,
      blend: "lighten",
      mode: "monochrome", // monochrome or color
      channels: [255, 255, 255], // max rgb per channels in color mode
      opacity: 128,
    },
    function ($g, params) {
      switch (params.mode) {
        case "color":
          $g.walk(function (color) {
            var r = params.channels[0]
              ? $g.randIntSeed(0, params.channels[0])
              : 0;
            var g = params.channels[1]
              ? $g.randIntSeed(0, params.channels[1])
              : 0;
            var b = params.channels[2]
              ? $g.randIntSeed(0, params.channels[2])
              : 0;
            color = [r, g, b, params.opacity];
            return color;
          });
          break;

        case "monochrome":
          $g.walk(function (color) {
            var rnd = $g.randIntSeed(0, 255);
            color = [rnd, rnd, rnd, params.opacity];
            return color;
          });
          break;

        case "colorize":
          $g.walk(function (color) {
            var rnd = $g.randIntSeed(0, 255);
            color = $g.point.colorize(
              [rnd, rnd, rnd, params.opacity],
              params.rgba
            );
            return color;
          });
          break;
      }

      return params;
    }
  );
};
