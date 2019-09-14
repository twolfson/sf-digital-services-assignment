// Load in our dependencies
const gulp = require('gulp');
const gulpPug = require('gulp-pug');
const pkg = require('./package.json');

// Define our tasks
exports['build-html'] = function buildHtml () {
  return gulp.src('server/views/**/*.pug')
    .pipe(gulpPug({
      data: {
        pkg
      }
    }))
    .pipe(gulp.dest('build'));
};

exports.build = gulp.parallel(exports['build-html']);
