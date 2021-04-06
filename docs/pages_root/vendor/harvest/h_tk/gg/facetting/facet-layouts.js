// Lay out panels in a grid
H.gg.prototype.facet_grid = function (options={}) {

    let defaults = this.defaults.ggplot.facet_grid
    options = {...defaults, ...options}

    let l = this._current_layer
    l.facet = 'grid'

    let cfg = {
        data: l.data[0].content,
        rootFrame:l.frames[0],
        prefix:'grid-'
    }

    l.frames = []

    if (options.rows) cfg.splitFieldH = options.rows
    if (options.cols) cfg.splitFieldW = options.cols

    let facetrv = H.dataDiv.facet_grid(cfg);

    let shape = l.draw[0]
    l.draw = []

    l.data.push({name:'bg_data', content:[{bgX:0, bgY:100}, {bgX:100, bgY:100}]})

    l.accessors.bgX = {domain:[0,100], type:'linear', range:'width'},
    l.accessors.bgY = {domain:[0,100], type:'linear', range:'-height'}

    l.cols = facetrv.sets.domainH
    l.rows = facetrv.sets.domainW

    let lookup = {}

    facetrv.sets.domainH.forEach((h, i) => {
        facetrv.sets.domainW.forEach((w, j) => {

            let facet = facetrv.sets.facets[h][w];

            lookup[facet.frame] = {col: h, row: w}

            shape = H.Clone.deep(shape)
            shape.data = facet.data
            shape.frame = facet.frame

            l.draw.push(shape);

        });
    });

    facetrv.cfgs.frames = facetrv.cfgs.frames.map(d => {return {...d, ...lookup[d.name]}})

    //change any undefined values to empty arrays
    facetrv.cfgs.data.forEach(d => d.content = d.content == undefined ? [] : d.content )

    l.frames = [...l.frames, ...facetrv.cfgs.frames]
    l.data = [...l.data, ...facetrv.cfgs.data]
    if (options.rows) l.accessors[options.rows] = {domain:facetrv.sets.domainH, type:'band', range:'-height'}
    if (options.cols) l.accessors[options.cols] = {domain:facetrv.sets.domainW, type:'band', range:'width'}
};

// Wrap a 1d ribbon of panels into 2d
H.gg.prototype.facet_wrap = function (options={}) {

    let defaults = this.defaults.ggplot.facet_wrap
    options = {...defaults, ...options}

    let l = this._current_layer
    l.facet = 'wrap'

    if (!options.ncol) options.ncol = 3;

    let keys = d3.map(l.data[0].content, d => d[options.vars]).keys()

    let gridRef = {}
    keys.forEach((d,i) => {
        gridRef[d] = {col:i%options.ncol, row:Math.floor(i/options.ncol), key:d, index:i}
    })

    l.data[0].content = l.data[0].content.map((d,i) => {return {...d, row:gridRef[d[options.vars]].row, col:gridRef[d[options.vars]].col}});
    
    let cfg = {
        data: l.data[0].content,
        splitFieldH:'row',
        splitFieldW:'col',
        rootFrame:l.frames[0],
        prefix:'grid-'
    }

    l.frames = []

    let facetrv = H.dataDiv.facet_grid(cfg);

    //add wrap title to frame
    facetrv.cfgs.frames.forEach((d,i) => {
        d.facet_title = keys[i] ? keys[i] : ''
    })


    let shape = l.draw[0]
    l.draw = []

    l.cols = facetrv.sets.domainH
    l.rows = facetrv.sets.domainW

    let lookup = {}

    let index = 0

    facetrv.sets.domainH.forEach((h, i) => {
        facetrv.sets.domainW.forEach((w, j) => {

            if (facetrv.cfgs.frames[index].facet_title != ''){

                let facet = facetrv.sets.facets[h][w];
                
                lookup[facet.frame] = {col: h, row: w}

                shape = H.Clone.deep(shape)
                shape.data = facet.data
                shape.frame = facet.frame

                l.draw.push(shape);
            }

            index++

        });
    });

    //filter empty data and frames
    facetrv.cfgs.frames = facetrv.cfgs.frames.filter(d => d.facet_title != '')
    facetrv.cfgs.data = facetrv.cfgs.data.filter(d => d.content != undefined)

    facetrv.cfgs.frames = facetrv.cfgs.frames.map(d => {return {...d, ...lookup[d.name]}})

    // //change any undefined values to empty arrays
    // facetrv.cfgs.data.forEach(d => d.content = d.content == undefined ? [] : d.content )

    l.frames = [...l.frames, ...facetrv.cfgs.frames]
    l.data = [...l.data, ...facetrv.cfgs.data]
    if (options.rows) l.accessors[options.rows] = {domain:facetrv.sets.domainH, type:'band', range:'-height'}
    if (options.cols) l.accessors[options.cols] = {domain:facetrv.sets.domainW, type:'band', range:'width'}

};

// Quote faceting variables
H.gg.prototype.vars = function (x) {
    this.x = x;
    return this;
};