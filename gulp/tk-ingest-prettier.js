var gulp = require('gulp');
const prettier = require('gulp-prettier');

var ingestDir = './h_tk/ingest/*.js';
var ingestDest = './h_tk/ingest';

gulp.task('tk-ingest-prettier', function() {
    return gulp.src(ingestDir)
      .pipe(prettier({ singleQuote: true }))
      .pipe(gulp.dest(ingestDest));
  });

gulp.task('ingest-prettier-task', gulp.series ('tk-ingest-prettier'));