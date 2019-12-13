var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var srcDir = './h_tk/layouts/map/2d/**/*.js';
var jsDest = './libs/dist';

gulp.task('map-2d-packager', function() {
    return gulp.src(srcDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-tk-map-2d.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsDest))
    // Minimize file
    .pipe(rename('h-tk-map-2d.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsDest));
});

gulp.task('map-2d-pkg', gulp.series ('map-2d-packager'));