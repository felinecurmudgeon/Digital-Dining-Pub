var gulp = require('gulp');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var karma = require('karma').Server;
var jasmine = require('gulp-jasmine');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var jscs = require('gulp-jscs');

var paths = {
  clientScripts: ['client-mobile/www/js/*.js', 'client/*.js', 'client/app/*.js', 'client/app/**/*.js'],
  serverScripts: ['server/*.js', 'server/**/*.js'],
  html: [],
  styles: [],
  test: []
};

gulp.doneCallback = function (err) {
  process.exit(err ? 1 : 0);
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
 
gulp.task('style', function() {
  return gulp.src(paths.clientScripts.concat(paths.serverScripts))
    .pipe(jscs())
    .pipe(jscs.reporter())
    .pipe(jscs.reporter('fail'));
});

gulp.task('jasmine', function () {
  return gulp.src('spec/server/restaurantMenuSpec.js')
    .pipe(jasmine());
});

gulp.task('dummydata', function () {
  var dummydata = require('./spec/dummyData.js');
  return dummydata.emptyAndRepopulateDB()
    .then(function () {
      dummydata.endDBConnexion();
    });
});

gulp.task('uglify', ['compress', 'concat', 'cleanMin']);
gulp.task('test', ['jasmine']);
gulp.task('default', ['karmaRaw', 'jasmine', 'lint']);
