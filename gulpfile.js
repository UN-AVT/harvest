/** 
 *  @fileOverview Gulp Tasks for documentation and distribution packaging.
 *
 *  @author       UNITED NATIONS
 *  @author       BTA-AVT
 *
 *  @requires     none
 * 
 */

'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('./gulp');

gulp.task('test', function() {
    console.log('Gulp is running and ready');
    // Needed to avoid error
    return Promise.resolve()
});

gulp.task('default', gulp.series( 'test' ));

///////////////////////////////////////////////////////////
////// Create distribution packages for each module ///////
///////////////////////////////////////////////////////////

var tk_distro = [
    'utility-packager', 
    'ingest-packager', 
    'collections-packager',
    'wranglers-packager',
    'analytics-packager',
    'mappers-packager',
    'makers-common-packager',
    'makers-2d-packager',
    'makers-25d-packager',
    'makers-3d-packager',
    'assemblers-2d-packager',
    'workflow-packager',
    'charts-2d-packager',
    'map-2d-packager',
    'map-25d-packager',
    'map-3d-packager',
    'time-2d-packager',
    'tree-2d-packager'
]

gulp.task('tk-distro', gulp.series ( tk_distro ));

///////////////////////////////////////////////////////////
//// Create support packages required for each module /////
///////////////////////////////////////////////////////////

var tk_support = [
    'tk-analytics-support-packager'
]

gulp.task('tk-support', gulp.series ( tk_support ));

///////////////////////////////////////////////////////////
/////////// Create full package  of all modules ///////////
///////////////////////////////////////////////////////////

var tk_full = [
    'tk-full-packager'
]

gulp.task('tk-full', gulp.series ( tk_full ));

// Create ide packages for each module

var ide_distro = [
    'ide-analytics-packager',
    'ide-ingest-packager',
    'ide-input-packager',
    'ide-mappers-packager',
    'ide-properties-packager',
    'ide-structures-packager',
    'ide-wranglers-packager'
]

gulp.task('ide-distro', gulp.series ( ide_distro ));

///////////////////////////////////////////////////////////
//////// Create html documentation for each module ////////
///////////////////////////////////////////////////////////

var tk_html_docs = [
    'tk-analytics-docs-html',
    'tk-mappers-docs-html',
    'tk-wranglers-docs-html'
]

gulp.task('tk-html-docs', gulp.series ( tk_html_docs ));

///////////////////////////////////////////////////////////
///////// Create md documentation for each module /////////
///////////////////////////////////////////////////////////

var tk_md_docs = [
    'tk-analytics-docs-md',
    'tk-mappers-docs-md',
    'tk-wranglers-docs-md'
]

gulp.task('tk-md-docs', gulp.series ( tk_md_docs ));

///////////////////////////////////////////////////////////
///////////////// Prettier code transform /////////////////
///////////////////////////////////////////////////////////

var tk_prettier = [
    'tk-ingest-prettier'
]

gulp.task('tk-prettier', gulp.series ( tk_prettier ));