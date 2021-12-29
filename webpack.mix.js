const fs = require('fs');
const mix = require('laravel-mix');
const PROD = (process.env.NODE_ENV && process.env.NODE_ENV === 'production');
const package = JSON.parse(fs.readFileSync('./package.json'));
const CompressionPlugin = require('compression-webpack-plugin');

mix.extend('replace', function (webpackConfig, ...args) {

	args[0].forEach(function (item) {	
		let content = fs.readFileSync(item[0]).toString().replace(item[1], item[2]);
		fs.writeFileSync(item[0], content);
	});

});

mix.webpackConfig({
	plugins: [
		PROD ? new CompressionPlugin({
			//asset: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.js$|\.css$|\.html$|\.svg$/,
			threshold: 10240,
			minRatio: 0.8

		}) : () => { }
	],
});

// update version
mix.replace([
	['./src/tgen-base.js', /version\s\d+\.\d+\.\d+/, 'version ' + package.version],
	['./src/tgen-base.js', /version.*"\d+\.\d+\.\d+"/, 'version : "' + package.version + '"']
]);


// tgen
mix.js('src/tgen-base.js', './dist/tgen-with-presets.min.js');
