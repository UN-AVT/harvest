// Position scales for continuous data (x & y)
H.gg.prototype.scale_x_continuous = function (options={}) {
    let defaults = this.defaults.ggplot.scale_x_continuous
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_y_continuous = function (options={}) {
    let defaults = this.defaults.ggplot.scale_y_continuous
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_x_log10 = function (options={}) {
    let defaults = this.defaults.ggplot.scale_x_log10
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_y_log10 = function (options={}) {
    let defaults = this.defaults.ggplot.scale_y_log10
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_x_reverse = function (options={}) {
    //check current layer has scale
    if (!this._current_layer.accessors || !this._current_layer.accessors[`${this._current_layer.name}-x`]){
        const e = new Error(`No x scale set to reverse`); 
        throw e;
    }

    let scale = this._current_layer.accessors[`${this._current_layer.name}-x`]
    scale.domain.reverse()
};

H.gg.prototype.scale_y_reverse = function (options={}) {
    //check current layer has scale
    if (!this._current_layer.accessors || !this._current_layer.accessors[`${this._current_layer.name}-y`]){
        const e = new Error(`No y scale set to reverse`); 
        throw e;
    }

    let scale = this._current_layer.accessors[`${this._current_layer.name}-y`]
    scale.domain.reverse()
};

H.gg.prototype.scale_x_sqrt = function (options={}) {
    let defaults = this.defaults.ggplot.scale_x_sqrt
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_y_sqrt = function (options={}) {
    let defaults = this.defaults.ggplot.scale_y_sqrt
    options = {...defaults, ...options}

    this.scale_position(options)
};