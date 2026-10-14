const pointInPolygon = function (vertices, px, py) {
  let isInside = false;

  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i][0];
    const yi = vertices[i][1];
    const xj = vertices[j][0];
    const yj = vertices[j][1];

    const intersect =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi + Number.EPSILON) + xi;

    if (intersect) {
      isInside = !isInside;
    }
  }

  return isInside;
};

const drawPolygon = function ($g, vertices) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  for (let i = 0; i < vertices.length; i++) {
    minX = Math.min(minX, vertices[i][0]);
    maxX = Math.max(maxX, vertices[i][0]);
    minY = Math.min(minY, vertices[i][1]);
    maxY = Math.max(maxY, vertices[i][1]);
  }

  const fromX = Math.floor(minX);
  const toX = Math.ceil(maxX);
  const fromY = Math.floor(minY);
  const toY = Math.ceil(maxY);

  for (let iy = fromY; iy <= toY; iy++) {
    for (let ix = fromX; ix <= toX; ix++) {
      if (pointInPolygon(vertices, ix + 0.5, iy + 0.5)) {
        $g.point.set(ix, iy);
      }
    }
  }
};

module.exports = drawPolygon;
