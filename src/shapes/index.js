module.exports = function (tgen) {
  require("./circle.js")(tgen);
  require("./colorline.js")(tgen);
  require("./hexagon.js")(tgen);
  require("./line.js")(tgen);
  require("./pentagon.js")(tgen);
  require("./pyramid.js")(tgen);
  require("./rect.js")(tgen);
  require("./sphere.js")(tgen);
  require("./star.js")(tgen);
  require("./triangle.js")(tgen);
};
