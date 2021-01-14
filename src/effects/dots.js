(function (tgen) {
  // dots
  tgen.effect(
    "dots",
    {
      blend: "opacity",
      gridX: [2, 64],
      gridY: [2, 64],
      size: [1, 250],
      seed: [1, Number.MAX_SAFE_INTEGER],
      rgba: "randomalpha",
      shape: "sphere",
      dynamic: true,
      xsines: [1, 16],
      ysines: [1, 16],
    },
    function ($g, params) {
      params.gridX = $g.randByArraySeed(params.gridX);
      params.gridY = $g.randByArraySeed(params.gridY);
      params.xsines = $g.randIntByArraySeed(params.xsines, [1, 16]);
      params.ysines = $g.randIntByArraySeed(params.ysines, [1, 16]);
      params.shape = $g.randItemByArraySeed(params.shape, [
        "sphere",
        "pyramid",
        "rect",
        "circle",
      ]);

      var percent = $g.randByArraySeed(params.size) / 100;

      var width = $g.texture.width;
      var height = $g.texture.height;
      var stepX = width / params.gridX;
      var stepY = height / params.gridY;
      var halfstepX = stepX / 2;
      var halfstepY = stepY / 2;

      for (var gx = 1; gx <= params.gridX; gx++) {
        for (var gy = 1; gy <= params.gridY; gy++) {
          //var percent = $g.randByArraySeed(params.size) / 100;
          //var size = (percent * (stepX + stepY) / 2);

          var m = (percent * (stepX + stepY)) / 2 / 2;

          var size =
            m -
            (m / 2) *
              Math.sin((gx / params.gridX) * params.xsines * 2 * $g.calc.pi) +
            (m / 2) *
              Math.sin((gy / params.gridY) * params.ysines * 2 * $g.calc.pi);

          switch (params.shape) {
            case "sphere":
              $g.shape.sphere(
                $g,
                gx * stepX - halfstepX,
                gy * stepY - halfstepY,
                size * 2,
                true,
                params.rgba,
                params.dynamic
              );
              break;
            case "pyramid":
              $g.shape.pyramid(
                $g,
                gx * stepX - halfstepX,
                gy * stepY - halfstepY,
                size,
                size,
                true,
                params.rgba,
                params.dynamic
              );
              break;
            case "rect":
              $g.shape.rect(
                $g,
                gx * stepX - halfstepX,
                gy * stepY - halfstepY,
                size,
                size,
                true,
                params.rgba,
                params.dynamic
              );
              break;
            default:
              size = size / 2;
              $g.shape.circle(
                $g,
                gx * stepX - halfstepX,
                gy * stepY - halfstepY,
                size,
                true
              );
              break;
          }
        }
      }

      return params;
    }
  );
})(SeamlessTextureGenerator);
