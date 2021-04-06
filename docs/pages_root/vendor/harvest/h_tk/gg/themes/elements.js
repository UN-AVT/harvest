H.gg.prototype.element_text = function (options={}, shape=null) {

    if (shape == null) shape = H.Clone.deep(this.defaults.vspec.text)
    
    if (options.color) options.colour = options.color

    if (options.family) shape.font.family = options.family
    if (options.colour) shape.font.color = options.colour
    if (options.size) shape.font.size = options.size
    if (options.hjust) shape.offset.x = `${options.hjust * 100}%`
    if (options.vjust) shape.offset.y = `${options.vjust * 100}%`

    if (options.angle){
        shape.textAnchor =  options.angle > 0 ? 'start' : 'end'
        shape.textWrap = 100
    }

    if (options.color) shape.font.color = options.color

    // if (options.face)
    // if (options.lineheight)
    // if (options.margin)
    // if (options.debug)
    // if (options.inherit.blank)

    return shape
}

H.gg.prototype.element_rect = function (options={}, shape=null) {

    if (shape == null) shape = H.Clone.deep(this.defaults.vspec.rectangle)

    if (options.fill) shape.color = options.fill
    if (options.colour) shape.stroke.color = options.colour
    if (options.size) shape.stroke.width = options.size
    if (options.linetype) shape.dash = options.linetype
    if (options.color) shape.stroke.color = options.color

    // if (options.inherit.blank)

    return shape
}

H.gg.prototype.element_line = function (options={}, shape=null) {

    if (shape == null) shape = H.Clone.deep(this.defaults.vspec.line)

    if (options.colour) shape.stroke.color = options.colour
    if (options.size) shape.stroke.width = options.size
    if (options.linetype) shape.dash = options.linetype
    if (options.color) shape.stroke.color = options.color

    // if (options.lineend)
    // if (options.arrow)
    // if (options.inherit.blank)

    return shape
}

H.gg.prototype.element_blank = function (options={}, shape=null) {
    if (shape == null){
        shape = {}
    } else {
        shape.stroke.color = 'rgba(0,0,0,0)'
        shape.color = 'rgba(0,0,0,0)'
    }
    
    return shape
}