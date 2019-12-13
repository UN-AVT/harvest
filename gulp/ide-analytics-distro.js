var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var analyticsDir = './h_ide/blocks/analytics/**/*.js';
var jsUnMinDest = './libs/h_ide_dist/unmin';
var jsMinDest = './libs/h_ide_dist/min';

gulp.task('ide-analytics-packager', function() {
    return gulp.src(analyticsDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-ide-analytics.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsUnMinDest))
    // Minimize file
    .pipe(rename('h-ide-analytics.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('ide-analytics-pkg', gulp.series ('ide-analytics-packager'));