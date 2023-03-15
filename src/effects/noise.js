module.exports = function (tgen) {
  // noise
  tgen.effect(
    "noise",
    {
      seed: null,
      mode: null,
      blend: "lighten",
      channels: [255, 255, 255], // max rgb per channels in color mode
      opacity: 128,
    },
    function ($g, params) {
      let r, g, b, rnd;

      if (!params.mode) {
        params.mode = $g.randItemSeed(["monochrome", "color"]);
      }

      switch (params.mode) {
        case "color":
          $g.walk(function (color) {
            r = params.channels[0] ? $g.randIntSeed(0, params.channels[0]) : 0;
            g = params.channels[1] ? $g.randIntSeed(0, params.channels[1]) : 0;
            b = params.channels[2] ? $g.randIntSeed(0, params.channels[2]) : 0;
            color = [r, g, b, params.opacity];
            return color;
          });
          break;

        case "monochrome":
          $g.walk(function (color) {
            rnd = $g.randIntSeed(0, 255);
            color = [rnd, rnd, rnd, params.opacity];
            return color;
          });
          break;

        case "colorize":
          $g.walk(function (color) {
            rnd = $g.randIntSeed(0, 255);
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
