var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var inputDir = './h_ide/blocks/input/**/*.js';
var jsUnMinDest = './libs/h_ide_dist/unmin';
var jsMinDest = './libs/h_ide_dist/min';

gulp.task('ide-input-packager', function() {
    return gulp.src(inputDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-ide-input.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsUnMinDest))
    // Minimize file
    .pipe(rename('h-ide-input.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('ide-input-pkg', gulp.series ('ide-input-packager'));