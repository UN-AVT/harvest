/**
 * @private
 * @description Base data wrangling for internal use by all geoms
 *
 * @this ggplot
 * @memberof ggplot 
 * 
 * @param {Object} [aes = this.aes] aes params to be combined with global aes
 * @param {array} [data = this.data] data frame
 * @param {string} [name] layer name
 *
 * @param {number} [alpha] opacity of line. value from 0 - 1
 * @param {string} [colour] stroke color
 * @param {string | number} [linetype] stroke type
 * @param {number} [size] stroke width
 * 
 * @returns layer containing name, accessors & data
 */
H.gg.prototype.layer = function (options) {

    //check for name / create unique name if not provided
    if(!options.name){
        if (!options.hasOwnProperty('geom')) options.geom = 'unknown_geom'
        let i = 0
        options.name = options.geom + '_layer'
        while (this._layers.hasOwnProperty(options.name)){
            i += 1
            options.name = options.geom + '_layer_' + i
        }
    }

    //get geom defaults
    let layer_defaults = this.defaults.ggplot.layer
    options = {...layer_defaults, ...options}

    //check params
    options = this.check(options)
    
    //get exisiting layer or create new layer & frame
    let l = this._layers.hasOwnProperty(options.name) ? this._layers[options.name] : {}
    l.name = options.name;
    l.frames = [H.Merge.deep(H.Clone.deep(this.defaults.vspec.frame), {name:l.name})]

    //set current layer
    this._current_layer = l
    
    //rotate layer if needed
    if (options.rotate )l.frames[0].rotate = options.rotate

    //change aes to mapping
    options.mapping = options.aes
    delete options.aes

    //add empty accessors
    l.accessors = {}

    //add draw if not referencing geom
    l.draw = l.draw = []

    if (options._shape){

        options._shape = {name:options._shape, data:l.name, frame:l.name, x:`${l.name}-x`, y:`${l.name}-y`}

        //aesthetic mapping
        if (options.color || options.linetype || options.size) options._shape.stroke = {}
        if (options.color) options._shape.stroke.color = options.color == 'NA' ? 'rgba(0,0,0,0)' : options.color
        if (options.alpha) options._shape.alpha = options.alpha
        if (options.linetype) options._shape.stroke.dash = options.linetype
        if (options.linetype && options._shape.name == 'line') options._shape.dash = options.linetype
        if (options.size && options._shape.name != 'point' && options._shape.name != 'label') options._shape.stroke.width = options.size
        if (options.width) options._shape.w = options.width
        if (options.fill) options._shape.color = options.fill == 'NA' ? 'rgba(0,0,0,0)' : options.fill

        if (l.accessors.hasOwnProperty(`${l.name}-fill`)) options._shape.color = `${l.name}-fill`
        if (l.accessors.hasOwnProperty(`${l.name}-color`)) options._shape.stroke.color = `${l.name}-color`
        
    }

    //add data to array
    l.data = [{name:l.name, content:options.data}]
    
    //process accessors
    options = this.aes(options)

    //check for change of glyph for guide
    if (options.key_glyph !== null){
        for (let aes in options.mapping){
            let guide_vars = ['fill', 'color', 'linetype', 'shape', 'size']
            if (guide_vars.includes(aes)){
                if (typeof this._guide_config[aes] == 'string'){
                    this._guide_config[aes] = {['guide_' + this._guide_config[aes]]:{key_glyph:options.key_glyph}}
                } else {
                    this._guide_config[aes][Object.keys(this._guide_config[aes])[0]] = {...this._guide_config[aes][Object.keys(this._guide_config[aes])[0]] ,...{key_glyph:options.key_glyph}}
                }
            }
        }
    }

    l.options = options
        
    return l
};

H.gg.prototype.check = function (options={}) {

    // handle aes or use global
    if (!(options.inherit && options.inherit.aes === false)){ //check for inherit aes
        if (!options.aes) { 
            if (Object.keys(this._aes).length > 0){
                console.log("geom using global aes")
                options.aes = this._aes
            } else {
                let e = new Error('no layer or global aes set')
                throw e;
            }
        } else {
            if (Object.keys(this._aes).length == 0){
                this._aes = options.aes
            } else {
                options.aes = {...H.Clone.deep(this._aes), ...options.aes}
            }
        }
    }

    // handle data or use global data
    if (!options.data) { 
        console.log("geom using global data")
        options.data = this._data
    }

    return options

}