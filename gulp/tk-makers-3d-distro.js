var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var makersDir = './h_tk/makers/3d/*.js';
var jsUnMinDest = './libs/h_tk_dist/unmin';
var jsMinDest = './libs/h_tk_dist/min';

gulp.task('makers-3d-packager', function() {
    return gulp.src(makersDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-makers-3d.js'))
    .pipe(gulp.dest(jsUnMinDest))
    .pipe(rename('h-tk-makers-3d.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('makers-3d-pkg', gulp.series ('makers-3d-packager'));