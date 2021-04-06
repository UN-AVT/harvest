// Gradient colour scales
H.gg.prototype.scale_colour_steps = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_steps
    options = {...defaults, ...options}

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'
        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]

        let linearScale = d3.scaleLinear()
            .domain(d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field]))
            .range([options.low, options.high])
            .interpolate(d3[`interpolate${options.space}`])

        let bin = d3.histogram()
            .value(d => d[scale.field])
            .thresholds(options.breaks || options.n.breaks);

        let binned = bin(this._current_layer.data[0].content.flat())

        scale.type = 'quantize' 
        scale.domain = d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field])
        scale.range = binned.map(d => linearScale(d.x0))
        delete scale.interpolator
        delete scale.interpolate
        scale.unknown = options.na.value

    }
};

// Gradient colour scales
H.gg.prototype.scale_colour_steps2 = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_steps2
    options = {...defaults, ...options}

    if (!Array.isArray(options.aesthetics)){
        options.aesthetics = [options.aesthetics]
    }

    for (let aes of options.aesthetics){
        if (aes == 'colour') aes = 'color'

        let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]
        let domain = d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field])

        let linearScale = d3.scaleLinear()
            .domain([domain[0], options.midpoint, domain[1]])
            .range([options.low, options.mid, options.high])
            .interpolate(d3[`interpolate${options.space}`])

        let bin = d3.histogram()
            .value(d => d[scale.field])
            .thresholds(options.breaks || options.n.breaks);

        let binned = bin(this._current_layer.data[0].content.flat())

        scale.type = 'quantize' 
        scale.domain = [domain[0], options.midpoint, domain[1]]
        scale.range = binned.map(d => linearScale(d.x0))
        delete scale.interpolator
        delete scale.interpolate
        scale.unknown = options.na.value
    }
};

// Gradient colour scales
H.gg.prototype.scale_colour_stepsn = function (options={}) {
    let defaults = this.defaults.ggplot.scale_colour_stepsn
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

        let linearScale = d3.scaleLinear()
            .domain(options.values || [domain[0], domain[1]])
            .range(options.colours || [])
            .interpolate(d3[`interpolate${options.space}`])

        let bin = d3.histogram()
            .value(d => d[scale.field])
            .thresholds(options.breaks || options.n.breaks);

        let binned = bin(this._current_layer.data[0].content.flat())

        scale.type = 'quantize' 
        scale.domain = options.values || [domain[0], domain[1]]
        scale.range = binned.map(d => linearScale(d.x0))
        delete scale.interpolator
        delete scale.interpolate
        scale.unknown = options.na.value
    }
};

// Gradient colour scales
H.gg.prototype.scale_fill_steps = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_steps(options)
};

// Gradient colour scales
H.gg.prototype.scale_fill_steps2 = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_steps2(options)
};

// Gradient colour scales
H.gg.prototype.scale_fill_stepsn = function (options={}) {
    options.aesthetics = options.aesthetics || 'fill'
    this.scale_colour_stepsn(options)
};