// Position scales for date/time data
H.gg.prototype.scale_x_date = function (options={}) {
    let defaults = this.defaults.ggplot.scale_x_date
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_y_date = function (options={}) {
    let defaults = this.defaults.ggplot.scale_y_date
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_x_datetime = function (options={}) {
    let defaults = this.defaults.ggplot.scale_x_datetime
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_y_datetime = function (options={}) {
    let defaults = this.defaults.ggplot.scale_y_datetime
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_x_time = function (options={}) {
    let defaults = this.defaults.ggplot.scale_x_time
    options = {...defaults, ...options}

    this.scale_position(options)
};

H.gg.prototype.scale_y_time = function (options={}) {
    let defaults = this.defaults.ggplot.scale_y_time
    options = {...defaults, ...options}

    this.scale_position(options)
};