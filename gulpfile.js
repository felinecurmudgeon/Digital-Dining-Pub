var gulp = require('gulp');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var karma = require('karma').Server;
var jasmine = require('gulp-jasmine');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');

var paths = {
  clientScripts: ['client-mobile/www/js/*.js'],
  serverScripts: ['server/*.js', 'server/**/*.js'],
  html: [],
  styles: [],
  test: []
};

gulp.task('karmaRaw', function(done) {
  return karma.start({
      configFile: __dirname + '/karma.conf.js',
      singleRun: true
    }, done);
});

gulp.task('karmaUgly', function(done) {
  return karma.start({
      configFile: __dirname + '/karma.conf.js',
      files: __dirname + '/dist/',
      singleRun: true
    }, done);
});

gulp.task('jasmine', function () {
  return gulp.src('spec/spec.js')
    .pipe(jasmine());
});

gulp.task('lint', function() {
  return gulp.src(paths.clientScripts.concat(paths.serverScripts))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('compress', function() {
  return gulp.src(paths.clientScripts)
    .pipe(uglify())
    .pipe(gulp.dest('tempDist'));
});

gulp.task('concat', ['compress'], function() {
  return gulp.src('./tempDist/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('cleanMin', ['concat'], function() {
  return gulp.src('tempDist', {read: false})
    .pipe(clean());
});

gulp.task('clean', function () {
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task('uglify', ['compress', 'concat', 'cleanMin']);
gulp.task('test', ['karmaRaw', 'jasmine']);
gulp.task('default', ['karmaRaw', 'jasmine', 'lint']);