var gulp = require('gulp');

var manifest = require("gulp-manifest");

gulp.task('dev-manifest', function(){
  gulp.src(['build/*'])
    .pipe(manifest({
      hash: true,
      preferOnline: true,
      network: ['http://*', 'https://*','*'],
      filename: 'manifest.appcache',
      exclude: ['manifest.appcache',"online.html"]
     }))
    .pipe(gulp.dest('build'));
});