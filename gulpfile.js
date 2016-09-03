var gulp = require('gulp');
var gulpBrowser = require("gulp-browser");
var babelify = require("babelify");
var del = require('del');
var size = require('gulp-size');

var transforms = [
    {
        transform: "babelify",
        options: {presets: ["react"]}
    }
];

// tasks

gulp.task('transform', function () {
  var stream = gulp.src('./static/jsx/*.js')
    .pipe(gulpBrowser.browserify(transforms))
    .pipe(gulp.dest('./static/js/'))
    .pipe(size());
  return stream;
});

gulp.task('del', function () {
  return del(['./static/js']);
});

gulp.task('default', ['del'], function () {
  gulp.start('transform');
  gulp.watch('./static/jsx/*.js', ['transform']);
});