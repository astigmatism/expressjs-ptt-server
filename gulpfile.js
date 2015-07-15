var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var packageJSON  = require('./package');
var colors = require('colors');
var size = require('gulp-size');
var notify = require("gulp-notify");
var nodeNotifier = require('node-notifier');
var jscs = require('gulp-jscs');
var runSequence = require('run-sequence');

var jshintConfig = packageJSON.jshintConfig;

var js_src = ['./src/**/*.js', './app.js']


var watcher = gulp.watch(js_src, ['watch']);



gulp.task('default', function() {
  	
  	runSequence('jscsfixjustwhitespace', 'lint', 'jscs', function() {
		console.log('Success!'.green);
		return true;
	});
  	return false;
});


gulp.task('watch', function() {
	//run these sequences in this order:
	runSequence('jscsfixjustwhitespace', 'lint', 'jscs', function() {
		return;
	});
});


gulp.task('jscs', function() {
  return gulp.src(js_src)
    .pipe(jscs());
});

function jscsErrorHandler(error) {
    console.log(error.toString());
    this.emit('end');
}

gulp.task('jscsfixjustwhitespace', function() {
	// See here for why I specified a base: http://stackoverflow.com/a/24412960/3595355
  	//return gulp.src(js_src, {base: './'})
  	return gulp.src(js_src)
    .pipe(jscs({
        fix: true,
        // The following won't work until the issue is fixed on github.
        // https://github.com/jscs-dev/node-jscs/pull/1479
        // disallowTrailingWhitespace: true,
        requireLineFeedAtFileEnd: true,
        validateIndentation: 4
    }))
    .on('error', jscsErrorHandler)
    .pipe(gulp.dest('./'));
});

gulp.task('jscsfixall', function() {
  // See here for why I specified a base: http://stackoverflow.com/a/24412960/3595355
  //return gulp.src(js_src, {base: './'})
  return gulp.src(js_src)
    .pipe(jscs({
        configPath: './.jscsrc', // it seems you need to specify your config path when you have fix set to true
        fix: true
    }))
    .on('error', jscsErrorHandler)
    .pipe(gulp.dest('./'));
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

	console.log('\n\n');
    console.log('-------------------------------------------------------------------------------');
    console.log('-------------------------------New Gulp run below------------------------------');
    console.log('-------------------------------------------------------------------------------');
    console.log('\n\n');
  	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});