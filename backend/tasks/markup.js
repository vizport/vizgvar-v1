var gulp = require('gulp');
var jsonminify = require('gulp-jsonminify');

gulp.task('markup', function() {

	gulp.src(['develop/json/**'])
	    .pipe(gulp.dest('build'));

  return gulp.src('develop/html/**')
    .pipe(gulp.dest('build'));
});
