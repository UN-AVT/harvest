/**
 *  @fileOverview ggplot geoms.
 *
 *  @author       UNITED NATIONS
 *  @author       BTA-AVT
 *
 *  @requires     HARVEST
 * 
 * @this gg
 * @memberof gg
 * 
 */

/**
 * @description Diagonal Reference Line
 * @see https://ggplot2.tidyverse.org/reference/geom_abline.html
 */
H.gg.prototype.geom_abline = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_abline

    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    // extract X & Y field names
    let x_field = typeof this._aes.x === 'object' && this._aes.x !== null ? this._aes.x.factor : this._aes.x
    let y_field = typeof this._aes.y === 'object' && this._aes.y !== null ? this._aes.y.factor : this._aes.y

    let x_domain = l.accessors[`${l.name}-x`].domain

    // override data with custom data array to draw line
    l.data[0].content = [
        {
            [y_field]: options.slope * x_domain[0] + options.intercept,
            [x_field]: x_domain[0]
        },
        {
            [y_field]: options.slope * x_domain[1] + options.intercept,
            [x_field]: x_domain[1]
        }
    ]

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

};


/**
 * @description Horizontal Reference Line
 * @see https://ggplot2.tidyverse.org/reference/geom_abline.html
 */
H.gg.prototype.geom_hline = function (options) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_hline

    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    // extract X & Y field names
    let x_field = typeof this._aes.x === 'object' && this._aes.x !== null ? this._aes.x.factor : this._aes.x
    let y_field = typeof this._aes.y === 'object' && this._aes.y !== null ? this._aes.y.factor : this._aes.y

    // override data with custom data array to draw line
    l.data[0].content = [
        {
            [y_field]: options.yintercept,
            [x_field]: l.accessors[`${l.name}-x`].domain[0]
        },
        {
            [y_field]: options.yintercept,
            [x_field]: l.accessors[`${l.name}-x`].domain[l.accessors[`${l.name}-x`].domain.length - 1]
        }
    ]

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

};


/**
 * @description Vertical Reference Line
 * @see https://ggplot2.tidyverse.org/reference/geom_abline.html
 */
H.gg.prototype.geom_vline = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_vline
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    // extract X & Y field names
    let x_field = typeof this._aes.x === 'object' && this._aes.x !== null ? this._aes.x.factor : this._aes.x
    let y_field = typeof this._aes.y === 'object' && this._aes.y !== null ? this._aes.y.factor : this._aes.y
    
    // override data with custom data array to draw line
    l.data[0].content = [
        {
            [x_field]: options.xintercept,
            [y_field]: l.accessors[`${l.name}-y`].domain[0]
        },
        {
            [x_field]: options.xintercept,
            [y_field]: l.accessors[`${l.name}-y`].domain[l.accessors[`${l.name}-y`].domain.length - 1]
        }
    ]

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

};


/**
 * @description Bar charts (count)
 * @see https://ggplot2.tidyverse.org/reference/geom_bar.html
 */
H.gg.prototype.geom_bar = function (options = {}) {
    
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_bar
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_col(options)

};


/**
 * @description Bar charts
 * @see https://ggplot2.tidyverse.org/reference/geom_bar.html
 */
H.gg.prototype.geom_col = function (options) {
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_col
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    if (options.aes.y && options.aes.y.factor) {
        options = H.Clone.deep(options)
        let tempY = options.aes.y.factor
        options.aes.y = options.aes.x
        options.aes.x = { factor: tempY }
        options.rotate = 90
    }

    // call stat function to wrangle and return data 
    options = this.stat(options)

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)


    // add accessor names to the draw object
    if (l.accessors.hasOwnProperty(`${l.name}-width`)) {
        l.options._shape.w = `${l.name}-x`
    }

    if (l.accessors.hasOwnProperty(`${l.name}-b`)) {
        l.options._shape.b = `${l.name}-y`
    }
    else if (d3.min(l.options.data.flat(), d => d[l.options.mapping.y]) < 0) {
        l.options._shape.b = `bindAccessor(${l.name}-y,0)`
    }

    // push draw object to array
    l.draw.push(l.options._shape)


    // position fill (bars fill plot as percentage values)
    if (l.options.position && l.options.position == 'fill') {
        console.log('fill stacking')

        this.position_fill(options)
    }

    //stacking
    if ((l.options.mapping.fill && l.options.position == 'stack')) {
        console.log('stacking')
        if (!l.options.mapping.fill.factor) {
            const e = new Error('selected mapping is not factorized');
            throw e;
        }

        this.position_stack()
    }

    //grouping
    if (l.options.position && l.options.position != 'fill' && l.options.position != 'stack') {
        console.log('grouping')

        if (typeof options.position == 'string') {
            this[`position_${options.position}`]()
        } else {
            let keys = Object.keys(options.position)
            this[keys[0]]()
        }
    }

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};


/**
 * @description Heatmap of 2d bin counts
 * @see https://ggplot2.tidyverse.org/reference/geom_bin2d.html
 */
H.gg.prototype.geom_bin2d = function (options = {}) {
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_bin2d
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // call stat function to wrangle and return data 
    options = this.stat_bin_2d(options)

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    l.data[0].content.forEach(d => {
        d[l.options.mapping.w] = d[l.options.mapping.w] + l.accessors[`${l.name}-x`].domain[0]
        d[l.options.mapping.h] = d[l.options.mapping.h] + l.accessors[`${l.name}-y`].domain[0]
    })

    l.accessors[`${l.name}-w`].range = l.accessors[`${l.name}-x`].range
    l.accessors[`${l.name}-w`].domain = l.accessors[`${l.name}-x`].domain
    l.options._shape.w = `${l.name}-w`

    l.accessors[`${l.name}-h`].range = l.accessors[`${l.name}-y`].range
    l.accessors[`${l.name}-h`].domain = l.accessors[`${l.name}-y`].domain
    l.options._shape.h = `${l.name}-h`

    l.options._shape.shape = 1

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l


};


/**
 * @description Draw Nothing
 * @see https://ggplot2.tidyverse.org/reference/geom_blank.html
 */
H.gg.prototype.geom_blank = function (options = {}) {
    if (!options.geom) options.geom = 'blank'
    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};


/**
 * @description Box Plot
 * @see https://ggplot2.tidyverse.org/reference/geom_boxplot.html
 */
H.gg.prototype.geom_boxplot = function (options = {}) {
    if (!options.geom) options.geom = 'boxplot'
    
    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    if (options.aes.y && options.aes.y.factor) {
        options = H.Clone.deep(options)
        let tempY = options.aes.y.factor
        options.aes.y = options.aes.x
        options.aes.x = { factor: tempY }
        options.rotate = 90
    }

    let data = H.Clone.deep(options.data)
    if (options.outliers) data = this.stat_outliers(options)
    
    // call stat function to wrangle and return data 
    options = this.stat_boxplot(options)

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    //handle replicating scale domains
    l.accessors[`${l.name}-y`].domain = [d3.min(l.options.data.flat(), d => d.min), d3.max(l.options.data.flat(), d => d.max)]
    l.accessors[`${l.name}-max`] = { field: 'max', domain: l.accessors[`${l.name}-y`].domain }
    l.accessors[`${l.name}-min`] = { field: 'min', domain: l.accessors[`${l.name}-y`].domain }
    l.accessors[`${l.name}-lower`] = { field: 'lower', domain: l.accessors[`${l.name}-y`].domain }
    l.accessors[`${l.name}-middle`] = { field: 'middle', domain: l.accessors[`${l.name}-y`].domain }
    l.accessors[`${l.name}-upper`] = { field: 'upper', domain: l.accessors[`${l.name}-y`].domain }
    l.accessors[`${l.name}-notchUpper`] = { field: 'notchUpper', domain: l.accessors[`${l.name}-y`].domain }
    l.accessors[`${l.name}-notchLower`] = { field: 'notchLower', domain: l.accessors[`${l.name}-y`].domain }

    // override layer generated shape object
    l.draw = l.draw = []
    let shape = { name: 'boxplot', data: l.name, frame: l.name, x: `${l.name}-x`, y: `${l.name}-middle`, min: `${l.name}-min`, max: `${l.name}-max`, lower: `${l.name}-lower`, upper: `${l.name}-upper`, notchLower: `${l.name}-notchLower`, notchUpper: `${l.name}-notchUpper`, whiskerLen: 0 }
    if (!options.width) options.width = 0.8

    // adjust shape parameters to geom options
    if (options.notch) shape.notchWidth = options.width * 0.7
    shape.notchWidth = options.notchWidth ? options.notchWidth : options.width
    if (options.color || options.linetype || options.size) shape.stroke = {}
    if (options.fill) shape.color = options.fill
    if (options.color) shape.stroke.color = options.color
    if (options.linetype) shape.stroke.style = options.linetype
    if (options.size) shape.stroke.width = options.size
    if (options.width) shape.width = options.width
    
    // push draw object to array
    l.draw.push(shape)

    if (options.outliers) {
        console.log(data)
        let outlier_opts = {
            data: data,
            name: 'boxplot_outlier_layer',
            outliers: true,
        }

        if (options.rotate) outlier_opts.rotate = options.rotate

        // extract outliers options to pass to the geom_point
        if (typeof options.outliers === 'object' && options.outliers !== null) outlier_opts = { ...outlier_opts, ...options.outliers }
        
        // Wrangled options and passed to geom point to create outliers.
        this.geom_point(outlier_opts)
    }

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};


// 2D contours of a 3D surface
H.gg.prototype.geom_contour = function (options = {}) {
    options.no_fill = true

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    return this.geom_contour_filled(options)
};

// 2D contours of a 3D surface
H.gg.prototype.geom_contour_filled = function (options = {}) {
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_contour_filled
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    if (!options.bins) options.bins = 30

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // let d3bins = d3.contourDensity()
    // .x(d => d[options.aes.x])
    // .y(d => d[options.aes.y])
    // .size([500, 500])
    // .bandwidth(30)
    // .thresholds(30)
    // (options.data)

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    l.accessors[`${l.name}-fill`] = { field: 'value', domain: [], type: 'linear', range: [0, 1], postFilter: d3.interpolateYlGnBu }
    
    // override layer generated shape object
    let shape = { name: 'geopath', frame: `${l.name}`, x: `${l.name}-x`, y: `${l.name}-y`, data: `${l.name}`, contour: { bandwidth: 30, thresholds: options.bins }, color: `${l.name}-fill`, stroke: { width: 1 }, clip: true }
    if (options.no_fill == true) {
        shape.color = 'rgba(0,0,0,0)'
        shape.stroke.color = `${l.name}-fill`
    }

    // push draw object to array
    l.draw.push(shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

};


/**
 * @description Count overlapping points
 * @see https://ggplot2.tidyverse.org/reference/geom_count.html
 */
H.gg.prototype.geom_count = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_count
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // call stat function to wrangle and return data 
    options = this.stat(options)

    // add aes mapping entry to use the data point that is created by stat_count
    options.aes.size = 'COUNT'

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_point(options)

};


/**
 * @description Smoothed density estimates
 * @see https://ggplot2.tidyverse.org/reference/geom_density.html
 */
H.gg.prototype.geom_density = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_density
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // call stat function to wrangle and return data 
    options = this.stat(options)
    
    // add aes mapping entries to use the data points that is created by stat_density
    options.aes.x = "x"
    options.aes.y = "y"

    // block stroke size override
    if (!options.size) options.size = 1

    // add / block override of curve
    options.curve = d3.curveBasis

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_area(options)

};

// Contours of a 2D density estimate
// H.gg.prototype.geom_density_2d = function (options={}) {
//     if (!options.geom) options.geom = 'density_2d'
//     // check options and fill in missing aes or data with globals 
    // options = this.check(options)

//     options = this.stat_density_2d(options)

//     options.aes.x = 'x'
//     options.aes.y = 'y'
//     options.aes.color = {factor:'val'}
//     options.aes.fill = {factor:'val'}

//     // options.fill = 'rgba(0,0,0,0)'
//     options.color = 'blue'
//     options.size = 1
//     this.geom_area(options)
// };

// Contours of a 2D density estimate
// H.gg.prototype.geom_density_2d_filled = function (n) {
//     this.amount += n;
//     return this;
// };


/**
 * @description Dot Plot Histogram
 * @see https://ggplot2.tidyverse.org/reference/geom_dotplot.html
 */
H.gg.prototype.geom_dotplot = function (options = {}) {
    if (!options.geom) options.geom = 'dotplot'
    // check options and fill in missing aes or data with globals 
    options = this.check(options)
    
    // call stat function to wrangle and return data 
    options = this.stat_bin(options)

    let data = options.data
    let dots = []

    // create wrangled data (no separate stat for wrangling as this is not a layer, only options)
    let increment = d3.max(data, d => d.y) / options.bins
    for (let index in data) {
        for (let i = increment; i < data[index].y; i += increment) {
            let dot = { x: data[index].x, y: i }
            if (options.aes.fill) dot[options.aes.fill.factor] = data[index][options.aes.fill.factor]
            dots.push(dot)
        }
    }

    // replace data in options
    options.data = dots

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    return this.geom_point(options)
};


/**
 * @description Horizontal error bars
 * @see https://ggplot2.tidyverse.org/reference/geom_errorbarh.html
 */
H.gg.prototype.geom_errorbarh = function (options = {}) {
    
    // add rotate flag to rotate layer
    options.rotate = 90

    // switch width and height  / x & y as these options will be sent to geom_errorbar
    if (options.height) options.width = options.height
    options.aes.ymin = options.aes.xmin
    options.aes.ymax = options.aes.xmax
    delete options.aes.xmin
    delete options.aes.xmax

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    return this.geom_errorbar(options);
};


/**
 * @description Draw a function as a continuous curve
 * @see https://ggplot2.tidyverse.org/reference/geom_function.html
 */
H.gg.prototype.geom_function = function (options = {}) {
    // geom defaults
    let defaults = {
        n: 50,
        func: (x) => {
            return 0.5 * Math.exp(-Math.abs(x / 2)) // example function
        }
    }

    // merge default options with user overrides 
    options = { ...defaults, ...options }

    let data = []

    // wrangle data
    for (let i = -Math.abs(options.n / 2); i < Math.abs(options.n / 2); i++) {
        data.push({ x: i, y: options.func(i) })
    }

    // set options aes & wrangled data
    options.aes = { x: 'x', y: 'y', fill: 'y' }
    options.data = data

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    options.geom == 'point' ? this.geom_point(options) : this.geom_line(options)
};


/**
 * @description Hexagonal heatmap of 2d bin counts
 * @see https://ggplot2.tidyverse.org/reference/geom_hex.html
 */
H.gg.prototype.geom_hex = function (options = {}) {
    
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_hex
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    // Manual colour accessor - *NEEDS FIXING TO ALLOW FOR OTHER COLOUR SCALES*
    l.accessors[`${l.name}-color`] = { field: 'color', domain: [0, 600], range: ['transparent', '#69b3a2'] }
    
    // override layer generated shape object
    let shape = { name: 'binhex', data: l.name, frame: l.name, x: `${l.name}-x`, y: `${l.name}-y`, color: `${l.name}-color`, hexSize: 9 }
    
    // push draw object to array
    l.draw.push(shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

};

/**
 * @description frequency polygons
 * @see https://ggplot2.tidyverse.org/reference/geom_dotplot.html
 */
H.gg.prototype.geom_freqpoly = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_freqpoly
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)
    
    // call stat function to wrangle and return data 
    options = this.stat_bin(options)
    
    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_line(options)
};

/**
 * @description Histogram
 * @see https://ggplot2.tidyverse.org/reference/geom_dotplot.html
 */
H.gg.prototype.geom_histogram = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_histogram
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)
    
    // call stat function to wrangle and return data 
    options = this.stat_bin(options)

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_col(options)
};


/**
 * @description Jittered points
 * @see https://ggplot2.tidyverse.org/reference/geom_jitter.html
 */
H.gg.prototype.geom_jitter = function (options = {}) {
    //height not implemented
    if (options.width) {
        options.jitter = { width: options.width }
        delete options.width
    }
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_jitter
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_point(options)
};


/**
 * @description Crossbars
 * @see https://ggplot2.tidyverse.org/reference/geom_linerange.html
 */
H.gg.prototype.geom_crossbar = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_crossbar
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    //handle replicating scale domains
    l.accessors[`${l.name}-ymax`].domain = l.accessors[`${l.name}-y`].domain
    l.accessors[`${l.name}-ymin`].domain = l.accessors[`${l.name}-y`].domain

    // add accessor names to the draw object
    l.options._shape.min = `${l.name}-ymin`
    l.options._shape.max = `${l.name}-ymax`
    l.options._shape.lower = `${l.name}-ymin`
    l.options._shape.upper = `${l.name}-ymax`
    l.options._shape.notchLower = `${l.name}-y`
    l.options._shape.notchUpper = `${l.name}-y`

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};

/**
 * @description Error Bars
 * @see https://ggplot2.tidyverse.org/reference/geom_linerange.html
 */
H.gg.prototype.geom_errorbar = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_errorbar
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    if (!l.accessors[`${l.name}-y`].field) l.accessors[`${l.name}-y`].field = l.accessors[`${l.name}-ymax`].field

    // add accessor names to the draw object
    l.options._shape.y0 = `${l.name}-ymin`
    l.options._shape.y1 = `${l.name}-ymax`

    if (options.width != null) l.options._shape.whiskerLen = options.width

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};


/**
 * @description Linerange
 * @see https://ggplot2.tidyverse.org/reference/geom_linerange.html
 */
H.gg.prototype.geom_linerange = function (options) {
    // remove whiskers on errorbar
    options.width = 0

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    return this.geom_errorbar(options)
};


/**
 * @description Pointrange
 * @see https://ggplot2.tidyverse.org/reference/geom_linerange.html
 */
H.gg.prototype.geom_pointrange = function (options) {
    options.width = 1

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    let bars = this.geom_errorbar(H.Clone.deep(options))

    // geom_point is used to add point
    if (options.color) options.fill = options.color
    let point = this.geom_point(options)
    return bars;
};


/**
 * @description Polygons from a reference map
 * @see https://ggplot2.tidyverse.org/reference/geom_map.html
 */
H.gg.prototype.geom_map = function (options = {}) {
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_map
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

};


/**
 * @description Path
 * @see https://ggplot2.tidyverse.org/reference/geom_path.html
 */
H.gg.prototype.geom_path = function (options = {}) {
    // lineend = "butt",
    // linejoin = "round",
    // linemitre = 10,
    // arrow = NULL,

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_line(options)
};


/**
 * @description Line
 * @see https://ggplot2.tidyverse.org/reference/geom_path.html
 */
H.gg.prototype.geom_line = function (options = {}) {
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_line
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    l.options._shape.x = `${l.name}-x`
    l.options._shape.y = `${l.name}-y`

    if (l.options.curve) l.options._shape.curve = l.options.curve
    if (!l.options._shape.stroke) l.options._shape.stroke = {}


    // if (l.options.mapping.color || l.options.mapping.linetype){
    //     let colors, lines
    //     if (l.options.mapping.color) colors = d3.map(l.options.data.flat(), d => d[l.options.mapping.color.factor]).keys()
    //     if (l.options.mapping.linetype) lines = d3.map(l.options.data.flat(), d => d[l.options.mapping.linetype.factor]).keys()
    //     if (l.options.mapping.color && l.options.mapping.linetype){

    //         for (let color of colors){
    //             for (let line of lines){

    //                 let data = l.options.data.flat().filter(d => d[l.options.mapping.color.factor] == color)
    //                 data = l.options.data.flat().filter(d => d[l.options.mapping.linetype.factor] == line)

    //                 l.data.push({name:`${l.name}-${color}-${line}`, content: data})

    //                 l.options._shape.data = `${l.name}-${color}-${line}`
    //                 l.options._shape.stroke.color = `bindAccessor(${l.name}-color,${color})`
    //                 l.options._shape.dash = `bindAccessor(${l.name}-linetype,${line})`

    //                 l.draw.push(H.Clone.deep(l.options._shape))

    //             }
    //         }
    //     } else if (l.options.mapping.color){
    //         for (let color of colors){

    //             let data = l.options.data.flat().filter(d => d[l.options.mapping.color.factor] == color)

    //             l.data.push({name:`${l.name}-${color}`, content: data})

    //             l.options._shape.data = `${l.name}-${color}`
    //             l.options._shape.stroke.color = `bindAccessor(${l.name}-color,${color})`

    //             l.draw.push(H.Clone.deep(l.options._shape))

    //         }
    //     } else if (l.options.mapping.linetype){
    //         for (let line of lines){

    //             let data = l.options.data.flat().filter(d => d[l.options.mapping.linetype.factor] == line)

    //             l.data.push({name:`${l.name}-${line}`, content: data})

    //             l.options._shape.data = `${l.name}-${line}`
    //             l.options._shape.stroke.dash = `bindAccessor(${l.name}-linetype,${line})`

    //             l.draw.push(H.Clone.deep(l.options._shape))

    //         }
    //     }
    // } else {
    // }

    // push draw object to array
    l.draw.push(l.options._shape)



    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};


/**
 * @description Step
 * @see https://ggplot2.tidyverse.org/reference/geom_path.html
 */
H.gg.prototype.geom_step = function (options = {}) {
    options.curve = d3.curveStep

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_line(options);
};


/**
 * @description Points
 * @see https://ggplot2.tidyverse.org/reference/geom_point.html
 */
H.gg.prototype.geom_point = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_point
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    if (options.outliers) {
        if (!l.data[0].content[0].hasOwnProperty('IQR')) l.data[0].content = this.stat_outliers(options)
        l.data[0].content = l.data[0].content.filter(d => d.IQR == 'True')
    }

    // add accessor names to the draw object
    if (l.accessors.hasOwnProperty(`${l.name}-size`)) l.options._shape.size = `${l.name}-size`
    if (options.size) l.options._shape.size = options.size
    if (l.options.hasOwnProperty('stroke')) {
        l.options._shape.stroke ? l.options._shape.stroke.width = l.options.stroke : l.options._shape.stroke = { width: l.options.stroke }
    }
    if (l.accessors.hasOwnProperty(`${l.name}-shape`)) l.options._shape.shape = `${l.name}-shape`
    if (options.shape) l.options._shape.shape = l.options.shape
    if (options.jitter && (typeof options.jitter == 'string' || typeof options.jitter == 'number')) l.options._shape.jitter = l.options.jitter

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    if (options.jitter && (typeof options.jitter != 'string' && typeof options.jitter != 'number')) this.position_jitter(options.jitter)

    // returns the layer for use with glyphs (see guides)
    return l
};

// geom_polygon
// H.gg.prototype.geom_polygon = function (n) {
//     this.n = n;
//     return this;
// };

// A quantile-quantile plot
// H.gg.prototype.geom_qq_line = function (n) {
//     this.n = n;
//     return this;
// };

// A quantile-quantile plot
// H.gg.prototype.stat_qq_line = function (n) {
//     this.n = n;
//     return this;
// };

// A quantile-quantile plot
// H.gg.prototype.geom_qq = function (n) {
//     this.n = n;
//     return this;
// };


// Quantile regression
// H.gg.prototype.geom_quantile = function (n) {
//     this.n = n;
//     return this;
// };

// Quantile regression
// H.gg.prototype.stat_quantile = function (n) {
//     this.n = n;
//     return this;
// };


/**
 * @description Ribbons and area plots
 * @see https://ggplot2.tidyverse.org/reference/geom_ribbon.html
 */
H.gg.prototype.geom_ribbon = function (options = {}) {
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_ribbon
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    //need to fix
    l.options._shape.y0 = `${l.name}-ymin`
    l.options._shape.y1 = `${l.name}-ymax`

    //handle replicating scale domains
    l.accessors[`${l.name}-ymin`] = { ...l.accessors[`${l.name}-y`], ...l.accessors[`${l.name}-ymin`] }
    l.accessors[`${l.name}-ymax`] = { ...l.accessors[`${l.name}-y`], ...l.accessors[`${l.name}-ymax`] }

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

};


/**
 * @description Ribbons and area plots
 * @see https://ggplot2.tidyverse.org/reference/geom_ribbon.html
 */
H.gg.prototype.geom_area = function (options = {}) {
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_area
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    l.options._shape.x = `${l.name}-x`
    l.options._shape.y0 = 0
    l.options._shape.y1 = `${l.name}-y`

    if (l.options.curve) l.options._shape.curve = l.options.curve
    if (!l.options._shape.stroke) l.options._shape.stroke = {}

    if (l.options.mapping.color) {
        let keys = d3.map(l.options.data.flat(), d => d[l.options.mapping.color.factor]).keys()

        for (let key of keys) {
            let data = l.options.data.flat().filter(d => d[l.options.mapping.color.factor] == key)
            l.data.push({ name: `${l.name}-${key}`, content: data })

            l.options._shape.data = `${l.name}-${key}`
            l.options._shape.stroke.color = `bindAccessor(${l.name}-color,${key})`

            l.draw.push(H.Clone.deep(l.options._shape))

        }
    } else {
        // push draw object to array
        l.draw.push(l.options._shape)
    }

    // position fill (bars fill plot as percentage values)
    if (l.options.position && l.options.position == 'fill') {
        console.log('fill stacking')

        this.position_fill(options)
    }

    //stacking
    if ((l.options.mapping.fill && l.options.position == 'stack')) {
        console.log('stacking')
        if (!l.options.mapping.fill.factor) {
            const e = new Error('selected mapping is not factorized');
            throw e;
        }

        this.position_stack()
    }

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};


/**
 * @description Rug plots in the margins
 * @see https://ggplot2.tidyverse.org/reference/geom_rug.html
 */
H.gg.prototype.geom_rug = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_rug
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    l.draw = []

    for (let i = 0; i < options.sides.length; i++) {
        let shape = { name: 'rectangle', data: l.name, frame: l.name, w: 0.1, color: 'black', shape: 1 }

        let side = options.sides.charAt(i)

        if (side == 'b') {
            shape.x = `${l.name}-x`
            shape.h = options.outside ? -options.length * 10 : options.length * 10
            shape.y = 0
            l.draw.push(shape)
        }

        if (side == 'l') {
            shape.x = options.outside ? -options.length / 2 : options.length / 2
            shape.h = 1,
                shape.y = `${l.name}-y`
            shape.w = options.outside ? -options.length : options.length
            l.draw.push(shape)
        }

    }

    l.frames[0].crop = false

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};


/**
 * @description Line segments
 * @see https://ggplot2.tidyverse.org/reference/geom_segment.html
 */
H.gg.prototype.geom_segment = function (options = {}) {
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_segment
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // create data for segment
    options.data = [
        {
            y: options.aes.y,
            x: options.aes.x
        },
        {
            y: options.aes.yend,
            x: options.aes.xend
        }
    ]

    // create aes for segment
    options.aes = {
        x: 'x',
        y: 'y'
    }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    if (!options.geom) options.geom = 'segment'
    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};


/**
 * @description Curves
 * @see https://ggplot2.tidyverse.org/reference/geom_segment.html
 */
H.gg.prototype.geom_curve = function (options = {}) {
    if (!options.geom) options.geom = 'curve'

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_segment(options)
};


/**
 * @description Smoothed conditional means
 * @see https://ggplot2.tidyverse.org/reference/geom_smooth.html
 */
H.gg.prototype.geom_smooth = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_smooth
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)
    
    // call stat function to wrangle and return data 
    options = this.stat_smooth(options)

    // force colour and curve option
    if (!options.color) options.color = 'blue' // could be removed or added to definitions.js
    options.curve = d3.curveMonotoneX

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_line(options)
};


// Line segments parameterised by location, direction and distance
H.gg.prototype.geom_spoke = function (options = {}) {
    if (!options.fill) options.fill = 'black' // override default color

    // call geom point before adding directional line
    this.geom_point(H.Clone.deep(options));

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_spoke

    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // add radius ans angle to data
    options.data.forEach(d => {
        d[options.aes.radius] = d[options.aes.y] + d[options.aes.radius]
        d[options.aes.angle] = (360 - d[options.aes.angle]) + 90 //start from the east and go counterclockwise
    })

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)
    
    // override radius accessors to reference y accessor
    l.accessors[`${l.name}-radius`].range = l.accessors[`${l.name}-y`].range
    l.accessors[`${l.name}-radius`].domain = l.accessors[`${l.name}-y`].domain
    l.accessors[`${l.name}-radius`].type = l.accessors[`${l.name}-y`].type

    l.accessors[`${l.name}-angle`] = { field: l.options.mapping.angle, domain: [0, 360], range: [0, 360] } // Rad to degree

    l.options._shape.b = `${l.name}-radius`
    l.options._shape.y = `${l.name}-y`
    l.options._shape.w = 2
    l.options._shape.rotate = `${l.name}-angle`
    l.options._shape.rotateOrigin = 'xy'
    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

};



/**
 * @description Text
 * @see https://ggplot2.tidyverse.org/reference/geom_text.html
 */
H.gg.prototype.geom_label = function (options = {}) {
    // get geom defaults
    let defaults = this.defaults.ggplot.geom_label
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    if (options.aes.y && options.aes.y.factor) {
        options = H.Clone.deep(options)
        let tempY = options.aes.y.factor
        options.aes.y = options.aes.x
        options.aes.x = { factor: tempY }
        options.rotate = 90
    }

    if ((!options.aes.y || options.aes.y == 'COUNT') && options.stat == 'identity') options.stat = 'count'

    // call stat function to wrangle and return data 
    options = this.stat(options)

    if (options.aes.y == 'COUNT' && !options.aes.label) options.aes.label = 'COUNT'

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    if (!l.options.mapping.label) {
        const e = new Error('No label option set in aes');
        throw e;
    }

    l.options._shape.value = l.options.mapping.label
    l.options._shape.color = 'black'
    l.options._shape['text-anchor'] = 'middle'

    if (l.options.size) {
        if (!l.options._shape.font) l.options._shape.font = {}
        l.options._shape.font.size = options.size
    }

    if (l.options.mapping.fill && l.options.position == 'stack') {
        let offset_size = l.options._shape.font ? l.options._shape.font.size ? l.options._shape.font.size * 0.4 : 10 * 0.4 : 10 * 0.4
        l.options._shape.offset = { y: offset_size }
    }

    // set label to percent if position fill
    if ((l.options.position && typeof l.options.position == 'string' && l.options.position == 'fill') || l.options.position && Object.keys(l.options.position)[0] == 'position_fill') {
        l.options._shape.value = 'PERCENT'
        l.options._shape.contentHandler = d => `${(d * 100).toFixed(0)}%`
    }

    // push draw object to array
    l.draw.push(l.options._shape)

    // position fill (bars fill plot as percentage values)
    if (l.options.position && typeof l.options.position == 'string' && l.options.position == 'fill') {
        console.log('label fill stacking')
        this.position_fill({ vjust: 0.5 })
    } else if (l.options.position && Object.keys(l.options.position)[0] == 'position_fill') {
        this.position_fill(l.options.position[Object.keys(l.options.position)[0]])
    }

    //stacking
    if ((l.options.mapping.fill && l.options.position == 'stack')) {
        console.log('label stacking')
        if (!l.options.mapping.fill.factor) {
            const e = new Error('selected mapping is not factorized');
            throw e;
        }

        this.position_stack({ vjust: 0.5 })
    }

    //grouping
    if (l.options.position && typeof l.options.position == 'string' && l.options.position != 'fill' && l.options.position != 'stack') {
        console.log('grouping')

        if (typeof options.position == 'string') {
            this[`position_${options.position}`]()
        } else {
            let keys = Object.keys(options.position)
            this[keys[0]]()
        }
    }

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

};

/**
 * @description Label
 * @see https://ggplot2.tidyverse.org/reference/geom_text.html
 */
H.gg.prototype.geom_text = function (options = {}) {
    options.background = null

    // This geom does not directly create a layer. 
    // Wrangled options are passed to an additional geom.
    this.geom_label(options)

};

// Rectangles
// H.gg.prototype.geom_raster = function (n) {
//     this.n = n;
//     return this;
// };

/**
 * @description Rectangles
 * @see https://ggplot2.tidyverse.org/reference/geom_tile.html
 */
H.gg.prototype.geom_rect = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_rect
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // wrangle data from xmin / xmax to height and width
    options.data.forEach(d => {
        d[options.aes.xmax] = d[options.aes.xmax] - d[options.aes.xmin],
            d[options.aes.ymax] = d[options.aes.ymax] - d[options.aes.ymin]
        d[options.aes.ymin] = d[options.aes.ymin] + d[options.aes.ymax]
    })

    // alter aes names
    options.aes.x = options.aes.xmin
    options.aes.y = options.aes.ymin
    options.aes.w = options.aes.xmax
    options.aes.h = options.aes.ymax

    delete options.aes.xmin
    delete options.aes.ymin
    delete options.aes.xmax
    delete options.aes.ymax

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)
    
    // override width and height accessors to reference x and y accessor
    l.accessors[`${l.name}-w`].range = l.accessors[`${l.name}-x`].range
    l.accessors[`${l.name}-w`].domain = l.accessors[`${l.name}-x`].domain
    l.options._shape.w = `${l.name}-w`

    l.accessors[`${l.name}-h`].range = l.accessors[`${l.name}-y`].range
    l.accessors[`${l.name}-h`].domain = l.accessors[`${l.name}-y`].domain
    l.options._shape.h = `${l.name}-h`

    // shape 0 / 1 allow for different parameters to be used with the Hive rectangle plugin
    l.options._shape.shape = 1

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};

/**
 * @description Tiles
 * @see https://ggplot2.tidyverse.org/reference/geom_tile.html
 */
H.gg.prototype.geom_tile = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_tile
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    // alter naming to avoid clashes with shape parameters 
    options.aes.w = options.aes.width
    options.aes.h = options.aes.height

    delete options.aes.width
    delete options.aes.height

    options.data.forEach(d => {
        d[options.aes.y] = d[options.aes.y] + d[options.aes.h]
    })

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    // override width and height accessors to reference x and y accessor
    l.accessors[`${l.name}-w`].range = l.accessors[`${l.name}-x`].range
    l.accessors[`${l.name}-w`].domain = l.accessors[`${l.name}-x`].domain
    l.accessors[`${l.name}-w`].type = l.accessors[`${l.name}-x`].type
    l.options._shape.w = `${l.name}-w`

    l.accessors[`${l.name}-h`].range = l.accessors[`${l.name}-y`].range
    l.accessors[`${l.name}-h`].domain = l.accessors[`${l.name}-y`].domain
    l.accessors[`${l.name}-h`].type = l.accessors[`${l.name}-y`].type
    l.options._shape.h = `${l.name}-h`

    l.options._shape.shape = 1

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};

// Violin plot
H.gg.prototype.geom_violin = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_violin
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    if (options.aes.y && options.aes.y.factor) {
        options = H.Clone.deep(options)
        let tempY = options.aes.y.factor
        options.aes.y = options.aes.x
        options.aes.x = { factor: tempY }
        options.rotate = 90
    }

    // call stat function to wrangle and return data 
    options = this.stat(options)

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    l.accessors[`${l.name}-len`] = { field: 'len', range: [0, 1] } // need a normalized x
    l.accessors[`${l.name}-len`].domain = d3.extent(l.options.data.flat(), d => d.len)
    l.accessors[`${l.name}-x`].domain = d3.map(l.options.data.flat(), d => d[l.options.mapping.x.factor]).keys()
    l.accessors[`${l.name}-y`].domain = d3.extent(l.options.data.flat(), d => d[l.options.mapping.y])
    
    // add accessors names to the draw object
    l.options._shape.band = `${l.name}-x`
    l.options._shape.x = `${l.name}-len`

    // push draw object to array
    l.draw.push(l.options._shape)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

};

// Visualise sf objects
// H.gg.prototype.coord_sf = function (n) {
//     this.n = n;
//     return this;
// };

// Visualise sf objects
// H.gg.prototype.geom_sf = function (n) {
//     this.n = n;
//     return this;
// };

// Visualise sf objects
// H.gg.prototype.geom_sf_label = function (n) {
//     this.n = n;
//     return this;
// };

// Visualise sf objects
// H.gg.prototype.geom_sf_text = function (n) {
//     this.n = n;
//     return this;
// };

// new geoms
H.gg.prototype.geom_polar_bar = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_polar_bar
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    if (!options.aes.y) {
        options = this.stat_count(options)
        options.aes.y = 'COUNT'
    }

    let theta = options.theta || 'x'
    let angle = theta == 'x' ? 'x' : 'y'
    let radius = theta == 'x' ? 'y' : 'x'

    options.width = options.width || 1

    let margin = (1 - options.width) / 2

    if (options.position == 'stack' || options.position == 'fill') {

        let nested_data = d3.nest().key((d) => d[options.aes.x.factor]).entries(options.data)

        let stack = d3.stack()
            .keys(new Array(nested_data.length).fill().map((d, i) => i))
            .value((d, key) => key < d.values.length ? d.values[key][options.aes.y] : 0)
            (nested_data)

        console.log(stack)

        if (options.position == 'stack') {
            let max = d3.max(stack[stack.length - 1], d => d[1])

            stack.forEach((j, k) => {
                j.forEach((d, i) => {
                    d[`${angle}0`] = ((1000 / j.length) * i) + (margin * (1000 / j.length))
                    d[`${angle}1`] = ((1000 / j.length) * (i + 1)) - (margin * (1000 / j.length))
                    d[`${radius}0`] = ((1000 / max) * d[0])
                    d[`${radius}1`] = ((1000 / max) * d[1])
                    d[options.aes.fill.factor] = k < d.data.values.length ? d.data.values[k][options.aes.fill.factor] : d.data.values[0][options.aes.fill.factor]
                })
            })
        }

        if (options.position == 'fill') {
            let sum = stack[stack.length - 1].map(d => d3.sum(d.data.values, j => j[options.aes.y]))

            stack.forEach((j, k) => {
                j.forEach((d, i) => {
                    d[`${angle}0`] = ((1000 / j.length) * i) + (margin * (1000 / j.length))
                    d[`${angle}1`] = ((1000 / j.length) * (i + 1)) - (margin * (1000 / j.length))
                    d[`${radius}0`] = ((1000 / sum[i]) * d[0])
                    d[`${radius}1`] = ((1000 / sum[i]) * d[1])
                    d[options.aes.fill.factor] = k < d.data.values.length ? d.data.values[k][options.aes.fill.factor] : d.data.values[0][options.aes.fill.factor]
                })
            })
        }

        options.data = stack.flat()

    } else {

        //data wrangling
        let max = d3.max(options.data, d => d[options.aes.y])

        // with x value
        options.data.forEach((d, i) => {
            d[`${angle}0`] = ((1000 / options.data.length) * i) + (margin * (1000 / options.data.length))
            d[`${angle}1`] = ((1000 / options.data.length) * (i + 1)) - (margin * (1000 / options.data.length))
            d[`${radius}0`] = 0
            d[`${radius}1`] = ((1000 / max) * d[options.aes.y])
        })
    }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    l.options._shape.startAngle = `${l.name}-x0`
    l.options._shape.endAngle = `${l.name}-x1`
    l.options._shape.innerRadius = `${l.name}-y0`
    l.options._shape.outerRadius = `${l.name}-y1`


    // push draw object to array
    l.draw.push(l.options._shape)

    l.accessors[`${l.name}-x`] = {}
    l.accessors[`${l.name}-x`].domain = [1000, 0] // reversed domain to go cw or ccw.
    l.accessors[`${l.name}-x`].type = 'linear'
    l.accessors[`${l.name}-x`].range = 'circleRadians'

    l.accessors[`${l.name}-y`] = {}
    l.accessors[`${l.name}-y`].domain = [0, 1000]
    l.accessors[`${l.name}-y`].type = 'linear'
    l.accessors[`${l.name}-y`].range = 'height' // negative number to make a hole // padding between layers

    l.accessors[`${l.name}-x0`] = {}
    l.accessors[`${l.name}-x0`].domain = l.accessors[`${l.name}-x`].domain
    l.accessors[`${l.name}-x0`].type = l.accessors[`${l.name}-x`].type
    l.accessors[`${l.name}-x0`].range = l.accessors[`${l.name}-x`].range
    l.accessors[`${l.name}-x0`].field = 'x0'

    l.accessors[`${l.name}-x1`] = {}
    l.accessors[`${l.name}-x1`].domain = l.accessors[`${l.name}-x`].domain
    l.accessors[`${l.name}-x1`].type = l.accessors[`${l.name}-x`].type
    l.accessors[`${l.name}-x1`].range = l.accessors[`${l.name}-x`].range
    l.accessors[`${l.name}-x1`].field = 'x1'

    l.accessors[`${l.name}-y0`] = {}
    l.accessors[`${l.name}-y0`].domain = l.accessors[`${l.name}-y`].domain
    l.accessors[`${l.name}-y0`].type = l.accessors[`${l.name}-y`].type
    l.accessors[`${l.name}-y0`].range = l.accessors[`${l.name}-y`].range
    l.accessors[`${l.name}-y0`].field = 'y0'

    l.accessors[`${l.name}-y1`] = {}
    l.accessors[`${l.name}-y1`].domain = l.accessors[`${l.name}-y`].domain
    l.accessors[`${l.name}-y1`].type = l.accessors[`${l.name}-y`].type
    l.accessors[`${l.name}-y1`].range = l.accessors[`${l.name}-y`].range
    l.accessors[`${l.name}-y1`].field = 'y1'

    l.frames[0].bbox = { "w": "0%", "h": "49%" }
    l.frames[0].translate = { "x": "50%", "y": "75%" }

    // l.accessors = {...l.accessors, ...accessors}

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l
};

H.gg.prototype.geom_polar = function (options = {}) {
    if (!options.geom) options.geom = 'polar'

    // get geom defaults
    let defaults = this.defaults.ggplot.geom_polar
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    if (!options.aes.y) {
        options = this.stat_count(options)
        options.aes.y = 'COUNT'
    }

    // pre wrangle data to add angle
    let extX;
    let angle;
    if (!options.aes.x.factor) {
        extX = d3.extent(options.data, d => d[options.aes.x])
        angle = d3.scaleLinear().domain(extX).range([0, (2 * Math.PI)]);
        options.data = options.data.map((d, i) => { return { ...d, angle: angle(d[options.aes.x]) } })
    } else {
        extX = Array.from(new Set(options.data.map(d => d[options.aes.x.factor])))
        angle = d3.scaleBand().domain(extX).range([0, (2 * Math.PI)]);
        options.data = options.data.map((d, i) => { return { ...d, angle: angle(d[options.aes.x.factor]) } })
    }

    // create a layer with accessors, data draw array & frame
    let l = this.layer(options)

    // add accessor names to the draw object
    console.log('options', l.options)
    if (l.options._shape.name == 'point') {
        if (l.accessors.hasOwnProperty(`${l.name}-size`)) l.options._shape.size = `${l.name}-size`
        if (options.size) l.options._shape.size = options.size
        if (l.options.hasOwnProperty('stroke')) {
            l.options._shape.stroke ? l.options._shape.stroke.width = l.options.stroke : l.options._shape.stroke = { width: l.options.stroke }
        }
        if (l.accessors.hasOwnProperty(`${l.name}-shape`)) l.options._shape.shape = `${l.name}-shape`
        if (options.shape) l.options._shape.shape = l.options.shape
        if (options.jitter && (typeof options.jitter == 'string' || typeof options.jitter == 'number')) l.options._shape.jitter = l.options.jitter
    }

    let filterRotate = 0; //(Math.PI/2); // Rotate by x radians
    let cosFilter = (d, i, row) => (d * Math.cos(row.angle - filterRotate));
    let sinFilter = (d, i, row) => (d * Math.sin(row.angle - filterRotate));

    l.accessors[`${l.name}-y`].range = '-height'
    l.accessors[`${l.name}-y`].postFilter = cosFilter

    //temp change
    l.accessors[`${l.name}-y`].type = 'log'

    l.accessors[`${l.name}-x`].range = 'height'
    l.accessors[`${l.name}-x`].type = l.accessors[`${l.name}-y`].type
    l.accessors[`${l.name}-x`].field = l.accessors[`${l.name}-y`].field
    l.accessors[`${l.name}-x`].domain = l.accessors[`${l.name}-y`].domain

    l.accessors[`${l.name}-x`].postFilter = sinFilter

    // push draw object to array
    l.draw.push(l.options._shape)

    // adjust frames
    l.frames[0].bbox = { "w": "0%", "h": "49%" }
    l.frames[0].translate = { "x": "50%", "y": "75%" }
    l.frames[0].crop = false

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    this.polar_axis(options)

    // returns the layer for use with glyphs (see guides)
    return l
}

H.gg.prototype.polar_axis = function (options = {}) {

    // get geom defaults
    let defaults = this.defaults.ggplot.polar_axis
    // merge default options with user overrides 
    options = { ...defaults, ...options }

    // check options and fill in missing aes or data with globals 
    options = this.check(options)

    let l = this._current_layer

    let filterRotate = 0; //(Math.PI/2); // Rotate by x radians
    let cosFilter = (d, i, row) => (d * Math.cos(row.angle - filterRotate));
    let sinFilter = (d, i, row) => (d * Math.sin(row.angle - filterRotate));
    let labelFilter = (d) => d - filterRotate;

    // pre wrangle data to add angle
    let extX;
    let angle;
    if (!options.aes.x.factor) {
        extX = d3.extent(options.data, d => d[options.aes.x])
        angle = d3.scaleLinear().domain(extX).range([0, (2 * Math.PI)]);
        options.data = options.data.map((d, i) => { return { ...d, angle: angle(d[options.aes.x]) } })
    } else {
        extX = Array.from(new Set(options.data.map(d => d[options.aes.x.factor])))
        angle = d3.scaleBand().domain(extX).range([0, (2 * Math.PI)]);
        options.data = options.data.map((d, i) => { return { ...d, angle: angle(d[options.aes.x.factor]) } })
    }

    //axis 

    // ring data objs
    // round label data
    let fontSize = 8;
    let numRings = 4;
    let divLines = options.aes.x.factor ? extX.length : 8;
    let lineStep = (2 * Math.PI) / divLines
    let extY = d3.extent(options.data, d => d[options.aes.y])
    let step = (extY[1] - extY[0]) / numRings;

    console.log('number of div lines:', divLines)

    // line data objs
    let lineData = new Array(divLines).fill(0).map((d, i) => {
        return { name: `${l.name}-line-${i}`, content: [{ angle: lineStep * i, radius: extY[0] }, { angle: lineStep * i, radius: extY[1] }] };
    })

    // line draw objs
    let lineDraw = lineData.map(d => { return { name: 'line', frame: l.name, data: d.name, x: `${l.name}-axisX`, y: `${l.name}-axisY`, stroke: { color: "black", dash: 3 } } });

    let circle = new Array(360).fill(0)
    let circleStep = (2 * Math.PI) / 360

    let ringData = new Array(numRings).fill(0).map((d, i) => {
        return { name: `${l.name}-ring-${i}`, content: circle.map((e, j) => { return { angle: circleStep * j, radius: (i * step) + step + extY[0] } }) };
    })

    // ring draw objs
    let ringDraw = ringData.map(d => { return { name: 'line', frame: l.name, data: d.name, x: `${l.name}-axisX`, y: `${l.name}-axisY`, curve: d3.curveCardinalClosed, stroke: { color: "black" } } });

    // straight label data content
    let labelDataContent = ringData.map((d, i) => { return { angle: lineData[0].content[0].angle, radius: d.content[0].radius } });

    // outer labels
    let labelOuterDataContent = lineData.map((d, i) => { return { angle: d.content[1].angle, radius: d.content[1].radius, label: options.aes.x.factor ? extX[i] : angle.invert(d.content[1].angle) } });

    l.accessors[`${l.name}-axisY`] = { field: 'radius', type: 'linear', domain: l.accessors[`${l.name}-y`].domain, range: '-height', postFilter: cosFilter }
    l.accessors[`${l.name}-axisX`] = { field: 'radius', type: 'linear', domain: l.accessors[`${l.name}-y`].domain, range: 'height', postFilter: sinFilter }

    l.accessors[`${l.name}-labelXOffset`] = { field: 'angle', domain: l.accessors[`${l.name}-y`].domain, range: [0, fontSize / 2, 0, -fontSize / 2, 0], preFilter: labelFilter },
        l.accessors[`${l.name}-labelYOffset`] = { field: 'angle', domain: l.accessors[`${l.name}-y`].domain, range: [-5, (fontSize / 2), fontSize, (fontSize / 2), -5], preFilter: labelFilter },

        l.accessors[`${l.name}-textAnchor`] = {
            field: 'angle', domain: [0, 1], range: [0, 1], preFilter: (d, i, row) => d - filterRotate, postFilter: (d, i, row) => {
                if (d == 0 - filterRotate || d == Math.PI - filterRotate) return 'middle'
                if (d > 0 - filterRotate && d < Math.PI - filterRotate) return 'start'
                return 'end';
            }
        }

    l.data.push({ name: `${l.name}-label`, content: labelDataContent })
    l.data.push({ name: `${l.name}-outer-label`, content: labelOuterDataContent })

    l.data.push(...ringData)
    l.data.push(...lineData)

    l.draw.push(...ringDraw)
    l.draw.push(...lineDraw)
    l.draw.push({ name: 'label', data: `${l.name}-label`, frame: l.name, value: 'radius', color: "#333333", x: `${l.name}-axisX`, y: `${l.name}-axisY`, offset: { y: (fontSize / 2) } })
    l.draw.push({ name: 'label', data: `${l.name}-outer-label`, frame: l.name, value: 'label', font: { size: fontSize }, color: "#333333", x: `${l.name}-axisX`, y: `${l.name}-axisY`, textAnchor: `${l.name}-textAnchor`, offset: { x: `${l.name}-labelXOffset`, y: `${l.name}-labelYOffset` } },)

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

}


H.gg.prototype.geom_sankey = function (options = {}) {

    // if (!options.geom) options.geom = 'sankey'

    // let defaults = this.defaults.ggplot.geom_sankey
    // options = {...defaults, ...options}

    // options = this.check(options)


    // for now the sankey wrangler is not responsive
    let height = 1200;
    let width = 1800;

    let sankey = (nodes, links) => {
        const sankey = d3.sankey()
            .nodeId(d => d.name)
            .nodeAlign(d3.sankeyJustify)
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[0, 0], [width * .8, height * .8]]);
        return ({ nodes, links }) => sankey({
            nodes: nodes.map(d => Object.assign({}, d)),
            links: links.map(d => Object.assign({}, d))
        });
    }

    let data = ((d) => {
        const links = d;
        let nodes = Array.from(new Set(links.flatMap(l => [l.source, l.target])), name => ({ name, category: name.replace(/ .*/, "") }));
        return { nodes, links, units: "TWh" };
    })(options.data);

    let sData = sankey()(data);
    sData.nodes = sData.nodes.map(d => {
        let width = d.x1 - d.x0;
        let height = -(d.y1 - d.y0);
        let ny1 = -d.y1;
        let cx = d.x0 + (width / 2);
        let cy = ny1 - (height / 2);
        return { ...d, height, width, ny1, cx, cy };
    })

    sData.links = sData.links.map(d => {
        return { sx: d.source.x1, sy: -d.y0, tx: d.target.x0, ty: -d.y1, width: d.width, name: d.source.name }
    })

    let fontSize = 10;
    let fontCenterMass = .85; // Visually where most of the central mass of the font is
    let schemeCategory20 = [
        "#1f77b4",
        "#aec7e8",
        "#ff7f0e",
        "#ffbb78",
        "#2ca02c",
        "#98df8a",
        "#d62728",
        "#ff9896",
        "#9467bd",
        "#c5b0d5",
        "#8c564b",
        "#c49c94",
        "#e377c2",
        "#f7b6d2",
        "#7f7f7f",
        "#c7c7c7",
        "#bcbd22",
        "#dbdb8d",
        "#17becf",
        "#9edae5"
    ]


    let l = {
        element: {
            renderer: { name: 'svg' },
            sizing: { width: width, height: height }
        },
        accessors: {
            x: { domain: [0, 6], range: 'width' },
            y: { domain: [0, 6] },
            ta: { field: 'x0', type: 'quantize', domain: [0, width / 2], range: ['start', 'end'] },
            c: { field: 'name', domain: [], type: 'ordinal', range: schemeCategory20 }
        },
        data: [
            { name: 'nodes', content: sData.nodes },
            { name: 'edges', content: sData.links }
        ],
        draw: [
            { name: 'rectangle', x: '[x0]', y: '[ny1]', h: '[height]', w: '[width]', color: 'c', shape: 1, ev: { onMouseEnter: { popup: { vals: ['name'] } }, group: 'node' } },
            { name: 'edge', sx: '[sx]', sy: '[sy]', tx: '[tx]', ty: '[ty]', data: 'edges', stroke: { width: '[width]', color: 'c', alpha: .5 }, orientation: 'linkHorizontal', ev: { onMouseEnter: { popup: { vals: ['name'] } }, group: 'edge' } },
            { name: 'label', x: '[cx]', y: '[cy]', value: 'name', textAnchor: 'ta', font: { size: fontSize }, offset: { x: fontSize, y: (fontSize * fontCenterMass) / 2 } }
        ],
        frames: [
            { bbox: { h: "80%", w: "80%" }, crop: true, mirror: false, name: "frame-0", rotate: 0, translate: { x: "50%", y: "50%" } }
        ]
    }

    // add layer to layers array
    this._layers[l.name] = l

    // set current layer
    this._current_layer = l

    // returns the layer for use with glyphs (see guides)
    return l

}

