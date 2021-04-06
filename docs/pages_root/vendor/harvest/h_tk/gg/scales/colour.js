/** 
 * @description Maps each level to an evenly spaced hue on the colour wheel. 
 * It does not generate colour-blind safe palettes.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_hue.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [c = 100]
 * @param {number} [l = 65]
 * @param {number} [h.start = 15]
 * @param {number} [direction = 1]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "color"]
 * 
 * @todo h = [0, 360] + 15
 */
H.gg.prototype.scale_colour_hue = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_hue
    options = {...defaults, ...options}
    
    let palette = (vals) => {
        let res = []
        for (let i=0; i<vals; i++){
            let degree = options.direction == -1 ? 360-(360/vals): 360/vals

            if (Color){
                let color = new Color();
                color.lchuv = [options.l, options.c, options.h.start+(degree*i)];
                res.push(color.rgbString)
            } else {
                res.push(d3.hcl(options.h.start+(degrees*i), options.c, options.l))
            }
        }
        return res
    }

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'

        // create guide
        if(options.guide) this.guides({[aes]:options.guide})

        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]
        delete scale.interpolate
        delete scale.interpolator
        scale.type = 'ordinal' 
        scale.domain = d3.map(this._current_layer.data[0].content.flat(), d => d[scale.field]).keys()
        scale.range = palette(scale.domain.length)
        scale.unknown = options.na.value
    }

};

/** 
 * @description Maps each level to an evenly spaced hue on the colour wheel. 
 * It does not generate colour-blind safe palettes.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_hue.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [c = 100]
 * @param {number} [l = 65]
 * @param {number} [h.start = 0]
 * @param {number} [direction = 1]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
 * 
 * @todo h = [0, 360] + 15
 */
H.gg.prototype.scale_fill_hue = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_hue(options)
};


/** 
 * @description Colour scales for continuous data default to the values of the ggplot2.continuous.colour and ggplot2.continuous.fill options. 
 * These options() default to "gradient" (i.e., scale_colour_gradient() and scale_fill_gradient())
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_colour_continuous.html
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
 * @todo currently only allows default scale. Need to implement changable type.
 */
H.gg.prototype.scale_colour_continuous = function (options={}) {
    this.scale_colour_gradient(options)
};


/** 
 * @description Colour scales for continuous data default to the values of the ggplot2.continuous.colour and ggplot2.continuous.fill options. 
 * These options() default to "gradient" (i.e., scale_colour_gradient() and scale_fill_gradient())
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_colour_continuous.html
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
 * @todo currently only allows default scale. Need to implement changable type.
 */
H.gg.prototype.scale_fill_continuous = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_gradient(options)
};


/** 
 * @description The default discrete colour scale. 
 * Defaults to scale_fill_hue()/scale_fill_brewer() unless type (which defaults to the ggplot2.discrete.fill/ggplot2.discrete.colour options) is specified.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_colour_discrete.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [c = 100]
 * @param {number} [l = 65]
 * @param {number} [h.start = 0]
 * @param {number} [direction = 1]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
 * 
 * @todo currently only allows default scale. Need to implement changable type.
 */
H.gg.prototype.scale_colour_discrete = function (options={}) {
    this.scale_colour_hue(options)
};


/** 
 * @description The default discrete colour scale. 
 * Defaults to scale_fill_hue()/scale_fill_brewer() unless type (which defaults to the ggplot2.discrete.fill/ggplot2.discrete.colour options) is specified.
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_colour_discrete.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [c = 100]
 * @param {number} [l = 65]
 * @param {number} [h.start = 0]
 * @param {number} [direction = 1]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
 * 
 * @todo currently only allows default scale. Need to implement changable type.
 */
H.gg.prototype.scale_fill_discrete = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_fill_hue(options)
};


/** 
 * @description This is black and white equivalent of scale_colour_gradient().
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_grey.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [start = 0.2]
 * @param {number} [end = 0.8]
 * @param {string} [na.value = "red"]
 * @param {string} [aesthetics = "color"]
 */
H.gg.prototype.scale_colour_grey = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_grey
    options = {...defaults, ...options}

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'
        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]
        delete scale.interpolate
        delete scale.interpolator
        scale.unknown = options.na.value
        if (options.type == 'linear'){
            scale.type = 'linear'
            scale.domain = d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field])
            scale.range([`hsl(0,0,${options.start*100}%)`,`hsl(0,0,${options.end*100}%)`])
        } else {
            //work around as d3 cannot map discrete values to a continuous color scale
            scale.type= 'ordinal'
            scale.domain = d3.map(this._current_layer.data[0].content.flat(), d => d[scale.field]).keys() 
            scale.range = []
            let color_gradient = d3.scaleLinear()
            .domain([0, scale.domain.length-1])
            .range([`hsl(0,0,${options.start*100}%)`,`hsl(0,0,${options.end*100}%)`])
            for (let i in scale.domain){
                scale.range.push(color_gradient(i))
            }
        }

    }

};

/** 
 * @description This is black and white equivalent of scale_colour_gradient().
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_grey.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [start = 0.2]
 * @param {number} [end = 0.8]
 * @param {string} [na.value = "red"]
 * @param {string} [aesthetics = "fill"]
 */
H.gg.prototype.scale_fill_grey = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_grey(options)
};