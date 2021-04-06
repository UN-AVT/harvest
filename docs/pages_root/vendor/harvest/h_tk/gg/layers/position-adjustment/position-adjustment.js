/**
 * @description Dodging preserves the vertical position of an geom while adjusting the horizontal position.
 * 
 * @see https://ggplot2.tidyverse.org/reference/position_dodge.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [width = '2%']
 * 
 * @todo preserve
 *
 */
H.gg.prototype.position_dodge = function (options={}) {

    let layer = this._current_layer

    let defaults = this.defaults.ggplot.position_dodge
    options = {...defaults, ...options}
    
    if (!layer.options.mapping.group) { 
        const e = new Error('fill not provided in aes'); 
        throw e;
    }

    if (!layer.options.mapping.group) { 
        const e = new Error('selected mapping is not factorized'); 
        throw e;
    }

    //process groups
    let updated_draw = [];
    let updated_data = [];
    let updated_frames = [];

    layer.frames[0].plot = false
    
    for (let i in layer.draw){

        let groupCfg = {
            data:layer.data[i].content,
            splitField: layer.options.mapping.group.factor,
            rootFrame: layer.frames[0],
            visItemWidth: layer.options.position.position_dodge ? layer.options.position.position_dodge.width || "4%" : "4%",
            prefix:`grouped-${layer.options.mapping.group.factor}-${i}-`
        }
        
        let groups = H.dataDiv.group(groupCfg)

        updated_data = updated_data.concat(groups.cfgs.data)
        updated_frames = updated_frames.concat(groups.cfgs.frames)

        groups.sets.datas.forEach((d,x) => {
            let shape = H.Clone.deep(layer.draw[i])
            shape.data = d
            shape.frame = groups.sets.frames[x]
            updated_draw.push(shape)
        });
    }

    layer.frames[0].plot = true

    layer.draw = updated_draw
    layer.data = updated_data
    layer.frames = layer.frames.concat(updated_frames)

};

/**
 * @description Dodging preserves the vertical position of an geom while adjusting the horizontal position.
 * 
 * @see https://ggplot2.tidyverse.org/reference/position_dodge.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {string} [width = '2%'']
 * 
 * @todo reverse, padding, preserve
 *
 */
H.gg.prototype.position_dodge2 = function (options={}) {
    let defaults = this.defaults.ggplot.position_dodge2
    options = {...defaults, ...options}

    this.position_dodge(options)
};


/**
 * @description Don't adjust position
 * 
 * @see https://ggplot2.tidyverse.org/reference/position_identity.html
 * 
 * @this ggplot
 * @memberof ggplot
 *
 */
H.gg.prototype.position_identity = function (options={}) {
    //do absolutely nothing!
};


/**
 * @description Counterintuitively adding random noise to a plot can sometimes make it easier to read. Jittering is particularly useful for small datasets with at least one discrete position. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/position_jitter.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [width = 0.4]
 * 
 * @todo height & seed params
 *
 */
H.gg.prototype.position_jitter = function (options={}) {
    let defaults = this.defaults.ggplot.position_jitter
    options = {...defaults, ...options}

    for (let i in this._current_layer.draw){
        let shape = this._current_layer.draw[i]
        shape.jitter = options.width
    }
};


/**
 * @description This is primarily used for aligning points generated through geom_point() with dodged boxplots (e.g., a geom_boxplot() with a fill aesthetic supplied). 
 * 
 * @see https://ggplot2.tidyverse.org/reference/position_jitterdodge.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [jitter.width = 0.4]
 * @param {number} [jitter.height = 0]
 * @param {number} [dodge.width = 0.75]
 *
 * @todo seed
 * 
 */
H.gg.prototype.position_jitterdodge = function (options={}) {
    let defaults = this.defaults.ggplot.position_jitterdodge
    options = {...defaults, ...options}

    this.position_dodge(options.dodge)
    this.position_jitter(options.jitter)
};


/**
 * @description position_nudge() is generally useful for adjusting the position of items on discrete scales by a small amount. 
 * 
 * @see https://ggplot2.tidyverse.org/reference/position_nudge.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @param {number} [x = 0]
 * @param {number} [y = 0]
 *
 */
H.gg.prototype.position_nudge = function (options={}) {
    let defaults = this.defaults.ggplot.position_nudge
    options = {...defaults, ...options}

    for(let frame of this._current_layer.frames){
        frame.translate.x = `${parseFloat(frame.translate.x.substr(0,frame.translate.x.length-1)) + (options.x*100)}%`
        frame.translate.y = `${parseFloat(frame.translate.y.substr(0,frame.translate.y.length-1)) + (options.y*100)}%`
    }

};


/**
 * @description position_stack() stacks bars on top of each other
 * 
 * @see https://ggplot2.tidyverse.org/reference/position_stack.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @todo vjust = 1, reverse = FALSE
 *
 */
H.gg.prototype.position_stack = function (options={}) {

    let layer = this._current_layer

    let defaults = this.defaults.ggplot.position_stack
    options = {...defaults, ...options}

    if (!layer.options.mapping.fill) { 
        const e = new Error('fill not provided in aes'); 
        throw e;
    }

    if (!layer.options.mapping.fill.factor) { 
        const e = new Error('selected mapping is not factorized'); 
        throw e;
    }

    let lwCfg = {
        splitField:layer.options.mapping.fill.factor,
        wideField:layer.accessors[`${layer.name}-x`].field,
        sumField:layer.accessors[`${layer.name}-y`].field,
        data:JSON.parse(JSON.stringify(layer.data[0].content))
    }

    let wideInfo = H.longToWide(lwCfg)

    let stackCfg = {
        ...wideInfo,
        call:d3.stack(),
        stackScaleType:layer.accessors[`${layer.name}-y`].type,
        stackScaleRange:layer.accessors[`${layer.name}-y`].range,
        prefix:`${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-`
    }
    
    let stacks = H.formatD3StackToLong(stackCfg);

    //make vjust adjustments
    if (options.vjust != 1){
        stacks.cfgs.data.forEach(d =>{
            d.content.forEach(j => j[`${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-topline`] = (j[`${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-topline`] - j[`${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-baseline`])*options.vjust + j[`${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-baseline`])
        })
    }

    layer.data = stacks.cfgs.data
    layer.accessors = {...layer.accessors, ...stacks.cfgs.accessors}

    layer.accessors[`${layer.name}-y`].domain = stacks.cfgs.accessors[`${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-baseline`].domain
    
    let updated_draw = [];
    for (let i in layer.draw){
        stacks.sets.datas.forEach((d,x) => {
            let shape = H.Clone.deep(layer.draw[i])
            shape.b = `${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-baseline`, 
            shape.y0 = `${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-baseline`, 
            shape.y = `${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-topline`
            shape.y1 = `${layer.options.name}-stacked-${layer.options.mapping.fill.factor}-topline`
            shape.data = d
            updated_draw.push(shape)
        });
    }
    layer.draw = updated_draw

};


/**
 * @description position_fill() stacks bars and standardises each stack to have constant height.
 * 
 * @see https://ggplot2.tidyverse.org/reference/position_stack.html
 * 
 * @this ggplot
 * @memberof ggplot
 * 
 * @todo vjust = 1, reverse = FALSE
 *
 */
H.gg.prototype.position_fill = function (options={}) {

    let layer = this._current_layer

    let defaults = this.defaults.ggplot.position_fill
    options = {...defaults, ...options}

    if (!layer.options.mapping.fill) { 
        const e = new Error('fill not provided in aes'); 
        throw e;
    }

    if (!layer.options.mapping.fill.factor) { 
        const e = new Error('selected mapping is not factorized'); 
        throw e;
    }

    let keys = d3.map(layer.options.data, d => d[layer.options.mapping.fill.factor]).keys()

    if (layer.options.mapping.x.factor){
        keys.forEach(key => {
            layer.options.data.forEach(d => {
                d.PERCENT = d[layer.options.mapping.y] / d3.sum(layer.options.data.filter(j => j[layer.options.mapping.x.factor] == d[layer.options.mapping.x.factor]), k => k[layer.options.mapping.y])
            })
        })
    } else {
        layer.options.data.forEach(d => {
            d.PERCENT = d[layer.options.mapping.y] / d3.sum(layer.options.data.filter(j => j[layer.options.mapping.x] == d[layer.options.mapping.x]), k => k[layer.options.mapping.y])
        })
    }

    layer.accessors[`${layer.name}-y`].field = 'PERCENT'

    this.position_stack(options)

};