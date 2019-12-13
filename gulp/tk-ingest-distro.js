var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var ingestDir = './h_tk/ingest/*.js';
var jsDest = './libs/dist';

gulp.task('ingest-packager', function() {
    return gulp.src(ingestDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-ingest.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('h-tk-ingest.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

gulp.task('ingest-pkg', gulp.series ('ingest-packager'));