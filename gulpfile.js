// Load in our dependencies
const gulp = require('gulp');
const gulpLivereload = require('gulp-livereload');
const gulpPug = require('gulp-pug');
const pkg = require('./package.json');

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

  // Start our LiveReload server
  gulpLivereload();
}));
