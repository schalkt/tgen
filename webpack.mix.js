const fs = require("fs");
const mix = require("laravel-mix");
const package = JSON.parse(fs.readFileSync("./package.json"));
const CompressionPlugin = require("compression-webpack-plugin");

mix.disableNotifications();

mix.extend("replace", function (webpackConfig, ...args) {
  args[0].forEach(function (item) {
    let content = fs.readFileSync(item[0]).toString().replace(item[1], item[2]);
    fs.writeFileSync(item[0], content);
  });
});

// update version
mix.replace([
  [
    "./src/tgen-base.js",
    /version\s\d+\.\d+\.\d+/,
    "version " + package.version,
  ],
  [
    "./src/tgen-base-common.js",
    /version\s\d+\.\d+\.\d+/,
    "version " + package.version,
  ],
  [
    //version : "1.4.10",
    // version: "1.4.13",
    "./src/tgen-base-common.js",
    /version:\s"\d+\.\d+\.\d+/,
    'version : "' + package.version,
  ],
  [
    "./src/tgen-base-with-presets.js",
    /version\s\d+\.\d+\.\d+/,
    "version " + package.version,
  ],
]);

mix.webpackConfig({
  plugins: [
    mix.inProduction
      ? new CompressionPlugin({
          //asset: "[path].gz[query]",
          algorithm: "gzip",
          test: /\.js$|\.css$|\.html$|\.svg$/,
          threshold: 10240,
          minRatio: 0.8,
        })
      : () => {},
  ],
});

// tgen
mix.js("src/tgen-base.js", "./dist/tgen.min.js");
mix.js("src/tgen-base-with-presets.js", "./dist/tgen-with-presets.min.js");
