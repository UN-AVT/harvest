/**
 * @private
 * 
 * @description lookup for brewer based colour gradients.
 * 
 * @param {string} [type = 'seq']
 * @param {number} [index = 1]
 * 
 */
H.gg.prototype.brewer_lookup = function (type='seq', index=1){
    let lookup = {
        seq: ['Blues', 'BuGn', 'BuPu', 'GnBu', 'Greens', 'Greys', 'Oranges', 'OrRd', 'PuBu', 'PuBuGn', 'PuRd', 'Purples', 'RdPu', 'Reds', 'YlGn', 'YlGnBu', 'YlOrBr', 'YlOrRd'],
        qual: ['Accent', 'Dark2', 'Paired', 'Pastel1', 'Pastel2', 'Set1', 'Set2', 'Set3'],
        div:['BrBG', 'PiYG', 'PRGn', 'PuOr', 'RdBu', 'RdGy', 'RdYlBu', 'RdYlGn', 'Spectral']
    }

    if (index == 0 || index > lookup[type].length) index = 1

    return lookup[type][index-1]
}

/** 
 * @description The brewer scales provides sequential, diverging and qualitative colour schemes from ColorBrewer. 
 * These are particularly well suited to display discrete values on a map. 
 * See http://colorbrewer2.org for more information.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_brewer.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [type = "seq"]
 * @param {number} [palette = 1]
 * @param {number} [direction = 1]
 * @param {string} [aesthetics = "colour"]
*/
H.gg.prototype.scale_colour_brewer = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_brewer
    options = {...defaults, ...options}

    if (!isNaN(options.palette)) options.palette = this.brewer_lookup(options.type, options.palette)
    let scale = d3[`scheme${options.palette}`]

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'
        if (options.type == 'qual') {
            this._current_layer.accessors[`${this._current_layer.name}-${aes}`].range = scale
        } else {
            this._current_layer.accessors[`${this._current_layer.name}-${aes}`].range = this._current_layer.accessors[`${this._current_layer.name}-${aes}`].domain.length > 2 ? this._current_layer.accessors[`${this._current_layer.name}-${aes}`].domain.length < 9 ? scale[this._current_layer.accessors[`${this._current_layer.name}-${aes}`].domain.length] : scale[9] : scale[3]
        }
        //remove any interpolate method 
        delete this._current_layer.accessors[`${this._current_layer.name}-${aes}`].interpolate
        //flip direction
        if (options.direction === -1)  this._current_layer.accessors[`${this._current_layer.name}-${aes}`].domain.reverse()

    }

    return scale;
};


/** 
 * @description The brewer scales provides sequential, diverging and qualitative colour schemes from ColorBrewer. 
 * These are particularly well suited to display discrete values on a map. 
 * See http://colorbrewer2.org for more information.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_brewer.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [type = "seq"]
 * @param {number} [palette = 1]
 * @param {number} [direction = 1]
 * @param {string} [aesthetics = "fill"]
 */
H.gg.prototype.scale_fill_brewer = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_brewer(options)
};


/** 
 * @description The brewer scales provides sequential, diverging and qualitative colour schemes from ColorBrewer. 
 * These are particularly well suited to display discrete values on a map. 
 * See http://colorbrewer2.org for more information.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_brewer.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [type = "seq"]
 * @param {number} [palette = 1]
 * @param {number} [direction = -1]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "colour"]
*/
H.gg.prototype.scale_colour_distiller = function (options={}) {

    let defaults = this.defaults.ggplot.scale_colour_distiller
    options = {...defaults, ...options}

    if (!isNaN(options.palette)) options.palette = this.brewer_lookup(options.type, options.palette)
    let interpolator = d3[`interpolate${options.palette}`]

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'
        if (options.type == 'qual') {
            const e = new Error('Qualitative scales cannot be used with scale_colour_distiller. Try scale_colour_fermenter')
            throw e
        } else {
            this._current_layer.accessors[`${this._current_layer.name}-${aes}`].type = 'sequential'
            delete this._current_layer.accessors[`${this._current_layer.name}-${aes}`].range
            this._current_layer.accessors[`${this._current_layer.name}-${aes}`].interpolator = interpolator
        }
        //remove any interpolate method 
        delete this._current_layer.accessors[`${this._current_layer.name}-${aes}`].interpolate
        //flip direction
        if (options.direction === -1)  this._current_layer.accessors[`${this._current_layer.name}-${aes}`].domain.reverse()

    }

};

/** 
 * @description The brewer scales provides sequential, diverging and qualitative colour schemes from ColorBrewer. 
 * These are particularly well suited to display discrete values on a map. 
 * See http://colorbrewer2.org for more information.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_brewer.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [type = "seq"]
 * @param {number} [palette = 1]
 * @param {number} [direction = -1]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
*/
H.gg.prototype.scale_fill_distiller = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_distiller(options)
};


/** 
 * @description The brewer scales provides sequential, diverging and qualitative colour schemes from ColorBrewer. 
 * These are particularly well suited to display discrete values on a map. 
 * See http://colorbrewer2.org for more information.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_brewer.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [type = "seq"]
 * @param {number} [palette = 1]
 * @param {number} [direction = -1]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "color"]
*/
H.gg.prototype.scale_colour_fermenter = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_distiller
    options = {...defaults, ...options}

};


/** 
 * @description The brewer scales provides sequential, diverging and qualitative colour schemes from ColorBrewer. 
 * These are particularly well suited to display discrete values on a map. 
 * See http://colorbrewer2.org for more information.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_brewer.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [type = "seq"]
 * @param {number} [palette = 1]
 * @param {number} [direction = -1]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
*/
H.gg.prototype.scale_fill_fermenter = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_fermenter(options)
};