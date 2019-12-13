var gulp = require('gulp');
// var uglify = require('gulp-uglify');
var uncomment = require('gulp-uncomment');
var uglify = require('gulp-uglify-es').default;
var rename = require('gulp-rename');
var concat = require('gulp-concat');

// Use this method to specify order
// and ignore certain files (!)
var analyticsDir = [
    './h_tk/analytics/support/nlp/wink/wink-lexicon/wn-adjective-exceptions.js',
    './h_tk/analytics/support/nlp/wink/wink-lexicon/wn-noun-exceptions.js',
    './h_tk/analytics/support/nlp//wink/wink-lexicon/wn-verb-exceptions.js',
    './h_tk/analytics/support/nlp/wink/wink-lexicon/wn-words.js',
    './h_tk/analytics/support/nlp/wink/wink-lexicon/wn-word-senses.js',
    './h_tk/analytics/support/nlp/wink/wink-lemmatizer.js'
]

var jsDest = './libs/dist';

gulp.task('tk-analytics-support-packager', function() {
    return gulp.src(analyticsDir)
    // Remove inline comments
    .pipe(uncomment({
        removeEmptyLines: true
    }))
    // Concatenate all files together
    .pipe(concat('h-tk-analytics-support.js'))
    // Save to dist directory
    .pipe(gulp.dest(jsDest))
    // Minimize file
    .pipe(rename('h-tk-analytics-support.min.js'))
    .pipe(uglify())
    // Save to dist directory
    .pipe(gulp.dest(jsDest));
});

gulp.task('tk-analytics-support-pkg', gulp.series ('tk-analytics-support-packager'));