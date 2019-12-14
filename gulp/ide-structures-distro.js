var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var structuresDir = './h_ide/blocks/structures/**/*.js';
var jsUnMinDest = './libs/h_ide_dist/unmin';
var jsMinDest = './libs/h_ide_dist/min';

gulp.task('ide-structures-packager', function() {
    return gulp.src(structuresDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-ide-structures.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsUnMinDest))
    // Minimize file
    .pipe(rename('h-ide-structures.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('ide-structures-pkg', gulp.series ('ide-structures-packager'));