// Load in our dependencies
const gulp = require('gulp');
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
    .pipe(gulp.dest('build'));
});

gulp.task('build', gulp.parallel('build-html'));