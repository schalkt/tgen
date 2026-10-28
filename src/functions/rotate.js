module.exports = function (tgen) {
  tgen.function(
    "rotate",
    {
      seed: null,
      angle: 90,
      times: [1, 3],
      type: 1,
      fade: 0, // type 2: fade out toward the edges, in percent of the size
      blend: tgen.blendSafe(),
    },
    function ($g, params) {
      params.type = $g.randByArraySeed(params.type);

      if (params.angle === null) {
        params.angle = $g.randItemByArraySeed(params.angle, [90, 180, 270]);
      } else {
        params.angle = $g.randByArraySeed(params.angle);
      }

      params.times = $g.randByArraySeed(params.times);
      params.fade = $g.randByArraySeed(params.fade);

      const buffer = new $g.buffer();
      const width = $g.texture.width;
      const height = $g.texture.height;

      let rad = params.angle * (Math.PI / 180);
      let size = $g.texture.size();
      const fadeSize = (Math.max(0, params.fade) / 100) * Math.min(width, height);

      let i, x, y, rgba, rgba1, rgba2, offset, newX, newY, edge, w;

      const rotateType1 = function () {
        for (x = 0; x < width; x++) {
          for (y = 0; y < height; y++) {
            newX = Math.ceil(Math.cos(rad) * x - Math.sin(rad) * y);
            newY = Math.ceil(Math.sin(rad) * x + Math.cos(rad) * y);

            rgba1 = $g.point.get(x, y);
            rgba2 = $g.point.get(newX, newY);
            rgba = $g.blend(params.blend, rgba2, rgba1);

            offset = $g.texture.offset(x, y);
            buffer.data[offset] = rgba[0];
            buffer.data[offset + 1] = rgba[1];
            buffer.data[offset + 2] = rgba[2];
            buffer.data[offset + 3] = rgba[3];
          }
        }

        while (size--) {
          $g.texture.data[size] = buffer.data[size];
        }
      };

      // the rotated source pixel blended onto the target pixel; inverse
      // mapping, so every target pixel is written (no blank pixels)
      const rotateType2 = function () {
        for (x = 0; x < width; x++) {
          for (y = 0; y < height; y++) {
            newX = Math.ceil(Math.cos(rad) * x + Math.sin(rad) * y);
            newY = Math.ceil(Math.cos(rad) * y - Math.sin(rad) * x);

            rgba1 = $g.point.get(newX, newY);
            rgba2 = $g.point.get(x, y);
            rgba = $g.blend(params.blend, rgba2, rgba1);

            // near the edges keep more of the original pixel, the edge
            // pixels stay untouched, so the texture stays seamless there
            if (fadeSize > 0) {
              edge = Math.min(x, width - 1 - x, y, height - 1 - y);
              w = Math.min(1, edge / fadeSize);
              w = w * w * (3 - 2 * w);
              rgba = [
                rgba2[0] + (rgba[0] - rgba2[0]) * w,
                rgba2[1] + (rgba[1] - rgba2[1]) * w,
                rgba2[2] + (rgba[2] - rgba2[2]) * w,
                rgba2[3] + (rgba[3] - rgba2[3]) * w,
              ];
            }

            offset = $g.texture.offset(x, y);
            buffer.data[offset] = rgba[0];
            buffer.data[offset + 1] = rgba[1];
            buffer.data[offset + 2] = rgba[2];
            buffer.data[offset + 3] = rgba[3];
          }
        }

        while (size--) {
          $g.texture.data[size] = buffer.data[size];
        }
      };

      // before 2.0: forward mapping, the rotated grid misses target pixels,
      // they stay blank - kept for params saved with 1.x
      const rotateType2Legacy = function () {
        for (x = 0; x < width; x++) {
          for (y = 0; y < height; y++) {
            newX = Math.ceil(Math.cos(rad) * x - Math.sin(rad) * y);
            newY = Math.ceil(Math.sin(rad) * x + Math.cos(rad) * y);

            rgba1 = $g.point.get(x, y);
            rgba2 = $g.point.get(newX, newY);
            rgba = $g.blend(params.blend, rgba2, rgba1);

            offset = $g.texture.offset(newX, newY);

            buffer.data[offset] = rgba[0];
            buffer.data[offset + 1] = rgba[1];
            buffer.data[offset + 2] = rgba[2];
            buffer.data[offset + 3] = rgba[3];
          }
        }
        while (size--) {
          $g.texture.data[size] = buffer.data[size];
        }
      };

      for (i = 1; i <= params.times; i++) {
        size = $g.texture.size();
        rad = i * params.angle * (Math.PI / 180);

        if (params.type === 1) {
          rotateType1();
        } else if ($g.legacy) {
          rotateType2Legacy();
        } else {
          rotateType2();
        }
      }

      return params;
    }
  );
};
