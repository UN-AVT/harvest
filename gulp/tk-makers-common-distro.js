var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var makersDir = './h_tk/makers/common/*.js';
var jsUnMinDest = './libs/h_tk_dist/unmin';
var jsMinDest = './libs/h_tk_dist/min';

gulp.task('makers-common-packager', function() {
    return gulp.src(makersDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-makers-common.js'))
    .pipe(gulp.dest(jsUnMinDest))
    .pipe(rename('h-tk-makers-common.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('makers-common-pkg', gulp.series ('makers-common-packager'));