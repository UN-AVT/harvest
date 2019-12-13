'use strict';

var gulp = require('gulp');
var gulpDocumentation = require('gulp-documentation');

var mappersDir = './h_tk/mappers/*.js';

gulp.task('tk-mappers-docs-md', function () {
    // Generating README documentation
        return gulp.src(mappersDir)
          .pipe(gulpDocumentation('md'))
          .pipe(gulp.dest('./docs/md/mappers'));
    });

gulp.task('tk-mappers-docs-md-task', gulp.series ('tk-mappers-docs-md'));
      
// Generating a pretty HTML documentation site
gulp.task('tk-mappers-docs-html', function () {
        return gulp.src(mappersDir)
        .pipe(gulpDocumentation('html', {}, {
            name: 'Harvest TK',
            version: '0.0.1'
        }))
        .pipe(gulp.dest('./docs/html/mappers'));
});

gulp.task('tk-mappers-docs-html-task', gulp.series ('tk-mappers-docs-html'));