const drawRegularPolygon = require("./regular-polygon.js");

module.exports = function (tgen) {
  // diamond
  tgen.shape("diamond", function ($g, x, y, radius, centered) {
    drawRegularPolygon($g, x, y, radius, 4, centered);
  });
};
