const drawPolygon = require("./polygon.js");

const drawRegularPolygon = function ($g, x, y, radius, sides, centered) {
  const cx = centered === true ? x : x + radius;
  const cy = centered === true ? y : y + radius;
  const vertices = [];
  const step = (Math.PI * 2) / sides;
  const startAngle = -Math.PI / 2;

  for (let i = 0; i < sides; i++) {
    const angle = startAngle + i * step;
    vertices.push([
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius,
    ]);
  }

  drawPolygon($g, vertices);
};

module.exports = drawRegularPolygon;
