var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var assemblersDir = './h_tk/assemblers/2d/*.js';
var jsUnMinDest = './libs/h_tk_dist/unmin';
var jsMinDest = './libs/h_tk_dist/min';

gulp.task('assemblers-2d-packager', function() {
    return gulp.src(assemblersDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-assemblers-2d.js'))
    .pipe(gulp.dest(jsUnMinDest))
    .pipe(rename('h-tk-assemblers-2d.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsMinDest));
});

gulp.task('assemblers-2d-pkg', gulp.series ('assemblers-2d-packager'));