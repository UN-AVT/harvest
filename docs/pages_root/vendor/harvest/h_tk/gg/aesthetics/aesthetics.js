/**
*  @fileOverview aesthetics mapping.
*
*  @author       UNITED NATIONS
*  @author       BTA-AVT
*
*  @requires     HARVEST
*  @requires     d3.js
*
*  @description Aesthetic mappings describe how variables in the data are mapped to visual properties 
*  (aesthetics) of geoms. Aesthetic mappings can be set in ggplot() and in individual layers.
* 
*  @example 
*  aes({x:"mpg", y:"wt"})
*/

H.gg.prototype.aes = function (options={}) {
    let defaults = this.defaults.ggplot.aes
    
    if (options._shape){
        if (!options._shape.stroke && (options.mapping.color || options.mapping.linetype || options.mapping.size)) options._shape.stroke = {}
        if (options.mapping.color) options._shape.stroke.color = `${options.name}-color`
        if (options.mapping.linetype) options._shape.stroke.dash = `${options.name}-linetype`
        if (options.mapping.linetype && options._shape.name == 'line') options._shape.dash = `${options.name}-linetype`
        if (options.mapping.size) options._shape.stroke.width = `${options.name}-size`
        if (options.mapping.width) options._shape.w = `${options.name}-width`
        if (options.mapping.fill) options._shape.color = `${options.name}-fill`
    }

    //create accessors (scales) for each defined mapping variable
    for (let opt in options.mapping){
        // set field namename
        if (typeof options.mapping[opt] == 'string'){
            this._current_layer.accessors[`${options.name}-${opt}`] = {field:options.mapping[opt]}
        } else if (Object.keys(options.mapping[opt])[0] == 'factor'){
            this._current_layer.accessors[`${options.name}-${opt}`] = {field:options.mapping[opt].factor}
        }
        // check if accessor has already been created & if so use values (object reference)
        if(this._plot_accessors.hasOwnProperty(opt) && this._plot_accessors[opt].field == this._current_layer.accessors[`${options.name}-${opt}`].field){
            //use global accessor if available
            this._current_layer.accessors[`${options.name}-${opt}`].domain = this._plot_accessors[opt].domain
            this._current_layer.accessors[`${options.name}-${opt}`].type = this._plot_accessors[opt].type
            this._current_layer.accessors[`${options.name}-${opt}`].range = this._plot_accessors[opt].range

        } else {
            // run scale creator
            if (typeof options.mapping[opt] == 'string'){
                if (opt in defaults) this[defaults[opt].continuous]()
            } else if (Object.keys(options.mapping[opt])[0] == 'factor'){
                if (opt in defaults) this[defaults[opt].discrete]()
            }
        }

        // add to plot accessors if it is not already created
        if (!this._plot_accessors.hasOwnProperty(opt)) this._plot_accessors[opt] = this._current_layer.accessors[`${options.name}-${opt}`]
    }

    // handle extended position scales
    let extended_scales = ['xend', 'yend', 'xmin', 'ymin', 'xmax', 'ymax']
    let extended_scales_in_options = extended_scales.filter(d => Object.keys(options.mapping).includes(d))

    for (let opt of extended_scales_in_options) {
        // detect axis
        let axis = opt.charAt(0)

        // load existing axis accessor or create empty object
        let scale = this._current_layer.accessors[`${this._current_layer.name}-${axis}`] || {}
        // if empty object is created, add to current layer accessors
        if (!this._current_layer.accessors[`${this._current_layer.name}-${axis}`]) this._current_layer.accessors[`${this._current_layer.name}-${axis}`] = scale
       
        // add missing elements to accessor
        if (!scale.range) scale.range = axis == 'x' ? 'width' : '-height'  
        if (!scale.type) scale.type = 'linear'  
        if (!scale.domain) scale.domain = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]
        let extent = d3.extent(options.data, d => d[options.mapping[opt]])
        if(extent[0] < scale.domain[0]) scale.domain[0] = extent[0]
        if(extent[1] > scale.domain[1]) scale.domain[1] = extent[1]

        // add a copy of the accessor for the extended mapping (xmin, ymin etc) and add field name
        this._current_layer.accessors[`${this._current_layer.name}-${opt}`] = {...this._current_layer.accessors[`${this._current_layer.name}-${axis}`], ...{field: options.mapping[opt]}}

        // if accessors are not in the plot accessor list, add them
        if (!this._plot_accessors.hasOwnProperty(opt)) this._plot_accessors[opt] = this._current_layer.accessors[`${options.name}-${opt}`]
        if (!this._plot_accessors.hasOwnProperty(axis)) this._plot_accessors[axis] = this._current_layer.accessors[`${options.name}-${axis}`]

    }

    return options
};

// Colour related aesthetics: colour, fill, and alpha
H.gg.prototype.aes_colour_fill_alpha = function (x) {
    this.x = x;
    return this;
};

// Aesthetics: grouping
H.gg.prototype.aes_group_order = function (x) {
    this.x = x;
    return this;
};

// Differentiation related aesthetics: linetype, size, shape
H.gg.prototype.aes_linetype_size_shape= function (x) {
    this.x = x;
    return this;
};

// Position related aesthetics: x, y, xmin, xmax, ymin, ymax, xend, yend
H.gg.prototype.aes_position = function (x) {
    this.x = x;
    return this;
};