
H.gg.prototype.draw_key = function (options = {}) {

  //filter current layer options for only aesthetic options
  let aes_options = ['fill', 'color', 'shape', 'linetype', 'stroke']
  let current_layer_options = {}
  Object.keys(this._current_layer.options).forEach(d => {
    if (aes_options.includes(d)) current_layer_options[d] = this._current_layer.options[d]
  })

  options.inherit = {aes:false}

  //merge current layer options with any additional options
  options = { ...current_layer_options, ...options }

  //create geom layer
  let l = this[`geom_${options.geom}`](options)

  //change frame to a small square & move to guide position
  l.frames[0].bbox = { h: '5%', w: '2.5%' }
  l.frames[0].translate = { x: '95%', y: `80%` }

  // all keys are a fixed X, Y domain of [0,10] unless categorical data
  for (let i in l.accessors) {
    if (l.accessors[i].type != 'band'){
      l.accessors[i].domain = [0, 10]
    } else {
      l.accessors[i].domain = ['A']
    }
  }

  // remove layer from layers list
  delete this._layers[l.options.name]

  //set previous layer as current layer
  let layerKeys = Object.keys(this._layers)
  this._current_layer = this._layers[layerKeys[layerKeys.length - 1]]
  
  return l

}

H.gg.prototype.draw_key_point = function (options = {}) {

  options.name = 'key_point'
  options.geom = 'point'

  options.data = [
    { x: 5, y: 5 }
  ]

  options.aes = {
    x: 'x',
    y: 'y',
  }

  let l = this.draw_key(options)

  return l

}

H.gg.prototype.draw_key_abline = function (options = {}) {

  options.name = 'key_abline'
  options.geom = 'line'

  options.data = [
    { x: 0, y: 0 },
    { x: 10, y: 10 },
  ]

  options.aes = {
    x: 'x',
    y: 'y',
  }

  let l = this.draw_key(options)

  return l

}

H.gg.prototype.draw_key_rect = function (options = {}) {

  options.name = 'key_rect'
  options.geom = 'tile'

  options.data = [
    { x: 0, y: 0, height: 10, width: 10 },
  ]

  options.aes = {
    x: "x",
    y: "y",
    width: "width",
    height: "height"
  }

  let l = this.draw_key(options)

  return l
}

// H.gg.prototype.draw_key_polygon = function (options={}) {
// }

H.gg.prototype.draw_key_blank = function (options = {}) {
}

H.gg.prototype.draw_key_boxplot = function (options = {}) {

  options.name = 'key_boxplot'
  options.geom = 'boxplot'

  options.data = [
    { x: 'A', y: 0 },
    { x: 'A', y: 3 },
    { x: 'A', y: 5 },
    { x: 'A', y: 7 },
    { x: 'A', y: 10 },
  ]

  options.aes = {
    x: { factor: 'x' },
    y: "y",
  }

  options.width = '7'

  let l = this.draw_key(options)

  return l

}

H.gg.prototype.draw_key_crossbar = function (options = {}) {

  options.name = 'key_crossbar'
  options.geom = 'crossbar'

  options.data = [
    { x: 'A', y: 5, ymin: 2, ymax: 8 }
  ]

  options.aes = {
    x: { factor: 'x' },
    y: "y",
    ymin: 'ymin',
    ymax: 'ymax'
  }

  let l = this.draw_key(options)

  return l

}

H.gg.prototype.draw_key_path = function (options = {}) {
}

H.gg.prototype.draw_key_vpath = function (options = {}) {
}

H.gg.prototype.draw_key_dotplot = function (options = {}) {
}

H.gg.prototype.draw_key_pointrange = function (options = {}) {

  options.name = 'key_pointrange'
  options.geom = 'pointrange'

  options.data = [
    { x: 5, y: 5, ymin: 2, ymax: 8 }
  ]

  options.aes = {
    x: 'x',
    y: "y",
    ymin: 'ymin',
    ymax: 'ymax'
  }

  let l = this.draw_key(options)

  return l
}

H.gg.prototype.draw_key_smooth = function (options = {}) {
}

H.gg.prototype.draw_key_text = function (options = {}) {

  options.name = 'key_text'
  options.geom = 'text'

  options.data = [
    { x: 5, y: 5, label: 'label' }
  ]

  options.aes = {
    x: 'x',
    y: "y",
    label: 'label'
  }

  let l = this.draw_key(options)

  return l

}

H.gg.prototype.draw_key_label = function (options = {}) {

  options.name = 'key_label'
  options.geom = 'label'

  options.data = [
    { x: 5, y: 5, label: 'label' }
  ]

  options.aes = {
    x: 'x',
    y: "y",
    label: 'label'
  }

  let l = this.draw_key(options)

  return l
}

H.gg.prototype.draw_key_vline = function (options = {}) {
}

H.gg.prototype.draw_key_timeseries = function (options = {}) {
  options.name = 'key_timeseries'
  options.geom = 'line'

  options.data = [
    { x: 0, y: 0 },
    { x: 4, y: 6 },
    { x: 6, y: 4 },
    { x: 10, y: 10 }
  ]

  options.aes = {
    x: 'x',
    y: 'y',
  }

  let l = this.draw_key(options)

  return l

}

