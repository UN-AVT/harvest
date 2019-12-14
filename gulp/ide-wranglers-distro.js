var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var wranglersDir = './h_ide/blocks/wranglers/**/*.js';
var jsUnMinDest = './libs/h_ide_dist/unmin';
var jsMinDest = './libs/h_ide_dist/min';

gulp.task('ide-wranglers-packager', function() {
    return gulp.src(wranglersDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-ide-wranglers.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsUnMinDest))
    // Minimize file
    .pipe(rename('h-ide-wranglers.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('ide-wranglers-pkg', gulp.series ('ide-wranglers-packager'));