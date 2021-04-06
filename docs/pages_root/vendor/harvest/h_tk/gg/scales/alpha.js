/**
 * @description Alpha-transparency scales are not tremendously useful, but can be a convenient way to visually down-weight less important observations. 
 * scale_alpha() is an alias for scale_alpha_continuous() since that is the most common use of alpha, and it saves a bit of typing. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_alpha.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {array} [range = [0,1]]
 * @param {string} [type = "linear"]
 * @param {string} [aesthetics = "fill"]
 *
 */
H.gg.prototype.scale_alpha = function (options={}) {
    let defaults = this.defaults.ggplot.scale_alpha
    options = {...defaults, ...options}

    // create guide
    if(options.guide) this.guides({alpha:options.guide})

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'
        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]
        delete scale.interpolate
        delete scale.interpolator
        if (options.type == 'linear'){
            scale.type = 'linear'
            scale.domain = d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field])
            scale.range = [`rgba(0,0,0,${options.range[0]})`,`rgba(0,0,0,${options.range[1]})`]
        } else {
            //work around as d3 cannot map discrete values to a continuous color scale
            scale.type= 'ordinal'
            scale.domain = d3.map(this._current_layer.data[0].content.flat(), d => d[scale.field]).keys() 
            scale.range = []
            let color_gradient = d3.scaleLinear()
            .domain([0, scale.domain.length-1])
            .range([`rgba(0,0,0,${options.range[0]})`,`rgba(0,0,0,${options.range[1]})`])
            for (let i in scale.domain){
                scale.range.push(color_gradient(i))
            }
        }

        delete scale.unknown // not implemented
    }

};


/**
 * @description Alpha-transparency scales are not tremendously useful, but can be a convenient way to visually down-weight less important observations. 
 * scale_alpha() is an alias for scale_alpha_continuous() since that is the most common use of alpha, and it saves a bit of typing. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_alpha.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {array} [range = [0,1]]
 * @param {string} [type = "linear"]
 * @param {string} [aesthetics = "fill"]
 *
 */
H.gg.prototype.scale_alpha_continuous = function (options={}) {
    let defaults = this.defaults.ggplot.scale_alpha_continuous
    options = {...defaults, ...options}
    this.scale_alpha(options)
};


/**
 * @description Alpha-transparency scales are not tremendously useful, but can be a convenient way to visually down-weight less important observations. 
 * scale_alpha() is an alias for scale_alpha_continuous() since that is the most common use of alpha, and it saves a bit of typing. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_alpha.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {array} [range = [0,1]]
 * @param {string} [type = "ordinal"]
 * @param {string} [aesthetics = "fill"]
 * 
 * @todo double check with binned data
 *
 */
H.gg.prototype.scale_alpha_binned = function (options={}) {
    let defaults = this.defaults.ggplot.scale_alpha_binned
    options = {...defaults, ...options}
    this.scale_alpha(options)
};


/**
 * @description Alpha-transparency scales are not tremendously useful, but can be a convenient way to visually down-weight less important observations. 
 * scale_alpha() is an alias for scale_alpha_continuous() since that is the most common use of alpha, and it saves a bit of typing. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_alpha.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {array} [range = [0,1]]
 * @param {string} [type = "ordinal"]
 * @param {string} [aesthetics = "fill"]
 *
 */
H.gg.prototype.scale_alpha_discrete = function (options={}) {
    let defaults = this.defaults.ggplot.scale_alpha_discrete
    options = {...defaults, ...options}
    this.scale_alpha(options)
};


/**
 * @description Alpha-transparency scales are not tremendously useful, but can be a convenient way to visually down-weight less important observations. 
 * scale_alpha() is an alias for scale_alpha_continuous() since that is the most common use of alpha, and it saves a bit of typing. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_alpha.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {array} [range = [0,1]]
 * @param {string} [type = "ordinal"]
 * @param {string} [aesthetics = "fill"]
 * 
 * @todo check with ordinal data
 *
 */
H.gg.prototype.scale_alpha_ordinal = function (options={}) {
    let defaults = this.defaults.ggplot.scale_alpha_ordinal
    options = {...defaults, ...options}
    this.scale_alpha(options)
};