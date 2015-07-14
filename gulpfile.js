var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var packageJSON  = require('./package');
var colors = require('colors');
var size = require('gulp-size');
var notify = require("gulp-notify");
var nodeNotifier = require('node-notifier');
var jshintConfig = packageJSON.jshintConfig;

var js_src = ['./src/**/*.js', './app.js']

var watcher = gulp.watch(js_src, ['default']);

gulp.task('default', ['lint'], function() {
  	
  	console.log('Success!'.green);
  	return true;
});

gulp.task('lint', function() {
  var result = gulp.src(js_src)
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter(stylish))
    // Use gulp-notify as jshint reporter 
    .pipe(notify(function (file) {
      if (file.jshint.success) {
        // Don't show something if success 
        return false;
      }
 
      var errors = file.jshint.results.map(function (data) {
        if (data.error) {
          return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
      }).join("\n");
      return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
    }));
});

gulp.task('size', function() {
	return gulp.src(js_src)
		.pipe(size());
});

watcher.on('change', function(event) {
  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});