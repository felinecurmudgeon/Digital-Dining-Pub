var gulp = require('gulp');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

var paths = {
  scripts: ['./test/*.js'],
  html: [],
  styles: [],
  test: []
};

gulp.task('karma', shell.task([
  'karma start'
]));

gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['karma', 'lint']);