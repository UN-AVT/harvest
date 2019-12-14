var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var mappersDir = './h_tk/mappers/*.js';
var jsUnMinDest = './libs/h_tk_dist/unmin';
var jsMinDest = './libs/h_tk_dist/min';

gulp.task('mappers-packager', function() {
    return gulp.src(mappersDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-mappers.js'))
    .pipe(gulp.dest(jsUnMinDest))
    .pipe(rename('h-tk-mappers.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('mappers-pkg', gulp.series ('mappers-packager'));