/** 
 *  @fileOverview Output a Project File.
 *
 *  @requires     paper.js
 * 
 */

"use strict";
H.Namespace.set(H, 'Output_Img');
H.Output_Img = function() 
{

    /**
     * Exports the project with all its layers and child items as an SVG DOM, 
     * all contained in one top level SVG group node.
     * 
     * @param {*} view
     * @param {*} file_name
     * @returns
     */
    var to_svg = function(view, file_name) {
        file_name = file_name || 'view.svg';
        let svg_file = view.project.exportSVG( { bounds:'view', asString:true, embedImages:true } );
	    H.Exporters.saveString( svg_file, file_name );
    };

    return {
        to_svg: to_svg
    };

}();