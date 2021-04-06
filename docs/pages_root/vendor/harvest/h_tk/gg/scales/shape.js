// Scales for shapes, aka glyphs
H.gg.prototype.scale_shape = function (options={}) {
    let defaults = this.defaults.ggplot.scale_shape
    options = {...defaults, ...options}

    // create guide
    if(options.guide) this.guides({shape:options.guide})

    let scale = this._current_layer.accessors[`${this._current_layer.name}-shape`]
    scale.type = 'ordinal' 
    scale.domain = d3.map(this._current_layer.data[0].content.flat(), d => d[scale.field]).keys()
    scale.range = scale.domain.map((d,i) => i)
    if (!options.solid){
        for(let shape of this._current_layer.draw){
            shape.color = 'rgba(0,0,0,0)'
        }
    }
};

// Scales for shapes, aka glyphs
H.gg.prototype.scale_shape_binned = function (x) {
    this.x = x;
    return this;
};