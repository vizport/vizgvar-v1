// var gulp        = require('gulp');
// var sass        = require('gulp-sass');
// var concat      = require('gulp-concat');
// var uglify      = require('gulp-uglify');
// var browserify  = require('gulp-browserify');
// var browserSync = require('browser-sync').create();
// var reload      = browserSync.reload;

// //Variables
// var sassPath  = "./develop/sass/main.scss";
// var jsPath  = "./develop/js/index.js";
// var htmlPath = "./develop/html/*.html";
// var assetsPath = "./develop/assets/**.*";
// var outputDir = "./build";


// function handleError(err){
//   console.log(err.toString());
//   this.emit('end');
// }

// //The HTML Task compiles .html
// gulp.task('html', function(){
//     return gulp.src(htmlPath)
//     //.pipe(browserify())
//     //.pipe(uglify())
//     .pipe(gulp.dest(outputDir));
// });

// //The Sass Task compiles Sass Files from Sass Folder into Css
// gulp.task('sass', function(){
//   var config = {};
//   config.sourceComments = 'map';
//   // config.outputStyle = 'compressed';

//   return gulp.src(sassPath)
//     .on('error', handleError)
//     .pipe(sass(config))
//     .on('error', handleError)
//     .pipe(gulp.dest(outputDir))
//     .pipe(reload({stream: true}));
// });

// //The JS Task concatenates JS files and compiles them from the JS Folder
// gulp.task('js', function(){
//   return gulp.src(jsPath)
//   .pipe(browserify())
//   .pipe(uglify())
//   .pipe(gulp.dest(outputDir));
// });

// //The Aseets Task
// gulp.task('assets', function(){
//   return gulp.src(assetsPath)
//   //.pipe(browserify())
//   //.pipe(uglify())
//   .pipe(gulp.dest("./build/assets/"));
// });

// //The Serve Task calls other Gulp tasks
// gulp.task('server', ['sass','js','html','assets'], function(){
//   browserSync.init({
//         server: {
//             baseDir: outputDir
//         }
//     });
//   gulp.watch('./develop/sass/**/*.scss' , ['sass']);
//   gulp.watch('./develop/js/**/*.js' , ['js', reload]);
//   gulp.watch('./develop/assets/**/*.*' , ['assets', reload]);
//   gulp.watch('./develop/html/**/*.html' , ['html', reload]);
//   //gulp.watch('./index.html').on('change', browserSync.reload);
// });

// //his task will run when you call 'gulp' in the Command Line
// gulp.task('default', ['server']);