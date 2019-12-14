var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

// Order may matter here
var utilityDir = ['./h_tk/utility/defs/*.js', './h_tk/utility/*.js'];
var jsUnMinDest = './libs/h_tk_dist/unmin';
var jsMinDest = './libs/h_tk_dist/min';

gulp.task('utility-packager', function() {
    return gulp.src(utilityDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-utility.js'))
    .pipe(gulp.dest(jsUnMinDest))
    .pipe(rename('h-tk-utility.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('utility-pkg', gulp.series ('utility-packager'));