const drawRegularPolygon = require("./regular-polygon.js");

module.exports = function (tgen) {
  // pentagon
  tgen.shape("pentagon", function ($g, x, y, radius, centered) {
    drawRegularPolygon($g, x, y, radius, 5, centered);
  });
};
