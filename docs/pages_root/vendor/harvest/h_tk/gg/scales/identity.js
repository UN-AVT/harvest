H.gg.prototype.scale_identity = function (options={}) {

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'

        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]

        for (let shape of this._current_layer.draw){
            if (!shape.stroke && (aes  == 'color' || aes  == 'linetype' || aes  == 'size')) shape.stroke = {}
            if (aes == 'color') shape.stroke.color = `[${scale.field}]`
            if (aes == 'alpha') shape.alpha = `[${scale.field}]`
            if (aes == 'linetype') shape.stroke.dash = `[${scale.field}]`
            if (aes == "linetype" && shape.name == 'line') shape.dash = `[${scale.field}]`
            if (aes == "size" && shape.name != 'point') shape.stroke.width = `[${scale.field}]`
            if (aes == "width") shape.w = `[${scale.field}]`
            if (aes == "fill") shape.color = `[${scale.field}]`
            if (aes == "x") shape.x = `[${scale.field}]`
            if (aes == "y") shape.y = `[${scale.field}]`
        }

        delete this._current_layer.accessors[`${this._current_layer.name}-${aes}`]

    }
};

// Use values without scaling
H.gg.prototype.scale_colour_identity = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_identity
    options = {...defaults, ...options}

    this.scale_identity(options)
};

// Use values without scaling
H.gg.prototype.scale_fill_identity = function (options={}) {
    let defaults = this.defaults.ggplot.scale_fill_identity
    options = {...defaults, ...options}

    this.scale_identity(options)
};

// Use values without scaling
H.gg.prototype.scale_shape_identity = function (options={}) {
    let defaults = this.defaults.ggplot.scale_shape_identity
    options = {...defaults, ...options}

    this.scale_identity(options)
};

// Use values without scaling
H.gg.prototype.scale_linetype_identity= function (options={}) {
    let defaults = this.defaults.ggplot.scale_linetype_identity
    options = {...defaults, ...options}

    this.scale_identity(options)
};

// Use values without scaling
H.gg.prototype.scale_alpha_identity = function (options={}) {
    let defaults = this.defaults.ggplot.scale_alpha_identity
    options = {...defaults, ...options}

    this.scale_identity(options)
};

// Use values without scaling
H.gg.prototype.scale_size_identity = function (options={}) {
    let defaults = this.defaults.ggplot.scale_size_identity
    options = {...defaults, ...options}

    this.scale_identity(options)
};

// Use values without scaling
H.gg.prototype.scale_discrete_identity = function (options={}) {
    let defaults = this.defaults.ggplot.scale_discrete_identity
    options = {...defaults, ...options}

    this.scale_identity(options)
};

// Use values without scaling
H.gg.prototype.scale_continuous_identity = function (options={}) {
    let defaults = this.defaults.ggplot.scale_continuous_identity
    options = {...defaults, ...options}

    this.scale_identity(options)
};