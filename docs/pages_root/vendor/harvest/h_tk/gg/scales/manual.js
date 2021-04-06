H.gg.prototype.scale_discrete_manual = function (options={}) {

    let defaults = this.defaults.ggplot.scale_discrete_manual
    options = {...defaults, ...options}

    if (!options.aesthetics) {
        const e = new Error('No aesthetic set for discrete manual scale'); 
        throw e;
    }

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'
        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]

        if (Array.isArray(options.values)){
            scale.range = options.values

        } else if (typeof options.values == 'object' && typeof options.values !== null){
            scale.range = Object.values(options.values)
            scale.domain = Object.keys(options.values)
        }
    }
}	


H.gg.prototype.scale_colour_manual = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_manual
    options = {...defaults, ...options}

    this.scale_discrete_manual(options)
}

H.gg.prototype.scale_fill_manual = function (options={}) {
    let defaults = this.defaults.ggplot.scale_fill_manual
    options = {...defaults, ...options}

    this.scale_discrete_manual(options)
}


H.gg.prototype.scale_size_manual = function (options={}) {
    let defaults = this.defaults.ggplot.scale_size_manual
    options = {...defaults, ...options}

    this.scale_discrete_manual(options)
}

H.gg.prototype.scale_shape_manual = function (options={}) {
    let defaults = this.defaults.ggplot.scale_shape_manual
    options = {...defaults, ...options}

    this.scale_discrete_manual(options)
}

H.gg.prototype.scale_linetype_manual = function (options={}) {
    let defaults = this.defaults.ggplot.scale_linetype_manual
    options = {...defaults, ...options}

    this.scale_discrete_manual(options)
}

H.gg.prototype.scale_alpha_manual = function (options={}) {
    let defaults = this.defaults.ggplot.scale_alpha_manual
    options = {...defaults, ...options}

    this.scale_discrete_manual(options)
}