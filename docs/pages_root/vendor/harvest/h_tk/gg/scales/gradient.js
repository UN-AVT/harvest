/** 
 * @description creates a two colour gradient (low-high)
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_gradient.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [low = "#132B43"]
 * @param {string} [high = "#56B1F7"]
 * @param {string} [space = "Lab"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "colour"]
 * 
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_colour_gradient = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_gradient
    options = {...defaults, ...options}

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'
        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]
        scale.type = 'linear' 
        scale.domain = d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field])
        scale.range = [options.low, options.high]
        delete scale.interpolator
        scale.interpolate = d3[`interpolate${options.space}`]
        scale.unknown = options.na.value
    }
};


/** 
 * @description creates a two colour gradient (low-high)
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_gradient.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [low = "#132B43"]
 * @param {string} [high = "#56B1F7"]
 * @param {string} [space = "Lab"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
 * 
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_fill_gradient = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_gradient(options)
};

/** 
 * @description creates a diverging colour gradient (low-mid-high)
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_gradient.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [low = "#CC6677"]
 * @param {string} [mid = "white"]
 * @param {string} [high = "#88CCEE"]
 * @param {number} [midpoint = 0]
 * @param {string} [space = "Lab"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "colour"]
 * 
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_colour_gradient2 = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_gradient2
    options = {...defaults, ...options}

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'
        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]
        let domain = d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field])

        scale.type = 'linear' 
        scale.domain = [domain[0], options.midpoint, domain[1]]
        scale.range = [options.low, options.mid, options.high]
        delete scale.interpolator
        scale.interpolate = d3[`interpolate${options.space}`]
        scale.unknown = options.na.value
    }
};


/** 
 * @description creates a diverging colour gradient (low-mid-high)
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_gradient.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [low = "#CC6677"]
 * @param {string} [mid = "white"]
 * @param {string} [high = "#88CCEE"]
 * @param {number} [midpoint = 0]
 * @param {string} [space = "Lab"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
 * 
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_fill_gradient2 = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_gradient2(options)
};


/** 
 * @description creates a n-colour gradient.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_gradient.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} colours
 * @param {string} values
 * @param {string} [space = "Lab"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "colour"]
 * 
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_colour_gradientn = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_gradientn
    options = {...defaults, ...options}

    if (options.colors){
        options.colours = options.colors
        delete options.colors
    }

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'
        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]
        let domain = d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field])

        scale.type = 'linear' 
        scale.domain = options.values || [domain[0], domain[1]]
        scale.range = options.colours || []
        delete scale.interpolator
        scale.interpolate = d3[`interpolate${options.space}`]
        scale.unknown = options.na.value
    }
};

/** 
 * @description creates a n-colour gradient.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_gradient.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} colours
 * @param {string} values
 * @param {string} [space = "Lab"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
 * 
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_fill_gradientn = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_gradientn(options)
};