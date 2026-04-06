module.exports = function (tgen) {
  const drawRegularPolygon = function ($g, x, y, radius, sides, centered) {
    const cx = centered === true ? x : x + radius;
    const cy = centered === true ? y : y + radius;
    const vertices = [];
    const step = (Math.PI * 2) / sides;
    const startAngle = -Math.PI / 2;

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * step;
      const vx = cx + Math.cos(angle) * radius;
      const vy = cy + Math.sin(angle) * radius;

      vertices.push([vx, vy]);
      minX = Math.min(minX, vx);
      maxX = Math.max(maxX, vx);
      minY = Math.min(minY, vy);
      maxY = Math.max(maxY, vy);
    }

    const inside = function (px, py) {
      let isInside = false;

      for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
        const xi = vertices[i][0];
        const yi = vertices[i][1];
        const xj = vertices[j][0];
        const yj = vertices[j][1];

        const intersect =
          yi > py !== yj > py &&
          px < ((xj - xi) * (py - yi)) / ((yj - yi) + Number.EPSILON) + xi;

        if (intersect) {
          isInside = !isInside;
        }
      }

      return isInside;
    };

    const fromX = Math.floor(minX);
    const toX = Math.ceil(maxX);
    const fromY = Math.floor(minY);
    const toY = Math.ceil(maxY);

    for (let iy = fromY; iy <= toY; iy++) {
      for (let ix = fromX; ix <= toX; ix++) {
        if (inside(ix + 0.5, iy + 0.5)) {
          $g.point.set(ix, iy);
        }
      }
    }
  };

  // triangle
  tgen.shape("triangle", function ($g, x, y, radius, centered) {
    drawRegularPolygon($g, x, y, radius, 3, centered);
  });
};
