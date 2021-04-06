H.gg.prototype.theme_update = function (options={}) {
    this.theme(options)
};

H.gg.prototype.theme_replace = function (options={}) {
    this.theme(options)
};

H.gg.prototype.theme_get = function (options) {
    return this.current_theme
};

H.gg.prototype.theme_set = function (options={}) {
    this.current_theme = options
};