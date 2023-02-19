module.exports = function (tgen) {
  require("./copy.js")(tgen);
  require("./equirectangular.js")(tgen);
  require("./map.js")(tgen);
  require("./merge.js")(tgen);
  require("./mergeall.js")(tgen);
  require("./rotate.js")(tgen);
  require("./rot90.js")(tgen);  
};
