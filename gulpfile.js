// Load in our dependencies
var gulp = require('gulp');
var gulpLivereload = require('gulp-livereload');
var gulpPug = require('gulp-pug');
var pkg = require('./package.json');
var server = require('./server/index.js');

// Define our tasks
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

gulp.task('build', gulp.parallel('build-html'));

gulp.task('develop', gulp.series('build', function develop () {
  // When one of our source files changes, re-run its task
  gulp.watch('server/views/**/*.pug', gulp.parallel('build-html'));

  // Start our LiveReload server and development server
  gulpLivereload.listen();
  server.start();
}));
