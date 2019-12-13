'use strict';

var gulp = require('gulp');
var gulpDocumentation = require('gulp-documentation');

var wranglersDir = './h_tk/wranglers/*.js';

gulp.task('tk-wranglers-docs-md', function () {
    // Generating README documentation
        return gulp.src(wranglersDir)
          .pipe(gulpDocumentation('md'))
          .pipe(gulp.dest('./docs/md/wranglers'));
    });
      
gulp.task('tk-wranglers-docs-md-task', gulp.series ('tk-wranglers-docs-md'));

// Generating a pretty HTML documentation site
gulp.task('tk-wranglers-docs-html', function () {
        return gulp.src(wranglersDir)
        .pipe(gulpDocumentation('html', {}, {
            name: 'Harvest TK',
            version: '0.0.1'
        }))
        .pipe(gulp.dest('./docs/html/wranglers'));
});

gulp.task('tk-wranglers-docs-html-task', gulp.series ('tk-wranglers-docs-html'));