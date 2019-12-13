var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var propertiesDir = './h_ide/blocks/properties/**/*.js';
var jsDest = './libs/dist';

gulp.task('ide-properties-packager', function() {
    return gulp.src(propertiesDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-ide-properties.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsDest))
    // Minimize file
    .pipe(rename('h-ide-properties.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsDest));
});

gulp.task('ide-properties-pkg', gulp.series ('ide-properties-packager'));