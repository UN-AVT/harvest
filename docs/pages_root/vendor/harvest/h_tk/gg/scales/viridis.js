/**
 * @private
 * 
 * @description Flexible viridis scale function for all viridis scale types.
 * 
 * @param {number} alpha
 * @param {number} begin
 * @param {number} end
 * @param {number} direction
 * @param {string} option
 * @param {string} na.value
 * @param {string} aesthetics
 * 
 */
H.gg.prototype.scale_viridis = function (options={}) {

    let lookup = {A: "Magma", B: "Inferno", C: "Plasma", D: "Viridis", E: "Cividis"}

    let defaults = this.defaults.ggplot.scale_colour_brewer
    options = {...defaults, ...options}

    if (options.option in lookup) options.option = lookup[options.option]
    let interpolator = d3[`interpolate${options.option}`]

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'

        // create guide
        if(options.guide) this.guides({[aes]:options.guide})

        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]

        if (scale.type == 'linear') {
            scale.type = 'quantize'
            scale.range = d3.quantize(interpolator, 10)
            // //adapt the domain to adjust for the start and end of the color gradient
            if (options.begin != 0 || options.end != 1){
                scale.range = scale.range.slice(options.begin*10, options.end*10);
            }
        }

        //adjust alpha
        if (options.alpha != 1){
            for (let i in this._current_layer.draw){
                if (aes == 'color') this._current_layer.draw[i].stroke.alpha = options.alpha
                if (aes == 'fill') this._current_layer.draw[i].alpha = options.alpha
            }
        }


        if (scale.type != 'linear' || scale.type != 'quantize' ) {
            //work around as d3 cannot map discrete values to a continuous color scale
            scale.type= 'ordinal'
            scale.domain = d3.map(this._current_layer.data[0].content.flat(), d => d[scale.field]).keys() 
            scale.range = []

            let color_gradient_domain = [0, scale.domain.length-1]

            if (options.begin != 0 || options.end != 1){
                let color_gradient_scale = d3.scaleLinear()
                    .domain([options.begin, options.end])
                    .range(color_gradient_domain)
    
                color_gradient_domain = [color_gradient_scale(0), color_gradient_scale(1)]
            }

            let color_gradient = d3.scaleSequential()
                .domain(color_gradient_domain)
                .interpolator(interpolator)

            for (let i in scale.domain){
                scale.range.push(color_gradient(i))
            }
        }

        //remove any interpolate method 
        delete scale.interpolate
        //flip direction
        if (options.direction === -1)  scale.range.reverse()

        if (options.na && options.na.value) scale.unknown = options.na.value

    }

};

/**
 * @description The viridis scales provide colour maps that are perceptually uniform in both colour and black-and-white. 
 * They are also designed to be perceived by viewers with common forms of colour blindness. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_viridis.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [alpha = 1]
 * @param {number} [begin = 0]
 * @param {number} [end = 1]
 * @param {number} [direction = 1]
 * @param {string} [option = "D"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "colour"]
 *
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_colour_viridis_d = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_viridis_d
    options = {...defaults, ...options}
    this.scale_viridis(options)
};


/**
 * @description The viridis scales provide colour maps that are perceptually uniform in both colour and black-and-white. 
 * They are also designed to be perceived by viewers with common forms of colour blindness. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_viridis.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [alpha = 1]
 * @param {number} [begin = 0]
 * @param {number} [end = 1]
 * @param {number} [direction = 1]
 * @param {string} [option = "D"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
 *
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_fill_viridis_d = function (options={}) {
    let defaults = this.defaults.ggplot.scale_fill_viridis_d
    options = {...defaults, ...options}
    this.scale_viridis(options)
};


/**
 * @description The viridis scales provide colour maps that are perceptually uniform in both colour and black-and-white. 
 * They are also designed to be perceived by viewers with common forms of colour blindness. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_viridis.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [alpha = 1]
 * @param {number} [begin = 0]
 * @param {number} [end = 1]
 * @param {number} [direction = 1]
 * @param {string} [option = "D"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "colour"]
 *
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_colour_viridis_c = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_viridis_c
    options = {...defaults, ...options}
    this.scale_viridis(options)
};


/**
 * @description The viridis scales provide colour maps that are perceptually uniform in both colour and black-and-white. 
 * They are also designed to be perceived by viewers with common forms of colour blindness. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_viridis.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [alpha = 1]
 * @param {number} [begin = 0]
 * @param {number} [end = 1]
 * @param {number} [direction = 1]
 * @param {string} [option = "D"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
 *
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_fill_viridis_c = function (options={}) {
    let defaults = this.defaults.ggplot.scale_fill_viridis_c
    options = {...defaults, ...options}
    this.scale_viridis(options)
};


/**
 * @description The viridis scales provide colour maps that are perceptually uniform in both colour and black-and-white. 
 * They are also designed to be perceived by viewers with common forms of colour blindness. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_viridis.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [alpha = 1]
 * @param {number} [begin = 0]
 * @param {number} [end = 1]
 * @param {number} [direction = 1]
 * @param {string} [option = "D"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "colour"]
 *
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_colour_viridis_b = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_viridis_b
    options = {...defaults, ...options}
    this.scale_viridis(options)
};


/**
 * @description The viridis scales provide colour maps that are perceptually uniform in both colour and black-and-white. 
 * They are also designed to be perceived by viewers with common forms of colour blindness. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/scale_viridis.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [alpha = 1]
 * @param {number} [begin = 0]
 * @param {number} [end = 1]
 * @param {number} [direction = 1]
 * @param {string} [option = "D"]
 * @param {string} [na.value = "grey50"]
 * @param {string} [aesthetics = "fill"]
 *
 * @todo guide = "colourbar"
 */
H.gg.prototype.scale_fill_viridis_b = function (options={}) {
    let defaults = this.defaults.ggplot.scale_fill_viridis_b
    options = {...defaults, ...options}
    this.scale_viridis(options)
};