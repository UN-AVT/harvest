var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var wranglersDir = './h_tk/wranglers/*.js';
var jsUnMinDest = './libs/h_tk_dist/unmin';
var jsMinDest = './libs/h_tk_dist/min';

gulp.task('wranglers-packager', function() {
    return gulp.src(wranglersDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-wranglers.js'))
    .pipe(gulp.dest(jsUnMinDest))
    .pipe(rename('h-tk-wranglers.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('wranglers-pkg', gulp.series ('wranglers-packager'));