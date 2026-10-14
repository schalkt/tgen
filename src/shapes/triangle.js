const drawRegularPolygon = require("./regular-polygon.js");

module.exports = function (tgen) {
  // triangle
  tgen.shape("triangle", function ($g, x, y, radius, centered) {
    drawRegularPolygon($g, x, y, radius, 3, centered);
  });
};
