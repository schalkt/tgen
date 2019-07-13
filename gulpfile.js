/*jshint esversion: 6 */

const gulp = require('gulp');
const gzip = require('gulp-gzip');
const bump = require('gulp-bump');
const uglify = require('gulp-uglify');
const replace = require('gulp-replace');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const order = require("gulp-order");
const header = require('gulp-header');

var DIST = "dist";
var SRC = "src";
var PROD = false;

var banner = ['/**',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * ',
	' * @version v<%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @license <%= pkg.license %>',
	' */',
	''].join('\n');


function js() {

	var filename = "tgen.js";

	return gulp.src([
		SRC + "/*.js"
	])
		.pipe(order([
			"tgen-base.js"
		], {
				base: SRC
			}))
		.pipe(concat(filename))
		.pipe(gulp.dest(DIST));

}

function jsMin() {

	var filename = "tgen.js";
	var package = require('./package.json');

	return gulp.src([
		DIST + "/" + filename,
	])
		.pipe(concat(filename))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(header(banner, { pkg: package }))
		.pipe(gulp.dest(DIST))
		.pipe(gzip({ append: true }))
		.pipe(gulp.dest(DIST));

}


function patch() {

	return gulp.src(['./package.json'])
		.pipe(bump({ type: 'patch', indent: 4 }))
		.pipe(gulp.dest('./'));

}


function version() {

	var package = require('./package.json');

	return gulp.src([
		SRC + '/tgen-base.js',
	])
		.pipe(replace(/version:\s'\d+\.\d+\.\d+/g, "version: '" + package.version))
		.pipe(gulp.dest(SRC));

}


gulp.task('watch', function () {
	gulp.watch(SRC + "/*.js" , gulp.series(js));
});

gulp.task('dev', gulp.series(
	function (cb) {
		PROD = false;
		cb();
	},
	js
));



gulp.task('prod', gulp.series(
	function (cb) {
		PROD = true;
		cb();
	},
	patch,
	version,
	js,
	jsMin
));


gulp.task('default', function (callback) {
	console.log('Try "gulp dev" or "gulp prod"');
});
