// Set guides for each scale
H.gg.prototype.guides = function (options = {}) {
    this._guide_config = { ...this._guide_config, ...options }
};

// Continuous colour bar guide
H.gg.prototype.guide_colourbar = function (options={}) {
    let defaults = this.defaults.ggplot.guide_colourbar
    options = { ...defaults, ...options }

    if (!options.position) options.position = 50 //50% middle of plot

      // Unrelated Gradient Example
      // make frames
      let numLabels = 4;
      let size = options.barwidth || 10;
      let colorSize = 5; // for color guide
      let fontSize = 5;
      let ffract = fontSize*.4 // height midpoint for this font

      if (options.aes && this._plot_accessors[options.aes]) {

        let gradientGuideFrame = {name:`guide`, translate:{ x: '95%', y: `${options.position}%` }, bbox:{h:size*numLabels, w:size}};
        let gradientGuide = Guide.format(numLabels, 1, gradientGuideFrame, 'gradientGuide-', ['tr', 'lt', 'af']); // include top-right, line-top, area-fill data
        
        let title = { name: 'text', pos: { x: 0, y: `calc(pcnt(100)+px(${size*3.5}))` }, textAnchor: 'start', font: { color: 'black', size: fontSize + 2, weight: 500 } }
        title.content = this._plot_accessors[options.aes].field
        
        let gradient = H.Visualization.genGradientFromSA(options.aes, {accessors:this._plot_accessors});

        // NOTE: Manual frame name assignment here because it is not coming from the format splits.
        // This also means you have to include the root frame manually!
        let areaObj = {name:'area', id:'gradient', frame:'guide', color:gradient, y1:0}
        let lineObj = {name:'line', x:'x', y:'y', stroke:{color:'white', width:1, dash:`${size*.25} ${size*.5}`}}
        let gTextObj = {name:'text', frame:'f0', pos:{x:`calc(pcnt(100)+px(${colorSize}))`, y:`calc(pcnt(100)-px(${ffract}))`}, textAnchor:'start', font:{color:'black', size:12}};
        
        let subset_domain = [+this._plot_accessors[options.aes].domain[0], +this._plot_accessors[options.aes].domain[this._plot_accessors[options.aes].domain.length-1]]
        let dataContent = Guide.subset(4, subset_domain)

        let gradientLablPerms = {content:dataContent};
        let ggDrawItems = Guide.populate(gradientGuide.sets, [[areaObj, 'rootFrame', 'af'], [lineObj, 'numFrames', 'lt'], [gTextObj, gradientLablPerms, 'tr']]);

        title.frame = gradientGuide.sets.frames[0];

        //------ separate this._guide not needed? ------
        this._guide.accessors = { ...this._guide.accessors, ...gradientGuide.cfgs.accessors}
        this._guide.data.push(...gradientGuide.cfgs.data)
        this._guide.frames.push(...gradientGuide.cfgs.frames)
        this._guide.frames.push(gradientGuideFrame)
        this._guide.draw.push(title)
        this._guide.draw.push(...ggDrawItems)
      }
};


// Legend guide
H.gg.prototype.guide_legend = function (options = {}) {
    let defaults = this.defaults.ggplot.guide_legend
    options = { ...defaults, ...options }

    if (!options.position) options.position = 50 //50% middle of plot

    if (options.aes && this._plot_accessors[options.aes]) {
        let l;
        //handle legend key shape
        if (options.key_glyph){
            if (typeof options.key_glyph == 'string'){
                // remove leading draw_key if included
                if (options.key_glyph.includes('draw_key_')) options.key_glyph = options.key_glyph.split('draw_key_')[1]
                //call key creator 
                l = this[`draw_key_${options.key_glyph}`]()
            } else {
                //call key creator with params
                l = this[Object.keys(options.key_glyph)[0]](options.key_glyph[Object.keys(options.key_glyph)[0]])
            }
        } else {
            if (options.aes == 'shape' || options.aes == 'size'){
                l = this.draw_key_point()
            } else if (options.aes == 'color' || options.aes == 'fill'){
                l = this.draw_key_rect()
            } else if (options.aes == 'linetype'){
                l = this.draw_key_timeseries()
            }
        }

        let textFrame = H.Clone.deep(l.frames[0])

        //mark plot as false to avoid theme adding background    
        textFrame.plot = false
        textFrame.name = textFrame.name + '_text'

        // general
        let fontSize = 5;
        let ffract = fontSize * .4 // height midpoint for this font
        let maxSize = 20; // for size guide
        let itemSize = 10; // for color guide

        let frameName = `guide`

        let framesize = options.keywidth || 10

        // Objects in each guide
        let drawObj = l.draw[0]

        drawObj.frame = frameName
        if (options.aes == 'color') {
            drawObj.color = 'rgba(0,0,0,0)'
            drawObj.stroke ? drawObj.stroke.width = 1 : drawObj.stroke = { width: 1 }
        }
        if (options.aes == 'size') drawObj.size = 'size'

        let textObj = { name: 'text', frame: frameName, pos: { x: `calc(pcnt(50)+px(${maxSize}))`, y: `calc(pcnt(50)-px(${ffract}))` }, textAnchor: 'start', font: { color: 'black', size: fontSize } };

        // make frames
        let guideFrame = { name: frameName, translate: { x: '95%', y: `${options.position}%` }, bbox: { h: `${framesize}%` , w: `${framesize}%` } };

        guideFrame = H.Merge.deep(H.Clone.deep(this.defaults.vspec.frame), guideFrame)

        let title = { name: 'text', pos: { x: 0, y: `calc(pcnt(100)+px(${itemSize}))` }, textAnchor: 'start', font: { color: 'black', size: fontSize + 2, weight: 500 } }

        let dataContent, guideCfg, titleFrame, drawPerms, lablPerms, drawItems;

        let mapping = {
            fill: 'color',
            color: 'stroke.color',
            size: 'size',
            shape: 'shape'
        }

        if (this._plot_accessors[options.aes].type == 'band' || this._plot_accessors[options.aes].type == 'ordinal' || this._plot_accessors[options.aes].type == 'sequential') {
            dataContent = this._plot_accessors[options.aes].domain
            title.content = this._plot_accessors[options.aes].field

            guideFrame.bbox = { h: framesize*(dataContent.length/options.ncol) , w: framesize*options.ncol }

            guideCfg = Guide.format(Math.ceil(dataContent.length / options.ncol), options.ncol, guideFrame, `${l.name}-${options.aes}-`);


        } else {

            // make frames
            dataContent = Guide.subset(4, this._plot_accessors[options.aes].domain); // Make range subset.
            title.content = this._plot_accessors[options.aes].field

            guideFrame.bbox = { h: framesize*(dataContent.length/options.ncol)  , w: framesize*options.ncol}

            guideCfg = Guide.format(Math.ceil(dataContent.length / options.ncol), options.ncol, guideFrame, `${l.name}-${options.aes}-`);
        }

        let cgsf = guideCfg.sets.frames.reverse() // Example - change frame sort order.
        if (options.ncol > 1){
            let indexes = Array(cgsf.length).fill(0).map((d, i) => parseInt(i / 2));
            let newFrames = indexes.map((d, i) => i % 2 ? cgsf[i - 1] : cgsf[i + 1]);
            guideCfg.sets.frames = newFrames;
        }
        titleFrame = cgsf[0];

        //add plot accessor to layer if it doesn't exist
        if (!this._current_layer.accessors[`${this._current_layer.options.name}-${options.aes}`]) this._current_layer.accessors[`${this._current_layer.options.name}-${options.aes}`] = this._plot_accessors[options.aes]

        drawPerms = { [mapping[options.aes]]: dataContent.map(d => `bindAccessor(${this._current_layer.options.name}-${options.aes},${d})`) }; // create all guide permutations
        lablPerms = { content: dataContent };
        guideCfg.sets.accessorX = `${l.name}-x`
        guideCfg.sets.accessorY = `${l.name}-y`

        drawItems = Guide.populate(guideCfg.sets, [[drawObj, drawPerms], [textObj, lablPerms]]);
        title.frame = titleFrame

        //change data to glyph data
        guideCfg.cfgs.data[0].content = l.data[0].content

        //------ separate this_guide not needed? ------
        this._guide.accessors = { ...this._guide.accessors, ...l.accessors, ...guideCfg.cfgs.accessors }
        this._guide.data.push(...guideCfg.cfgs.data)
        this._guide.frames.push(...guideCfg.cfgs.frames)

        guideFrame.bbox.w = `calc(pcnt(2)+px(${framesize*options.ncol}))`
        guideFrame.bbox.h = `calc(pcnt(4)+px(${framesize*(dataContent.length/options.ncol)}))`
        guideFrame.plot = false
        
        this._guide.frames.push(guideFrame)
        this._guide.draw.push(title)
        this._guide.draw.push(...drawItems)

        options.position -= 20
    } else {
        console.log('No aesthetic mapping provided for guide')
    }

};

// Axis guide
H.gg.prototype.guide_axis = function (x) {
    this.x = x;
    return this;
};

// A binned version of guide_legend
H.gg.prototype.guide_bins = function (x) {
    this.x = x;
    return this;
};

// Discretized colourbar guide
H.gg.prototype.guide_coloursteps = function (x) {
    this.x = x;
    return this;
};

// guide_none
H.gg.prototype.guide_none = function (x) {
    this.x = x;
    return this;
};

// Specify a secondary axis
H.gg.prototype.sec_axis = function (x) {
    this.x = x;
    return this;
};

// Specify a secondary axis
H.gg.prototype.dup_axis = function (x) {
    this.x = x;
    return this;
};

// Specify a secondary axis
H.gg.prototype.derive = function (x) {
    this.x = x;
    return this;
};
