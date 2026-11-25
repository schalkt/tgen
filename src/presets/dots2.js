const { build } = require("./dots.js");

module.exports = function (tgen) {
  tgen.preset("dots2", build("random"));
};
