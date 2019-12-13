var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var utilityDir = ['./h_tk/utility/support/*.js', './h_tk/utility/*.js'];
var jsDest = './libs/dist';

gulp.task('utility-packager', function() {
    return gulp.src(utilityDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-utility.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('h-tk-utility.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

gulp.task('utility-pkg', gulp.series ('utility-packager'));