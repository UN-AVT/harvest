// Position scales for discrete data
H.gg.prototype.scale_x_discrete = function (options={}) {
    let defaults = this.defaults.ggplot.scale_x_discrete
    options = {...defaults, ...options}

    this.scale_position(options)
};

// Position scales for discrete data
H.gg.prototype.scale_y_discrete = function (options={}) {
    let defaults = this.defaults.ggplot.scale_y_discrete
    options = {...defaults, ...options}

    this.scale_position(options)
};