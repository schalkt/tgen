const path = require("path");
const fs = require("fs");
const CompressionPlugin = require("compression-webpack-plugin");
const packagejson = JSON.parse(fs.readFileSync("./package.json"));

[
  [
    "./src/tgen-base.js",
    /version\s\d+\.\d+\.\d+/,
    "version " + packagejson.version,
  ],
  [
    "./src/tgen-base-common.js",
    /version\s\d+\.\d+\.\d+/,
    "version " + packagejson.version,
  ],
  [
    "./src/tgen-base-common.js",
    /version\s:\s"\d+\.\d+\.\d+/,
    'version : "' + packagejson.version,
  ],
  [
    "./src/tgen-base-with-presets.js",
    /version\s\d+\.\d+\.\d+/,
    "version " + packagejson.version,
  ],
].forEach(([file, regex, replacement]) => {
  let content = fs.readFileSync(file, "utf8").replace(regex, replacement);
  fs.writeFileSync(file, content);
});

module.exports = {
  mode: "production",
  entry: {
    "tgen.min": "./src/tgen-base.js",
    "tgen-with-presets.min": "./src/tgen-base-with-presets.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new CompressionPlugin({
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$|\.svg$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
