/*	

*/

// Set scale limits
H.gg.prototype.lims = function (options={}) {

    for (let key in options){

        for (let i in this._layers){
            let layer = this._layers[i]
            let type = layer.accessors[`${layer.name}-${key}`].type

            if ( type != 'band' && type != 'ordinal' && options[key].length != 2){
                let e = new Error('Limits for non band scales must be supplied as an array i.e.[*lower*, *upper*]')
                throw e
            }
            
            //change domains
            if (layer.accessors.hasOwnProperty(`${layer.name}-${key}`)){
                if (type == 'band' || type == 'ordinal') {
                    layer.accessors[`${layer.name}-${key}`].domain = options[key]
                } else {
                    if (options[key][0] != 'NA') layer.accessors[`${layer.name}-${key}`].domain[0] = options[key][0]
                    if (options[key][1] != 'NA') layer.accessors[`${layer.name}-${key}`].domain[1] = options[key][1]
                }
            
                //filter data
                for (let i in layer.data){
                    if (layer.data[i].name.startsWith(layer.name)){
                        if (type != 'band' && type != 'ordinal'){
                            if (options[key][0] != 'NA') layer.data[i].content = layer.data[i].content.filter(d => d[layer.options.mapping[key]] >= options[key][0])
                            if (options[key][1] != 'NA') layer.data[i].content = layer.data[i].content.filter(d => d[layer.options.mapping[key]] <= options[key][1])
                        }
                    }
                }
            } 
        }
    }

};

H.gg.prototype.xlim = function (options=[]) {
    this.lims({x:options})
};

H.gg.prototype.ylim = function (options=[]) {
    this.lims({y:options})
};

H.gg.prototype.expand_limits = function (options={}) {

    for (let key in options){
        if (typeof options[key] === 'object' && options[key] !== null && !(options[key] instanceof Array)){
            let func = Object.keys(options[key])[0]
            options[key] = this[func](options[key][func])
        }

        if (!(options[key] instanceof Array)){
            options[key] = [options[key],'NA']
        }
    }

    this.lims(options)

};

H.gg.prototype.expansion = function (options={}) {
    for (let scale in options){
        for (let key in options[scale]){

            for (let i in this._layers){
                let layer = this._layers[i]
                let type = layer.accessors[`${layer.name}-${scale}`].type

                if ( type == 'band' || type == 'ordinal'){
                    let e = new Error('Expansion does not work for band or ordinal scales')
                    throw e
                }

                if (options[scale][key].length > 2){
                    let e = new Error('A maximum of two values should be supplied i.e [*lower limit*, *upper limit*]')
                    throw e
                }
                
                //change domains
                if (layer.accessors.hasOwnProperty(`${layer.name}-${scale}`)){

                    if (!(options[scale][key] instanceof Array)){
                        options[scale][key] = [options[scale][key],options[scale][key]]
                    }

                    if (key == 'add'){
                        if (options[scale][key][0] != 'NA') layer.accessors[`${layer.name}-${scale}`].domain[0] = layer.accessors[`${layer.name}-${scale}`].domain[0] - options[scale][key][0]
                        if (options[scale][key][1] != 'NA') layer.accessors[`${layer.name}-${scale}`].domain[1] = layer.accessors[`${layer.name}-${scale}`].domain[1] + options[scale][key][1]
                    }

                    if (key == 'mult'){
                        if (options[scale][key][0] != 'NA') layer.accessors[`${layer.name}-${scale}`].domain[0] = layer.accessors[`${layer.name}-${scale}`].domain[0] - (layer.accessors[`${layer.name}-${scale}`].domain[0] * options[scale][key][0])
                        if (options[scale][key][1] != 'NA') layer.accessors[`${layer.name}-${scale}`].domain[1] = layer.accessors[`${layer.name}-${scale}`].domain[1] + (layer.accessors[`${layer.name}-${scale}`].domain[1] * options[scale][key][1])
                    }
                
                    //filter data
                    for (let i in layer.data){
                        if (layer.data[i].name.startsWith(layer.name)){
                            if (type != 'band' && type != 'ordinal'){
                                if (options[scale][key][0] != 'NA') layer.data[i].content = layer.data[i].content.filter(d => d[layer.options.mapping[scale]] >= layer.accessors[`${layer.name}-${scale}`].domain[0])
                                if (options[scale][key][1] != 'NA') layer.data[i].content = layer.data[i].content.filter(d => d[layer.options.mapping[scale]] <= layer.accessors[`${layer.name}-${scale}`].domain[1])
                            }
                        }
                    }
                } 
            }
        }
    }
};

H.gg.prototype.expand_scale = function (options={}) {
    this.expansion(options)
};