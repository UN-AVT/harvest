var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

var workflowDir = './h_tk/workflow/*.js';
var jsDest = './libs/dist';

gulp.task('workflow-packager', function() {
    return gulp.src(workflowDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    .pipe(concat('h-tk-workflow.js'))
    .pipe(gulp.dest(jsDest))
    .pipe(rename('h-tk-workflow.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

gulp.task('workflow-pkg', gulp.series ('workflow-packager'));