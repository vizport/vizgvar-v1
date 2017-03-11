/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp = require('gulp');

gulp.task('watch', ['setWatch', 'browserSync'], function() {
  gulp.watch('develop/sass/**', ['dev-manifest','css']);
  gulp.watch(['develop/images/**', '!develop/images/map/**'], ['dev-manifest','images']);
  gulp.watch('develop/html/**', [ 'dev-manifest' , 'markup']);
});