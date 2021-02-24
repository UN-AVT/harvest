/** 
 *  @fileOverview Enables execution of serial and parallel tasks.
 *
 *
 *  @requires     FileSaver.js
 *  @requires     Blob.js
 * 
 */

"use strict";

H.Exporters = function() {

    /**
     * Used internally - not called directly
     *
     * @param {*} blob
     * @param {*} filename
     * @returns
     */
    var save = function ( blob, filename ) {
        let link = document.createElement( 'a' );
        link.style.display = 'none';
        document.body.appendChild( link ); // Firefox workaround, see #6594
        link.href = URL.createObjectURL( blob );
        link.download = filename;
        link.click();
        // URL.revokeObjectURL( url ); breaks Firefox...
    };

    /**
     * For String Stream
     *
     * @param {*} text
     * @param {*} filename
     * @returns
     */
    var saveString = function ( text, filename ) {
        save( new Blob( [ text ], { type: 'text/plain' } ), filename );
    };

    /**
     * For Binary Stream
     *
     * @param {*} buffer
     * @param {*} filename
     * @returns
     */
    var saveArrayBuffer = function ( buffer, filename ) {
        save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
    };

return {
    saveString: saveString,
    saveArrayBuffer: saveArrayBuffer
};

}();