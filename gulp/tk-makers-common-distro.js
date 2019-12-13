var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var makersDir = './h_tk/makers/common/*.js';
var jsDest = './libs/dist';

gulp.task('makers-common-packager', function() {
    return gulp.src(makersDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-makers-common.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('h-tk-makers-common.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

gulp.task('makers-common-pkg', gulp.series ('makers-common-packager'));