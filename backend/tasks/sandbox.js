var gulp = require('gulp');
var s3 = require("gulp-s3");
var os = require("os");
require('dotenv').load();

var slack = require('gulp-slack')({
    url: process.env.SLACK_URL,
    channel: '#general',
    user: 'Gasperbot',
    icon_emoji: ':ghost:'
});

gulp.task('sandbox', function() {
  var aws = {
  	key: process.env.AWS_KEY_ID,
	  secret: process.env.AWS_KEY_ACCESS,
	  bucket: process.env.AWS_BUCKET
	};
  return gulp.src('./build/**')
      .pipe(s3(aws , { 
        uploadPath: process.env.AWS_SAND_PATH,
        headers: {
          'x-amz-acl': 'public-read'
        }
      }))
      .pipe(slack('@channel: Se ha hecho un nuevo upload a http://vizport.io/vizone_dev/ por ' + os.hostname() ));
});

