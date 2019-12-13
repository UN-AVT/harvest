var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var makersDir = './h_tk/makers/2d/*.js';
var jsDest = './libs/dist';

gulp.task('makers-2d-packager', function() {
    return gulp.src(makersDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-makers-2d.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('h-tk-makers-2d.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

gulp.task('makers-2d-pkg', gulp.series ('makers-2d-packager'));