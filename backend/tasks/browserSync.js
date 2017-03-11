var browserSync = require('browser-sync');
var gulp        = require('gulp');

gulp.task('browserSync', ['build'], function() {
  browserSync({
    server: {
      // src is included for use with sass source maps
      baseDir: ['build', 'develop']
    },
    notify: false,
    middleware: function (req, res, next) {
      if(req.url.indexOf("/manifest.appcache") > -1 ){
        req.url = "/manifest.appcache"
      }
      next();
    },
    files: [
      // Watch everything in build
      "build/**",
      "!build/images/map/**",
      // Exclude sourcemap files
      "!build/**.map",
      '!build/manifest.appcache',
      '!http://localhost:3000/*'
    ]
  });
});
