var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var analyticsDir = ['./h_tk/analytics/*.js', '!./h_tk/analytics/entity-extraction.js', '!./h_tk/analytics/nlp.js' ];
var jsDest = './libs/dist';

gulp.task('analytics-packager', function() {
    return gulp.src(analyticsDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-tk-analytics.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsDest))
    // Minimize file
    .pipe(rename('h-tk-analytics.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsDest));
});

gulp.task('analytics-pkg', gulp.series ('analytics-packager'));