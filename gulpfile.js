var gulp = require('gulp');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');


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
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});