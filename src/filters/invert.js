(function (tgen) {
  // invert
  tgen.filter(
    "invert",
    {
      channels: [1, 1, 1],
    },
    function ($g, params) {
      $g.walk(function (color) {
        return [
          params.channels[0] ? 255 - color[0] : color[0],
          params.channels[1] ? 255 - color[1] : color[1],
          params.channels[2] ? 255 - color[2] : color[2],
          color[3],
        ];
      });

      return params;
    }
  );
})(SeamlessTextureGenerator);
