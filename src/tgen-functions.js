module.exports = function (tgen) {
  // layer copy to the current layer
  tgen.function(
    "copy",
    {
      layer: null,
    },
    function ($g, params) {
      if (typeof params == "number") {
        params = {
          layer: params,
        };
      }

      if (params.layer === null) {
        params.layer = $g.layers.length - 1;
      }

      if ($g.layers[params.layer] != undefined) {
        $g.texture.data = $g.layerCopy(params.layer);
      }

      return params;
    }
  );

  // merge all layers
  tgen.function(
    "mergeall",
    {
      blend: "opacity",
      firstcopy: true,
      opacity: null,
    },
    function ($g, params) {
      var length = $g.layers.length;

      for (var i = 0; i <= length; i++) {
        //var imageData = $g.layers[i];

        if (i === 0 && params.firstcopy === true) {
          $g.do("copy", {
            layer: 0,
          });
        } else {
          $g.do("merge", {
            blend: params.blend,
            layer: i,
            opacity: params.opacity,
          });
        }
      }

      return params;
    }
  );

  // merge one or more layer
  tgen.function(
    "merge",
    {
      blend: "opacity",
      opacity: null,
      layer: 0,
    },
    function ($g, params) {
      if ($g.layers[params.layer] === undefined) {
        return params;
      }

      var imageData = $g.layers[params.layer];

      for (var y = 0; y < $g.texture.height; y++) {
        for (var x = 0; x < $g.texture.width; x++) {
          var offset = $g.texture.offset(x, y);

          $g.point.rgba = [
            imageData[offset],
            imageData[offset + 1],
            imageData[offset + 2],
            params.opacity ? params.opacity : imageData[offset + 3],
          ];

          $g.point.set(x, y);
        }
      }

      return params;
    }
  );

  // map effect - aDDict2
  tgen.function(
    "map",
    {
      seed: null,
      xamount: [4, 512],
      yamount: [4, 512],
      xchannel: [0, 2], // 0=r, 1=g, 2=b, 3=a
      ychannel: [0, 2], // 0=r, 1=g, 2=b, 3=a
      xlayer: 0,
      ylayer: 0,
    },
    function ($g, params) {
      params.xamount = $g.randByArraySeed(params.xamount);
      params.yamount = $g.randByArraySeed(params.yamount);
      params.xchannel = $g.randByArraySeed(params.xchannel);
      params.ychannel = $g.randByArraySeed(params.ychannel);
      params.xlayer = $g.randByArraySeed(params.xlayer);
      params.ylayer = $g.randByArraySeed(params.ylayer);

      var buffer = new $g.buffer();

      var width = $g.texture.width;
      var height = $g.texture.height;
      var size = $g.texture.size();
      var ximageData = $g.layers[params.xlayer];
      var yimageData = $g.layers[params.ylayer];
      var x, y, ox, oy, rgba, offset, sx, sy;

      if (!ximageData || !ximageData[0]) {
        return;
      }

      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          offset = $g.texture.offset(x, y);
          sx = ximageData[offset + params.xchannel];
          sy = yimageData[offset + params.ychannel];

          if (width % 16 == 0) {
            ox = $g.wrapx(x + ((sx * params.xamount * width) >> 16));
          } else {
            ox = x + (sx * params.xamount * width) / (width * width);
          }

          if (height % 16 == 0) {
            oy = $g.wrapy(y + ((sy * params.yamount * height) >> 16));
          } else {
            oy = y + (sy * params.yamount * height) / (height * height);
          }

          rgba = $g.point.get(ox, oy);

          buffer.data[offset] = rgba[0];
          buffer.data[offset + 1] = rgba[1];
          buffer.data[offset + 2] = rgba[2];
          buffer.data[offset + 3] = rgba[3];
        }
      }

      while (size--) {
        $g.texture.data[size] = buffer.data[size];
      }

      return params;
    }
  );

  tgen.function(
    "rotate",
    {
      seed: null,
      angle: 90,
      times: [1, 3],
      type: 1,
      blend: tgen.blendSafe,
    },
    function ($g, params) {
      params.type = $g.randByArraySeed(params.type);

      if (params.angle === null) {
        params.angle = $g.randItemByArraySeed(params.angle, [90, 180, 270]);
      } else {
        params.angle = $g.randByArraySeed(params.angle);
      }

      params.times = $g.randByArraySeed(params.times);

      var buffer = new $g.buffer();
      var size = $g.texture.size();
      var width = $g.texture.width;
      var height = $g.texture.height;
      var rad = params.angle * (Math.PI / 180);
      var x, y, rgba, rgba1, rgba2, offset, newX, newY;

      var rotateType1 = function () {
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

      var rotateType2 = function () {
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

      for (var i = 1; i <= params.times; i++) {
        size = $g.texture.size();
        rad = i * params.angle * (Math.PI / 180);

        if (params.type === 1) {
          rotateType1();
        } else {
          rotateType2();
        }
      }

      return params;
    }
  );

  tgen.function(
    "rot90",
    {
      seed: null,
      times: [1, 3],
      blend: tgen.blendSafe,
    },
    function ($g, params) {
      params.type = 1;
      params.angle = 90;

      tgen.effects["rotate"]($g, params);

      return params;
    }
  );

  // WIP - equirectangular
  // https://stackoverflow.com/questions/51869432/converting-360-degree-view-to-equirectangular-in-node-js

  tgen.function(
    "equirectangular",
    {
      layer: null,
    },
    function ($g, params) {
      if (params.layer === null) {
        params.layer = $g.layers.length - 1;
      }

      var buffer = new $g.buffer();
      var width = $g.texture.width;
      var height = $g.texture.height;
      var x, y, rgba, offset, theta_deg, phi_deg, r, dx, dy, inputx, inputy;

      var radius = height / 2;
      var PI = Math.PI;
      var centerx = width / 2;
      var centery = height / 2;

      for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
          theta_deg = 360 - (x * 360) / width - 180;
          phi_deg = 180 - (y * 180) / height;
          r = Math.sin((phi_deg * PI) / 180);
          dx = Math.cos((theta_deg * PI) / 180) * r;
          dy = Math.sin((theta_deg * PI) / 180) * r;
          inputx = Math.round(dx * radius + centerx);
          inputy = Math.round(dy * radius + centery);

          rgba = $g.point.get(inputx, inputy);

          // 32 32 180 90 1 1.2246467991473532e-16 -1 32 0
          //console.log(x, y, theta_deg, phi_deg, r, dx, dy, inputx, inputy);

          offset = $g.texture.offset(x, y);
          buffer.data[offset] = rgba[0];
          buffer.data[offset + 1] = rgba[1];
          buffer.data[offset + 2] = rgba[2];
          buffer.data[offset + 3] = rgba[3];
        }
      }

      var size = $g.texture.size();
      while (size--) {
        $g.texture.data[size] = buffer.data[size];
      }

      return params;
    }
  );
};
