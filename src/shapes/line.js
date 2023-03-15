module.exports = function (tgen) {
  // line
  tgen.shape("line", function ($g, x1, y1, x2, y2) {
    const d = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    const dx = (x2 - x1) / d;
    const dy = (y2 - y1) / d;

    let x = 0;
    let y = 0;
    let i;

    for (i = 0; i < d; i++) {
      x = x1 + dx * i;
      y = y1 + dy * i;
      $g.point.set(x, y);
    }
  });
};
