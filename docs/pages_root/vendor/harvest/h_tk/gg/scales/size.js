// Scales for area or radius
H.gg.prototype.scale_size = function (options={}) {

    let defaults = this.defaults.ggplot.scale_size
    options = {...defaults, ...options}

    // create guide
    if(options.guide) this.guides({size:options.guide})

    let scale = this._current_layer.accessors[`${this._current_layer.name}-size`]
    scale.type = 'linear' 
    scale.domain = d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field])
    scale.range = options.range
};

H.gg.prototype.scale_radius = function (x) {
    this.x = x;
    return this;
};

H.gg.prototype.scale_size_binned = function (x) {
    this.x = x;
    return this;
};

H.gg.prototype.scale_size_area = function (x) {
    this.x = x;
    return this;
};

H.gg.prototype.scale_size_binned_area = function (x) {
    this.x = x;
    return this;
};