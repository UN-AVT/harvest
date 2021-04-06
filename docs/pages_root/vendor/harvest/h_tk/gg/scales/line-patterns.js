// Scale for line patterns
H.gg.prototype.scale_linetype = function (x) {
    this.x = x;
    return this;
};

H.gg.prototype.scale_linetype_binned = function (x) {
    this.x = x;
    return this;
};

H.gg.prototype.scale_linetype_continuous = function (x) {
    this.x = x;
    return this;
};

H.gg.prototype.scale_linetype_discrete = function (options={}) {
    let defaults = this.defaults.ggplot.scale_linetype_discrete
    options = {...defaults, ...options}

    let scale = this._current_layer.accessors[`${this._current_layer.name}-linetype`]
    scale.type = 'ordinal' 
    scale.domain = d3.map(this._current_layer.data[0].content.flat(), d => d[scale.field]).keys()
    scale.range = ['0', '4 4', '1 3', '1 3 4 3', '7 3', '2 2 6 2']
    if (options.na.value) scale.unknown = options.na.value

};