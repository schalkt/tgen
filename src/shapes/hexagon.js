const drawRegularPolygon = require("./regular-polygon.js");

module.exports = function (tgen) {
  // hexagon
  tgen.shape("hexagon", function ($g, x, y, radius, centered) {
    drawRegularPolygon($g, x, y, radius, 6, centered);
  });
};
