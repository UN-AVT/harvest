var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var wranglersDir = './h_tk/wranglers/*.js';
var jsDest = './libs/dist';

gulp.task('wranglers-packager', function() {
    return gulp.src(wranglersDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-wranglers.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('h-tk-wranglers.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

gulp.task('wranglers-pkg', gulp.series ('wranglers-packager'));