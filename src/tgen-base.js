/**
 * tgen.js - the seamless texture generator
 *
 * https://github.com/schalkt/tgen/
 * https://texture-generator.com/
 *
 * @copyright 2015-2022 Tamas Schalk
 * @version 1.4.15
 * @license MIT
 *
 */

var SeamlessTextureGenerator = require("./tgen-base-common");

if (typeof window !== "undefined") {
  window.tgen = SeamlessTextureGenerator;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
  module.exports = SeamlessTextureGenerator;
} else if (typeof define === "function" && define.amd) {
  define([], function () {
    return SeamlessTextureGenerator;
  });
}
