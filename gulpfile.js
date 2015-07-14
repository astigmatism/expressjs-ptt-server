var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var packageJSON  = require('./package');
var colors = require('colors');
var jshintConfig = packageJSON.jshintConfig;

var watcher = gulp.watch('./src/**/*.js', ['default']);

gulp.task('default', ['lint'], function() {
  	console.log('Success!'.green);
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter(stylish));
});

watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});