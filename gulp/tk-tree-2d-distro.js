var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var srcDir = './h_tk/layouts/tree/2d/**/*.js';
var jsDest = './libs/dist';

gulp.task('tree-2d-packager', function() {
    return gulp.src(srcDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-tk-tree-2d.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsDest))
    // Minimize file
    .pipe(rename('h-tk-tree-2d.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsDest));
});

gulp.task('tree-2d-pkg', gulp.series ('tree-2d-packager'));