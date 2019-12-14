var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var collectionsDir = './h_tk/collections/*.js';
var jsUnMinDest = './libs/h_tk_dist/unmin';
var jsMinDest = './libs/h_tk_dist/min';

gulp.task('collections-packager', function() {
    return gulp.src(collectionsDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-collections.js'))
    .pipe(gulp.dest(jsUnMinDest))
    .pipe(rename('h-tk-collections.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('collections-pkg', gulp.series ('collections-packager'));