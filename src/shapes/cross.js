const drawPolygon = require("./polygon.js");

module.exports = function (tgen) {
  // cross (plus sign)
  tgen.shape("cross", function ($g, x, y, radius, centered) {
    const cx = centered === true ? x : x + radius;
    const cy = centered === true ? y : y + radius;
    const r = radius;
    const t = radius * 0.33;

    drawPolygon($g, [
      [cx - t, cy - r],
      [cx + t, cy - r],
      [cx + t, cy - t],
      [cx + r, cy - t],
      [cx + r, cy + t],
      [cx + t, cy + t],
      [cx + t, cy + r],
      [cx - t, cy + r],
      [cx - t, cy + t],
      [cx - r, cy + t],
      [cx - r, cy - t],
      [cx - t, cy - t],
    ]);
  });
};
