var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var srcDir = './h_tk/layouts/chart/2d/**/*.js';
var jsUnMinDest = './libs/h_tk_dist/unmin';
var jsMinDest = './libs/h_tk_dist/min';

gulp.task('charts-2d-packager', function() {
    return gulp.src(srcDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-tk-charts-2d.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsUnMinDest))
    // Minimize file
    .pipe(rename('h-tk-charts-2d.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('charts-2d-pkg', gulp.series ('charts-2d-packager'));