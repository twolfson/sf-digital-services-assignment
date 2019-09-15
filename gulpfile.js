// Load in our dependencies
var gulp = require('gulp');
var gulpLivereload = require('gulp-livereload');
var gulpPug = require('gulp-pug');
var pkg = require('./package.json');
var rimraf = require('rimraf');
var server = require('./server/index.js');

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
gulp.task('build-js', function buildJs () {
  return gulp.src('browser/js/**/*.js')
    .pipe(gulp.dest('build/js'))
    .pipe(gulpLivereload());
});

gulp.task('build', gulp.series(
  'clean-build',
  gulp.parallel('build-html', 'build-images', 'build-js')
));

gulp.task('develop', gulp.series('build', function develop () {
  // When one of our source files changes, re-run its task
  gulp.watch('browser/images/**/*', gulp.parallel('build-images'));
  gulp.watch('browser/js/**/*', gulp.parallel('build-js'));
  gulp.watch('server/views/**/*.pug', gulp.parallel('build-html'));

  // Start our LiveReload server and development server
  gulpLivereload.listen();
  server.start();
}));
