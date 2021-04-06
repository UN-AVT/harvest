// Modify axis, legend, and plot labels
H.gg.prototype.labs = function (options = {}) {

    if (options.title) this._labels.title = options.title
    if (options.subtitle) this._labels.subtitle = options.subtitle
    if (options.caption) this._labels.caption = options.caption
    if (options.tag) this._labels.tag = options.tag

};

// Modify axis, legend, and plot labels
H.gg.prototype.xlab = function (options={}) {

    let label;
    if (typeof options == 'string'){
        label = options
    } else {
        let defaults = this.defaults.ggplot.xlab
        options = {...defaults, ...options}

        //change axis label if the layer is rotated
        let axis = this._current_layer.options.rotate == 90 ? 'y' : 'x'

        if (this._aes[axis] && this._aes[axis].factor){
            options.label = this._aes[axis].factor
        } else if (this._aes[axis]){
            options.label = this._aes[axis]
        } else {
            options.label = ''
        }
        
        label = options.label
    }

    this._labels.xlab = label

};

// Modify axis, legend, and plot labels
H.gg.prototype.ylab = function (options={}) {

    let label;
    if (typeof options == 'string'){
        label = options
    } else {
        let defaults = this.defaults.ggplot.ylab
        options = {...defaults, ...options}
        
        //change axis label if the layer is rotated
        let axis = this._current_layer.options.rotate == 90 ? 'x' : 'y'

        if (this._aes[axis] && this._aes[axis].factor){
            options.label = this._aes[axis].factor
        } else if (this._aes[axis]){
            options.label = this._aes[axis]
        } else {
            options.label = ''
        }        
        
        label = options.label
    }

    this._labels.ylab = label

};

// Modify axis, legend, and plot labels
H.gg.prototype.ggtitle = function (options={}) {

    if (typeof options == 'string'){
        this._labels.title = options
    } else {
        if (options.title) this._labels.title = options.title
        if (options.subtitle) this._labels.subtitle = options.subtitle
    }

};