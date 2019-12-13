var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

// Use this method to specify order
// and ignore certain files (!)
var sourceDir = [
    './libs/dist/main.js',
    './libs/dist/h-tk-utility.min.js',
    './libs/dist/h-tk-ingest.min.js',
    './libs/dist/h-tk-collections.min.js',
    './libs/dist/h-tk-wranglers.min.js',
    './libs/dist/h-tk-analytics.min.js',
    './libs/dist/h-tk-mappers.min.js',
    './libs/dist/h-tk-makers-common.min.js',
    './libs/dist/h-tk-makers-2d.min.js',
    './libs/dist/h-tk-makers-25d.min.js',
    './libs/dist/h-tk-makers-3d.min.js',
    './libs/dist/h-tk-assemblers-2d.min.js',
    './libs/dist/h-tk-charts-2d.min.js',
    './libs/dist/h-tk-map-2d.min.js',
    './libs/dist/h-tk-map-25d.min.js',
    './libs/dist/h-tk-map-3d.min.js',
    './libs/dist/h-tk-time-2d.min.js',
    './libs/dist/h-tk-time-25d.min.js',
    './libs/dist/h-tk-time-3d.min.js',
    './libs/dist/h-tk-tree-2d.min.js',
    './libs/dist/h-tk-tree-25d.min.js',
    './libs/dist/h-tk-tree-3d.min.js',
    './libs/dist/h-tk-workflow.min.js'
]

var jsDest = './libs/dist';

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