'use strict';

var gulp = require('gulp');
var gulpDocumentation = require('gulp-documentation');

var analyticsDir = './h_tk/analytics/*.js';

gulp.task('tk-analytics-docs-md', function () {
    // Generating README documentation
        return gulp.src(analyticsDir)
          .pipe(gulpDocumentation('md'))
          .pipe(gulp.dest('./docs/md/analytics'));
    });

gulp.task('tk-analytics-docs-md-task', gulp.series ('tk-analytics-docs-md'));
      
// Generating a pretty HTML documentation site
gulp.task('tk-analytics-docs-html', function () {
        return gulp.src(analyticsDir)
        .pipe(gulpDocumentation('html', {}, {
            name: 'Harvest TK',
            version: '0.0.1'
        }))
        .pipe(gulp.dest('./docs/html/analytics'));
});

gulp.task('tk-analytics-docs-html-task', gulp.series ('tk-analytics-docs-html'));