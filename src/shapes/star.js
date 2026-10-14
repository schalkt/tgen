const drawPolygon = require("./polygon.js");

module.exports = function (tgen) {
  // star
  tgen.shape("star", function ($g, x, y, radius, centered) {
    const cx = centered === true ? x : x + radius;
    const cy = centered === true ? y : y + radius;
    const vertices = [];
    const spikes = 5;
    const innerRadius = radius * 0.45;
    const step = Math.PI / spikes;
    const startAngle = -Math.PI / 2;

    for (let i = 0; i < spikes * 2; i++) {
      const angle = startAngle + i * step;
      const currentRadius = i % 2 === 0 ? radius : innerRadius;
      vertices.push([
        cx + Math.cos(angle) * currentRadius,
        cy + Math.sin(angle) * currentRadius,
      ]);
    }

    drawPolygon($g, vertices);
  });
};
