// Load in our dependencies
var browserify = require('browserify');
var gulp = require('gulp');
var gulpLivereload = require('gulp-livereload');
var gulpNotify = require('gulp-notify');
var gulpPug = require('gulp-pug');
var gulpSizereport = require('gulp-sizereport');
var gulpUglify = require('gulp-uglify');
var pkg = require('./package.json');
var rimraf = require('rimraf');
var server = require('./server/index.js');
var vinylBuffer = require('vinyl-buffer');
var vinylSourceStream = require('vinyl-source-stream');
var watchify = require('watchify');

// Set up our configuration
var config = {
  allowFailures: false,
  minifyAssets: true
};

// Define our tasks
gulp.task('clean-build', function cleanBuild (cb) {
  rimraf('build', cb);
});

gulp.task('build-html', function buildHtml () {
  return gulp.src('server/views/**/*.pug')
    .pipe(gulpPug({
      data: {
        pkg
      }
    }))
    .pipe(gulp.dest('build'))
    .pipe(gulpLivereload());
});

gulp.task('build-images', function buildImages () {
  return gulp.src('browser/images/**/*')
    .pipe(gulp.dest('build/images'))
    .pipe(gulpLivereload());
});

// https://github.com/substack/node-browserify/tree/12.0.1#api-example
// https://github.com/substack/watchify/tree/v3.6.1#watchifyb-opts
var browserifyObj = browserify({cache: {}, pacakgeCache: {}});
browserifyObj.add(__dirname + '/browser/js/index.js');
gulp.task('build-js', function buildJs () {
  // Generate a stream via browserify
  var jsStream = browserifyObj.bundle();
  if (config.allowFailures) {
    jsStream.on('error', gulpNotify.onError('JS error: <%= error.message %>'));
  }

  // Minify and output our stream
  // DEV: We return the pipe'd stream so gulp knows when we exit
  jsStream = jsStream
    .pipe(vinylSourceStream('index.js')) // Pipe all data into an object for gulp
    .pipe(vinylBuffer());

  // Speed up time in development by skipping asset minification
  if (config.minifyAssets) {
    jsStream = jsStream
      .pipe(gulpUglify())
      .pipe(gulpSizereport({gzip: true}));
  }
  return jsStream
    .pipe(gulp.dest('build/js'))
    .pipe(gulpLivereload());
});

gulp.task('build', gulp.series(
  'clean-build',
  gulp.parallel('build-html', 'build-images', 'build-js')
));

gulp.task('develop', gulp.series('build', function develop () {
  // Set up our tasks to allow failures
  config.allowFailures = true;
  config.minifyAssets = false;

  // When one of our source files changes, re-run its task
  gulp.watch('browser/images/**/*', gulp.parallel('build-images'));
  gulp.watch('browser/js/**/*', gulp.parallel('build-js'));
  gulp.watch('server/views/**/*.pug', gulp.parallel('build-html'));

  // Start our LiveReload server and development server
  gulpLivereload.listen();
  server.start();

  // Utilize watchify to get cached JS compilation
  browserifyObj.plugin(watchify);
  browserifyObj.on('update', gulp.parallel('build-js'));
  // DEV: We need to run `bundle` after our `watchify` is bound in order to register our files
  // DEV: We need to pipe data out of it so we get to an `end` event
browserifyObj.bundle().on('data', function () {});
}));
