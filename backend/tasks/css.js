var gulp = require('gulp');
var browserSync = require('browser-sync');

var autoprefixer = require('gulp-autoprefixer');
var handleErrors = require('../util/handleErrors');
var concat = require('gulp-concat');

var importCss = require('gulp-import-css');

gulp.task('css', ['images'], function () {
  return gulp.src( 'develop/sass/main.css')
    .pipe(concat('main.css'))
    .on('error', handleErrors)
    .pipe(importCss())
    .pipe(autoprefixer({browsers: ['last 2 version']}))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({stream: true}));
});
