H.gg.prototype.check_scale = function (aes) {
    
    //check current layer has scale
    if (!this._current_layer.accessors || !this._current_layer.accessors[`${this._current_layer.name}-${aes}`]){
        //add scale if possible or throw error
        if (this._aes.hasOwnProperty(aes)){
            this._current_layer.accessors[`${this._current_layer.name}-${aes}`] = {field:this._aes[aes]}
        } else {
            const e = new Error(`Global aes does not have mapping needed to create ${aes} scale`); 
            throw e;
        }
    }

};

H.gg.prototype.scale_position = function (options={}) {
    let defaults = {
        aes: 'x',
        type:'linear',
    }

    options = {...defaults, ...options}

    this.check_scale(options.aes)

    let variations = ['','0','1','min','max','end']

    for (let variation of variations){
        let aes = `${options.aes}${variation}`

        if (this._current_layer.accessors[`${this._current_layer.name}-${aes}`]){
            let scale = this._current_layer.accessors[`${this._current_layer.name}-${aes}`]
            if (!scale.range) scale.range = aes.charAt(0) == 'x' ? 'width' : '-height'  
            scale.type = options.type

            if (options.type == 'band'){
                if (!scale.domain) scale.domain = d3.map(this._current_layer.data[0].content.flat(), d => d[scale.field]).keys()
            } else {
                if (!scale.domain) scale.domain = d3.extent(this._current_layer.data[0].content.flat(), d => d[scale.field])
            }
            if (options.limits) scale.domain = options.limits
            if (options.expand) this.expansion(options.expand)
        }
    }
};