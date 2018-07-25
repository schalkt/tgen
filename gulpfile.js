var gulp         = require('gulp'),
	rename       = require('gulp-rename'),
	debug        = require("gulp-debug"),
	order        = require("gulp-order"),
	concat       = require('gulp-concat'),
	runSequence  = require('run-sequence'),
	uglify       = require('gulp-uglify'),
	gzip         = require('gulp-gzip'),
	gutil        = require('gulp-util');


var DIST = "dist";
var SRC = "src";
var PROD = false;

var nanoOptions = {
	safe: true,
	discardComments: {
		removeAll: true
	}
};

var banner = ['/**',
	' * <%= pkg.name %> - <%= pkg.description %>',
	' * ',
	' * @version v<%= pkg.version %>',
	' * @link <%= pkg.homepage %>',
	' * @license <%= pkg.license %>',
	' */',
	''].join('\n');


gulp.task("js", [], function () {

	var filename = "tgen.js";
	var header = require('gulp-header');
	var package = require('./package.json');

	return gulp.src([
		SRC + "/*.js"
	])
		.pipe(order([
			"tgen-base.js"
		], {
			base: SRC
		}))
		.pipe(concat(filename))
		.pipe(gulp.dest(DIST))
		.pipe(debug());

});


gulp.task("js-min", function () {

	var filename = "tgen.js";
	var header = require('gulp-header');
	var package = require('./package.json');

	return gulp.src([
		DIST + "/" + filename,
	])
		.pipe(concat(filename))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify().on('error', function (err) {
			gutil.log(gutil.colors.red('[Error]'), err.toString());
			this.emit('end');
		}))
		.pipe(header(banner, {pkg: package}))
		.pipe(gulp.dest(DIST))
		.pipe(debug())
		.pipe(gzip({append: true}))
		.pipe(gulp.dest(DIST))
		.pipe(debug());

});

gulp.task("watch", function () {

	var watch = require("gulp-watch");
	var batch = require("gulp-batch");

	watch(SRC + "/*.js", batch(function (events, done) {
		gulp.start("js", done);
	}));

});


gulp.task('bump', function () {

	var bump = require('gulp-bump');

	return gulp.src(['./package.json'])
		.pipe(bump({type: 'patch', indent: 4}))
		.pipe(gulp.dest('./'));

});


gulp.task('version', function (callback) {

	var package = require('./package.json');
	var replace = require('gulp-replace');

	//version: '0.6.0',

	return gulp.src([
		SRC + '/tgen-base.js',
	])
		.pipe(replace(/version:\s'\d+\.\d+\.\d+/g, "version: '" + package.version))
		.pipe(gulp.dest(SRC))
		.pipe(debug());

});

gulp.task('dev', function (callback) {

	prod = false;

	runSequence(
		["js"],
		callback
	);

});

gulp.task('prod', function (callback) {

	prod = true;

	runSequence(
		["bump"],
		["version"],
		["js"],
		["js-min"],
		callback
	);

});

gulp.task('default', function (callback) {
	console.log('Try "gulp dev" or "gulp prod"');
});
