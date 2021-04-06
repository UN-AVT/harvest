// // Reference lines: horizontal, vertical, and diagonal
// H.gg.prototype.geom_abline = function (x) {
//     this.x = x;
//     return this;
// };

// // Reference lines: horizontal, vertical, and diagonal
// H.gg.prototype.geom_hline = function (x) {
//     this.x = x;
//     return this;
// };

// // Reference lines: horizontal, vertical, and diagonal
// H.gg.prototype.geom_vline = function (x) {
//     this.x = x;
//     return this;
// };

// Create an annotation layer
H.gg.prototype.annotate = function (options={}) {
    // let defaults = this.defaults.ggplot.annotate
    // options = {...defaults, ...options}

    let data = {}
    if (options.x) data.x = options.x
    if (options.y) data.y = options.y
    if (options.xmin) data.xmin = options.xmin
    if (options.ymin) data.ymin = options.ymin
    if (options.xmax) data.xmax = options.xmax
    if (options.ymax) data.ymax = options.ymax
    if (options.xend) data.xend = options.xend
    if (options.yend) data.yend = options.yend
    if (options.label) data.label = options.label

    let aes = {}
    
    for (let key in data){
        aes[key] = key
    }

    options.data = [data]
    options.aes = aes

    let current_x_domain = this._current_layer.accessors[`${this._current_layer.name}-x`].domain
    let current_y_domain = this._current_layer.accessors[`${this._current_layer.name}-y`].domain

    let annotation_layer = this[`geom_${options.geom}`](options)
    annotation_layer.accessors[`${annotation_layer.name}-x`].domain = current_x_domain
    annotation_layer.accessors[`${annotation_layer.name}-y`].domain = current_y_domain

    //set previous layer as current layer
    let layerKeys = Object.keys(this._layers)
    this._current_layer = this._layers[layerKeys[layerKeys.length - 2]]

};

// Annotation: Custom grob
H.gg.prototype.annotation_custom = function (x) {
    this.x = x;
    return this;
};

// Annotation: log tick marks
H.gg.prototype.annotation_logticks = function (x) {
    this.x = x;
    return this;
};

// Annotation: a maps
H.gg.prototype.annotation_map = function (x) {
    this.x = x;
    return this;
};

// Annotation: high-performance rectangular tiling
H.gg.prototype.annotation_raster = function (x) {
    this.x = x;
    return this;
};

// Create a layer of map borders
H.gg.prototype.borders = function (x) {
    this.x = x;
    return this;
};