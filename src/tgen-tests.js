module.exports = function (tgen) {
  // pattern test
  tgen.effect("test-pattern", {}, function ($g, params) {
    const width = $g.texture.width;
    const height = $g.texture.height;

    let s;

    $g.point.blend = "opacity";

    // clear texture
    $g.texture.clear();

    $g.point.rgba = [255, 255, 155, 255];
    $g.shape.rect($g, 1, 1, width - 2, height - 2);

    s = 20;
    $g.point.rgba = [0, 150, 0, 153];
    $g.shape.rect($g, 2, 2, s, s);
    $g.shape.rect($g, width - s - 2, 2, s, s);
    $g.shape.rect($g, 2, height - 2 - s, s, s);
    $g.shape.rect($g, width - 2 - s, height - 2 - s, s, s);

    $g.point.rgba = [20, 20, 10, 51];
    $g.shape.rect($g, width / 2, height / 2, 178, 178, true);

    $g.point.rgba = [10, 20, 210, 178];
    $g.shape.rect($g, width - 5, height - 5, 10, 10);

    s = 20;
    $g.point.rgba = [10, 10, 210, 250];
    $g.shape.line($g, s, s, width - s, height - s);
    $g.shape.line($g, width - s, s, s, height - s);
    $g.shape.line($g, 0, height / 2, width, height / 2);
    $g.shape.line($g, width / 2, 0, width / 2, height);

    $g.point.rgba = [255, 55, 55, 128];
    $g.shape.rect($g, 10, 10, width - 20, height - 20);

    $g.point.rgba = [0, 0, 255, 76];
    $g.shape.rect($g, width - 2, height - 2, 4, 4);

    $g.point.rgba = [255, 255, 255, 255];
    $g.point.set(0, 0);
    $g.point.set(width - 1, 0);
    $g.point.set(0, height - 1);
    $g.point.set(width - 1, height - 1);

    $g.point.rgba = [25, 25, 0, 51];
    $g.shape.circle($g, width / 4, height / 4, width / 4, true);

    $g.point.rgba = [255, 255, 0, 25];
    $g.shape.circle($g, width, height, width, true);

    $g.shape.sphere(
      $g,
      width / 4,
      height - height / 4,
      width / 2,
      true,
      [255, 0, 0, 0],
      true
    );
    $g.shape.sphere(
      $g,
      width / 2,
      height - height / 4,
      width / 2,
      true,
      [0, 255, 0, 0],
      true
    );
    $g.shape.sphere(
      $g,
      width - width / 4,
      height - height / 4,
      width / 2,
      true,
      [255, 255, 255, 0],
      true
    );
    $g.shape.pyramid(
      $g,
      width - width / 4,
      height / 4,
      width / 2,
      height / 2,
      true,
      [0, 0, 0, 255],
      true
    );

    $g.do("brightness", { adjust: 50 });
    $g.do("vibrance", { adjust: 100 });
    $g.do("contrast", { adjust: 20 });

    return params;
  });

  // all effect test with custom blends
  tgen.effect("test-all", {}, function ($g, params) {
    $g.normalize = "limitless";

    let effectName;
    let layer = 0;

    const skipped = ["test-all", "test-pattern", "copy", "merge", "mergeall"];

    for (let key in $g.effects) {
      effectName = $g.effects[key];

      if (skipped.indexOf(effectName) < 0) {
        $g.do(effectName);
        $g.layers[layer++] = $g.texture.export();
      }
    }

    return params;
  });
};
