var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var ingestDir = './h_ide/blocks/ingest/**/*.js';
var jsUnMinDest = './libs/h_ide_dist/unmin';
var jsMinDest = './libs/h_ide_dist/min';

gulp.task('ide-ingest-packager', function() {
    return gulp.src(ingestDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-ide-ingest.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsUnMinDest))
    // Minimize file
    .pipe(rename('h-ide-ingest.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('ide-ingest-pkg', gulp.series ('ide-ingest-packager'));