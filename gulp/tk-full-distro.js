var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

// Use this method to specify order
// and ignore certain files (!)
var sourceDir = [
    './libs/h_tk_dist/min/main.js',
    './libs/h_tk_dist/min/h-tk-utility.min.js',
    './libs/h_tk_dist/min/h-tk-ingest.min.js',
    './libs/h_tk_dist/min/h-tk-collections.min.js',
    './libs/h_tk_dist/min/h-tk-wranglers.min.js',
    './libs/h_tk_dist/min/h-tk-analytics.min.js',
    './libs/h_tk_dist/min/h-tk-mappers.min.js',
    './libs/h_tk_dist/min/h-tk-makers-common.min.js',
    './libs/h_tk_dist/min/h-tk-makers-2d.min.js',
    './libs/h_tk_dist/min/h-tk-makers-25d.min.js',
    './libs/h_tk_dist/min/h-tk-makers-3d.min.js',
    './libs/h_tk_dist/min/h-tk-assemblers-2d.min.js',
    './libs/h_tk_dist/min/h-tk-charts-2d.min.js',
    './libs/h_tk_dist/min/h-tk-map-2d.min.js',
    './libs/h_tk_dist/min/h-tk-map-25d.min.js',
    './libs/h_tk_dist/min/h-tk-map-3d.min.js',
    './libs/h_tk_dist/min/h-tk-time-2d.min.js',
    //'./libs/h_tk_dist/min/h-tk-time-25d.min.js',
    //'./libs/h_tk_dist/min/h-tk-time-3d.min.js',
    './libs/h_tk_dist/min/h-tk-tree-2d.min.js',
    //'./libs/h_tk_dist/min/h-tk-tree-25d.min.js',
    //'./libs/h_tk_dist/min/h-tk-tree-3d.min.js',
    './libs/h_tk_dist/min/h-tk-workflow.min.js'
]

var jsDest = './libs/h_tk_dist/full';

gulp.task('tk-full-packager', function() {
    return gulp.src(sourceDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-tk-full.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsDest))
    // Minimize file
    .pipe(rename('h-tk-full.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsDest));
});

gulp.task('tk-full-pkg', gulp.series ('tk-full-packager'));