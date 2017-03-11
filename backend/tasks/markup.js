var gulp = require('gulp');

gulp.task('markup', function() {
  return gulp.src('develop/html/**')
    .pipe(gulp.dest('build'));
});
