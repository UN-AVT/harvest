// 'use strict'
// import { h_visualization_defaults, ggplot_defaults } from "./definitions.js";

////////////////////////////////////////////////////////////
////////////////////// DEFAULTS CLASS //////////////////////
////////////////////////////////////////////////////////////

H.Config = class {
    constructor(vspec, data, draw, frames, accessors){
        this._vspec = H.Clone.deep(vspec) || {}
        this._defs = H.Clone.deep(h_visualization_defaults)
        this._data = data || []
        this.vspec = {}
        this._draw = draw || this._vspec.draw || []
        this._frames = frames || this._vspec.frames || []
        this.accessors = accessors || this._vspec.accessors || []
        this.ggplot = ggplot_defaults

        this.generate() // run on new instance
    }

    generate(){
        // replace any values in the defaults object that have been specified by the user in vpsec
        let updatedDefs = H.Merge.deep(this._defs, this._vspec)

        // replace 'undefined' values with value for the same key from the parent object or root to create a complete set of defaults
        this.vspec = createDefaults(updatedDefs, [], updatedDefs)

        // deep merge the completed defaults object with the user defined vspec to ensure all user definied properties take priority
        this.vspec = H.Merge.deep(this.vspec, this._vspec)
    }

    get data(){
        //check for formatted data
        return this._data.length > 0 ? this._data[0].content ? this._data : [{name:`${this.vspec.name}-d`, content:this._data}] : []
    }

    get frames(){
        // fill in missing values from frame default
        return this._frames.map(f => H.Merge.deep(H.Clone.deep(this.vspec.frame),f))
    }

    get draw(){
        // fill in missing values from each draw object
        return this._draw.map(d => H.Merge.deep(H.Clone.deep(this.vspec[d.name]),d))
    }

    get config() {
        return {
            logLevel:this.vspec.logLevel,
            accessors: this.accessors,
            data:this.data,
            name:this.vspec.name,
            frames:this.frames,
            element: {
                selector: this.vspec.element.selector,
                sizing:{
                    width: this.vspec.dimensions.width,
                    height: this.vspec.dimensions.height,
                    keepAspect: this.vspec.dimensions.keepAspect,
                },
                style: {
                    margin: `${this.vspec.margin.top}px ${this.vspec.margin.right}px ${this.vspec.margin.bottom}px ${this.vspec.margin.left}px`
                },
                attrs: {
                },
            },
            draw:this.draw
        }
    }

}

////////////////////////////////////////////////////////////
/////////// CREATING DEFAULTS USING DEFS & VSPEC ///////////
////////////////////////////////////////////////////////////

// fill in any undefined values that have keys declared
function createDefaults(obj, path=[], original){
    for (let key in obj){
        if (obj[key] === undefined){
            let res = findAndSet(path, key, original)
            obj[key] = res
        } else if (obj[key] instanceof Object){
            //fill gaps
            if (original.hasOwnProperty(key) && obj != original) obj[key] = H.Merge.deep(H.Clone.deep(original[key]), obj[key])
            path.push(key)
            createDefaults(obj[key], path, original)
            path.pop()
        }
    }
    return obj
}

// reverse traversal search for undefined values by key name retuning closest match
function findAndSet(path,key,obj){
    let res

    const get = (p, o) => 
    p.reduce((xs, x) => (xs===null || xs===undefined) ? undefined: xs[x], o)
    
    path.push(key)

    while (res === undefined && path.length > 0){

        let getRes = get(path, obj)

        if ((getRes instanceof Object && !Array.isArray(getRes) && Object.keys(getRes).length > 0) || !(getRes instanceof Object)){
            res = getRes
        } else {
            return getRes
        }

        path.pop()

        if (path.length > 0){
            path.pop()
            path.push(key)
        }
    }
    
    return res
}

////////////////////////////////////////////////////////////
///////////////////// Hive DEFAULTS VALUES /////////////////
////////////////////////////////////////////////////////////

const h_visualization_defaults = {
    logLevel: "warn",
    element: {
        selector: undefined,
        style: {
            margin: undefined
        },
        attrs: {},
        dimensions: undefined
    },
    frame: {
        name: 'frame-0',
        translate: undefined,
        origin: undefined,
        bbox: undefined,
        rotate: 0,
        mirror: false,
        plot:true
    },
    contentHandler: d => null,
    name: 'view',
    selector: "#vis-section",
    font: {
        family: 'Roboto',
        color: '#000000',
        size: 7,
        style: 'normal',
        weight: 400
    },
    id: 'default-id',
    fit: true,
    renderopts: "norotate nomirror",
    shape: 'rectangle',
    series: 'single',
    orientation: 'vertical',
    direction: 'bottom_top',
    perspective: '2d',
    rotate: 0,
    x: 'x',
    y: 'y',
    y0: 'y',
    offset: { x: 50, y: 50 },
    origin: { h: '50%', w: '50%' },
    color: 'rgba(89, 89, 89, 1.00)',
    colorscale: H.colormap_salinity,
    background: {
        color: undefined,
    },
    margin: {
        top: 100,
        right: 0,
        bottom: 100,
        left: 100,
    },
    translate: {
        x: '50%',
        y: '50%'
    },
    bbox: {
        h: "65%",
        w: "80%"
    },
    dimensions: {
        width: 1500,
        height: 750,
        keepAspect: true
    },
    sort: {
        x: 'none',
        y: 'none'
    },
    stroke: {
        color: undefined,
        width: 1,
        style: 'solid'
    },
    onClick: {
        groupName: "group",
        handler: (e, d) => {
            console.log('click handler')
        }
    },
    onMouseEnter: {
        groupName: "group",
        handler: (e, d) => {
            console.log('mouse enter handler')
        }
    },
    onMouseLeave: {
        groupName: "group",
        handler: (e, d) => {
            console.log('mouse leave handler')
        },
        contentHandler: undefined
    },
    tip: {
        selector: undefined,
        trigger: 'manual',
        followCursor: true,
        hideOnClick: true,
        allowHTML: true,
    },
    ticks: {
        qty: 5,
        length: 5,
        stroke: undefined,
        font: undefined,
        rotate: undefined,
        padding: 8,
        rotate: 0
    },
    grid: {
        vertical: {
            qty: 5,
            stroke: undefined
        },
        horizontal: {
            qty: 5,
            stroke: undefined
        }
    },
    axis: {
        name: 'axis',
        orientation: 'bottom',
        ticks: undefined,
        title: 'axis_title',
        format: 'decimal',
        rotate: 0,
        stroke: undefined,
        baseline: {
            show: true,
        },
        padding: 10,
        renderopts: undefined,
        gridColor: 'rgba(4,4,4,.1)',
        frame: 'frame-0',
        font:undefined
    },
    export: {
        name: undefined
    },
    emitter: {
        publish: null,
        subscribe: null
    },
    line: {
        id: undefined,
        name: 'line',
        x: undefined,
        y: undefined,
        stroke: undefined,
        // onClick:undefined,
        // onMouseEnter:undefined,
        // onMouseLeave:undefined,
        dash: '',
        frame: 'frame-0',
        plot:true
    },
    circle: {
        id: undefined,
        name: 'circle',
        x: undefined,
        y: undefined,
        r: 5,
        color: undefined,
        stroke: { width: 0 },
        material: 'matcap',
        type: 'circle',
        texture: 'Cream',
        group: 'points-group',
        onClick: undefined,
        onMouseEnter: undefined,
        onMouseLeave: undefined,
        frame: 'frame-0'
    },
    point: {
        id: undefined,
        name: 'point',
        x: undefined,
        y: undefined,
        color: undefined,
        stroke: { width: 0 },
        shape: 'circle',
        size: 10,
        group: 'points-group',
        onClick: undefined,
        onMouseEnter: undefined,
        onMouseLeave: undefined,
        frame: 'frame-0'
    },
    errorbar: {
        id: undefined,
        name: 'errorbar',
        stroke: undefined,
        whiskerLen: 10,
        x: 'x',
        y: 'y',
        min: 'min',
        max: 'max',
        orientation: 'v'
    },
    boxplot: {
        id: undefined,
        name: 'boxplot',
        stroke: undefined,
        color: 'rgba(0,0,0,0)',
        whiskerLen: 10,
        x: 'x',
        y: 'y',
        min: 'min',
        max: 'max',
        lower: 'lower',
        upper: 'upper',
        notchLower: 'notchLower',
        notchUpper: 'notchUpper',
        notchWidth: 0.8,
        orientation: 'v',
        width:0.8
    },
    binhex: {
        name: 'binhex',
        id: undefined,
        frame: undefined,
        stroke: { width: .1, color: "rgb(0,0,0,1)" },
        color: "grey",
    },
    rectangle: {
        id: undefined,
        name: 'rectangle',
        x: undefined,
        y: undefined,
        w: 30,
        b: 0,
        color: undefined,
        stroke: { width: 0 },
        padding: 10,
        orientation: undefined,
        // onClick:undefined,
        // onMouseEnter:undefined,
        // onMouseLeave:undefined,
        frame: 'frame-0'
    },
    tbar: {
        id: undefined,
        name: 'tbar',
        x: undefined,
        y: 0,
        w: 6,
        h: undefined,
        color: undefined,
        stroke: undefined,
        padding: 0,
        orientation: undefined,
        // onClick:undefined,
        // onMouseEnter:undefined,
        // onMouseLeave:undefined,
        frame: 'frame-0'
    },
    area: {
        id: undefined,
        name: 'area',
        x: undefined,
        // y0: undefined,
        y1: 0,
        // color: undefined,
        stroke: { width: 0 },
        orientation: undefined,
        // onClick:undefined,
        // onMouseEnter:undefined,
        // onMouseLeave:undefined,
        frame: 'frame-0'
    },
    label: {
        id: undefined,
        x: undefined,
        y: undefined,
        background: undefined,
        stroke: undefined,
        font: undefined,
        rotate: undefined,
        // offset: 'y',
        flipColor: 'White',
        color: "Black",
        // contentHandler: undefined,
        frame: 'frame-0',
        value:""
    },
    text: {
        id: undefined,
        pos: {
            x: undefined,
            y: undefined,
        },
        content: '',
        background: undefined,
        stroke: undefined,
        font: undefined,
        rotate: undefined,
        // offset: undefined,
        color: "Black",
        frame: 'frame-0',
        offset:{
            x:0,
            y:0
        },
    },
    geopath:{
        // projection:'Mercator', 
        stroke:{
            width:3, 
            color:"rgb(0,0,0,.5)"
        },
        // projectionOpts:{
        //     center:[-73.9679163, 40.7495461], 
        //     scale:100000,
        //     rotate:[0,0,0]
        // },
        // feature:'[feature]',
        // generate:{
        //     latitude:'lat', 
        //     longitude:'lon'
        // }
    },
    arc:{
        startAngle:0, 
        endAngle:0, 
        innerRadius:0, 
        outerRadius:0, 
        color: "Black", 
        alpha:1, 
        stroke: undefined
    },
    violin:{
        color:"black",
        x:'len', 
        y:'y', 
        band:'x', 
        curve:d3.curveCatmullRom
    },
    edge:{}
}

////////////////////////////////////////////////////////////
////////////////// GGLOT DEFAULTS VALUES ///////////////////
////////////////////////////////////////////////////////////

const ggplot_defaults = {
    aes:{
        x:{continuous : 'scale_x_continuous', discrete:'scale_x_discrete'},
        y:{continuous : 'scale_y_continuous', discrete:'scale_y_discrete'},
        color:{continuous : 'scale_colour_continuous', discrete: 'scale_colour_discrete'},
        fill:{continuous: 'scale_fill_continuous', discrete: 'scale_fill_discrete'},
        shape:{continuous: 'scale_shape_binned', discrete: 'scale_shape'},
        size:{continuous:'scale_size', discrete: 'scale_size'},
        linetype:{continuous:'scale_linetype_binned', discrete: 'scale_linetype_discrete'},
        width: {continuous : 'scale_x_continuous', discrete:'scale_x_discrete'}
    },
    layer: {
        geom: null,
        stat: null,
        data: null,
        mapping: null,
        position: null,
        params: {},
        check: {
            aes: true,
            param: true
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        key_glyph: null,
        layer_class: 'Layer',
        facet:'none',
    },
    geom_raster: {
        geom:'raster',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        hjust: 0.5,
        vjust: 0.5,
        interpolate: false,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_rect: {
        geom:'rect',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        linejoin: "mitre",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'rectangle'
    },
    geom_tile: {
        geom:'tile',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        linejoin: "mitre",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'rectangle'
    },
    geom_abline: {
        geom:'abline',
        mapping: null,
        data: null,
        slope: null,
        intercept: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        _shape:'line'
    },
    geom_hline: {
        geom:'hline',
        mapping: null,
        data: null,
        yintercept: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        _shape:'line'
    },
    geom_vline: {
        geom:'vline',
        mapping: null,
        data: null,
        xintercept: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        _shape:'line'
    },
    geom_bar: {
        geom:'bar',
        mapping: null,
        data: null,
        stat: "count",
        position: "stack",
        width: null,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'rectangle'
    },
    geom_col: {
        geom:'col',
        mapping: null,
        data: null,
        position: "stack",
        width: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'rectangle'
    },
    stat_count: {
        mapping: null,
        data: null,
        geom: "bar",
        position: "stack",
        width: null,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_bin2d: {
        geom:'bin2d',
        mapping: null,
        data: null,
        stat: "bin2d",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'rectangle'
    },
    stat_bin_2d: {
        mapping: null,
        data: null,
        geom: "tile",
        position: "identity",
        bins: 30,
        binwidth: null,
        drop: true,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_blank: {
        geom:'blank',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_boxplot: {
        geom:'boxplot',
        mapping: null,
        data: null,
        stat: "boxplot",
        position: "dodge2",
        outlier: {
            colour: null,
            color: null,
            fill: null,
            shape: 19,
            size: 1.5,
            stroke: 0.5,
            alpha: null
        },
        notch: false,
        notchwidth: 0.5,
        varwidth: false,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'boxplot'
    },
    stat_boxplot: {
        mapping: null,
        data: null,
        geom: "boxplot",
        position: "dodge2",
        coef: 1.5,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_contour: {
        geom:'contour',
        mapping: null,
        data: null,
        stat: "contour",
        position: "identity",
        bins: null,
        binwidth: null,
        breaks: null,
        lineend: "butt",
        linejoin: "round",
        linemitre: 10,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_contour_filled: {
        geom:'contour_filled',
        mapping: null,
        data: null,
        stat: "contour_filled",
        position: "identity",
        bins: null,
        binwidth: null,
        breaks: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_contour: {
        mapping: null,
        data: null,
        geom: "contour",
        position: "identity",
        bins: null,
        binwidth: null,
        breaks: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_contour_filled: {
        mapping: null,
        data: null,
        geom: "contour_filled",
        position: "identity",
        bins: null,
        binwidth: null,
        breaks: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_count: {
        geom:'count',
        mapping: null,
        data: null,
        stat: "sum",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_sum: {
        mapping: null,
        data: null,
        geom: "point",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_density: {
        geom:'density',
        mapping: null,
        data: null,
        stat: "density",
        position: "identity",
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        outline: {
            type: "upper"
        }
    },
    stat_density: {
        mapping: null,
        data: null,
        geom: "area",
        position: "stack",
        bw: "nrd0",
        adjust: 1,
        kernel: "gaussian",
        n: 512,
        trim: false,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_density_2d: {
        geom:'density_2d',
        mapping: null,
        data: null,
        stat: "density_2d",
        position: "identity",
        contour_var: "density",
        lineend: "butt",
        linejoin: "round",
        linemitre: 10,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_density_2d_filled: {
        geom:'density_2d_filled',
        mapping: null,
        data: null,
        stat: "density_2d_filled",
        position: "identity",
        contour_var: "density",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_density_2d: {
        mapping: null,
        data: null,
        geom: "density_2d",
        position: "identity",
        contour: true,
        contour_var: "density",
        n: 100,
        h: null,
        adjust: [1, 1],
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_density_2d_filled: {
        mapping: null,
        data: null,
        geom: "density_2d_filled",
        position: "identity",
        contour: true,
        contour_var: "density",
        n: 100,
        h: null,
        adjust: [1, 1],
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_dotplot: {
        geom:'dotplot',
        mapping: null,
        data: null,
        position: "identity",
        binwidth: null,
        bins:30,
        binaxis: "x",
        method: "dotdensity",
        binpositions: "bygroup",
        stackdir: "up",
        stackratio: 1,
        dotsize: 1,
        stackgroups: false,
        origin: null,
        right: true,
        width: 0.9,
        drop: false,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'point'
    },
    geom_errorbarh: {
        geom:'errorbarh',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'errorbar'
    },
    geom_function: {
        geom:'function',
        mapping: null,
        data: null,
        stat: "function",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_function: {
        mapping: null,
        data: null,
        geom: "function",
        position: "identity",
        fun: null,
        xlim: null,
        n: 101,
        args: {},
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_hex: {
        geom:'hex',
        mapping: null,
        data: null,
        stat: "binhex",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'binhex'
    },
    stat_bin_hex: {
        mapping: null,
        data: null,
        geom: "hex",
        position: "identity",
        bins: 30,
        binwidth: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_freqpoly: {
        geom:'freqpoly',
        mapping: null,
        data: null,
        stat: "bin",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'line'
    },
    geom_histogram: {
        geom:'histogram',
        mapping: null,
        data: null,
        stat: "bin",
        position: "stack",
        binwidth: null,
        bins: null,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'rectangle'
    },
    stat_bin: {
        mapping: null,
        data: null,
        geom: "bar",
        position: "stack",
        binwidth: null,
        bins: 30,
        center: null,
        boundary: null,
        breaks: null,
        closed: ["right", "left"],
        pad: false,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        filter:null
    },
    geom_jitter: {
        geom:'jitter',
        mapping: null,
        data: null,
        stat: "identity",
        position: "jitter",
        width: null,
        height: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'point'
    },
    geom_crossbar: {
        geom:'crossbar',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        fatten: 2.5,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'boxplot'
    },
    geom_errorbar: {
        geom:'errorbar',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'errorbar'
    },
    geom_linerange: {
        geom:'linerange',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'errorbar'
    },
    geom_pointrange: {
        geom:'pointrange',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        fatten: 4,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'errorbar'
    },
    geom_map: {
        geom:'map',
        mapping: null,
        data: null,
        stat: "identity",
        map: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'geopath'
    },
    geom_path: {
        geom:'path',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        lineend: "butt",
        linejoin: "round",
        linemitre: 10,
        arrow: null,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'line'
    },
    geom_line: {
        geom:'line',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'line'
    },
    geom_step: {
        geom:'step',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        direction: "hv",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'line'
    },
    geom_point: {
        geom:'point',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'point'
    },
    geom_polygon: {
        geom:'polygon',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        rule: "evenodd",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'area'
    },
    geom_qq_line: {
        mapping: null,
        data: null,
        geom: "path",
        position: "identity",
        distribution: 'stats::qnorm',
        dparams: {},
        line: {
            p: [0.25, 0.75]
        },
        fullrange: false,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_qq_line: {
        mapping: null,
        data: null,
        geom: "path",
        position: "identity",
        distribution: 'stats::qnorm',
        dparams: {},
        line: {
            p: [0.25, 0.75]
        },
        fullrange: false,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_qq: {
        mapping: null,
        data: null,
        geom: "point",
        position: "identity",
        distribution: 'stats::qnorm',
        dparams: {},
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_qq: {
        mapping: null,
        data: null,
        geom: "point",
        position: "identity",
        distribution: 'stats::qnorm',
        dparams: {},
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_quantile: {
        geom:'quantile',
        mapping: null,
        data: null,
        stat: "quantile",
        position: "identity",
        lineend: "butt",
        linejoin: "round",
        linemitre: 10,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_quantile: {
        mapping: null,
        data: null,
        geom: "quantile",
        position: "identity",
        quantiles: [0.25, 0.5, 0.75],
        formula: null,
        method: "rq",
        args: {},
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_ribbon: {
        geom:'ribbon',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        outline: {
            type: "both"
        },
        _shape:'area'
    },
    geom_area: {
        geom:'area',
        mapping: null,
        data: null,
        stat: "identity",
        position: "stack",
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        outline: { 
            type: "upper" 
        },
        _shape:'area'

    },
    geom_rug: {
        geom:'rug',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        outside: false,
        sides: "bl",
        length: 1, //[0.03, "npc"]
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_segment: {
        geom:'segment',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        arrow: {
            fill: null
        },
        lineend: "butt",
        linejoin: "round",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'line'
    },
    geom_curve: {
        geom:'curve',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        curvature: 0.5,
        angle: 90,
        ncp: 5,
        arrow: {
            fill: null
        },
        lineend: "butt",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_smooth: {
        geom:'smooth',
        mapping: null,
        data: null,
        stat: "smooth",
        position: "identity",
        method: null,
        se: true,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_smooth: {
        mapping: null,
        data: null,
        geom: "smooth",
        position: "identity",
        method: null,
        args: {},
        formula: 'loess',
        se: true,
        n: 80,
        span: 0.75,
        fullrange: false,
        level: 0.95,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_spoke: {
        geom:'spoke',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'rectangle'
    },
    geom_label: {
        geom:'label',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        parse: false,
        nudge_x: 0,
        nudge_y: 0,
        label: {
            padding: [0.25, "lines"],
            r: [0.15, "lines"],
            size: 0.25,
        },
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'label'
    },
    geom_text: {
        geom:'text',
        mapping: null,
        data: null,
        stat: "identity",
        position: "identity",
        parse: false,
        nudge_x: 0,
        nudge_y: 0,
        check_overlap: false,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_violin: {
        geom:'violin',
        mapping: null,
        data: null,
        stat: "ydensity",
        position: "dodge",
        draw_quantiles: null,
        trim: true,
        scale: "area",
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'violin'
    },
    stat_ydensity: {
        mapping: null,
        data: null,
        geom: "violin",
        position: "dodge",
        bw: "nrd0",
        adjust: 1,
        kernel: "gaussian",
        trim: true,
        scale: "area",
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    coord_sf: {
        xlim: null,
        ylim: null,
        expand: true,
        crs: null,
        datum: "sf::st_crs(4326)",
        label_graticule: null,
        label_axes: null,
        ndiscr: 100,
        default: false,
        clip: "on"
    },
    geom_sf: {
        geom:'sf',
        mapping: null,
        data: null,
        stat: "sf",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_sf_label: {
        geom:'sf_label',
        mapping: null,
        data: null,
        stat: "sf_coordinates",
        position: "identity",
        parse: false,
        nudge_x: 0,
        nudge_y: 0,
        label: {
            padding: [0.25, "lines"],
            r: [0.15, "lines"],
            size: 0.25,
        },
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        fun: {
            geometry: null
        }
    },
    geom_sf_text: {
        geom:'sf_text',
        mapping: null,
        data: null,
        stat: "sf_coordinates",
        position: "identity",
        parse: false,
        nudge_x: 0,
        nudge_y: 0,
        check_overlap: false,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        fun: {
            geometry: null
        }
    },
    stat_sf: {
        mapping: null,
        data: null,
        geom: "rect",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    geom_polar_bar: {
        geom:'pie',
        mapping: null,
        data: null,
        stat: "bin",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'arc'
    },
    geom_polar: {
        geom:'polar',
        mapping: null,
        data: null,
        stat: "bin",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        _shape:'line'
    },

    // polar axis
    polar_axis: {
        mapping: null,
        data: null,
    },

    // stats

    stat_ecdf: {
        mapping: null,
        data: null,
        geom: "step",
        position: "identity",
        n: null,
        pad: true,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_ellipse: {
        mapping: null,
        data: null,
        geom: "path",
        position: "identity",
        type: "t",
        level: 0.95,
        segments: 51,
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_identity: {
        mapping: null,
        data: null,
        geom: "point",
        position: "identity",
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_summary_2d: {
        mapping: null,
        data: null,
        geom: "tile",
        position: "identity",
        bins: 30,
        binwidth: null,
        drop: true,
        fun: "mean",
        args: {},
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },

    stat_summary_hex: {
        mapping: null,
        data: null,
        geom: "hex",
        position: "identity",
        bins: 30,
        binwidth: null,
        drop: true,
        fun: "mean",
        args: {},
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_summary_bin: {
        mapping: null,
        data: null,
        geom: "pointrange",
        position: "identity",
        fun: {
            data: null,
            max: null,
            min: null,
            args: {},
            y: null,
            ymin: null,
            ymax: null
        },
        bins: 30,
        binwidth: null,
        breaks: null,
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },

    stat_summary: {
        mapping: null,
        data: null,
        geom: "pointrange",
        position: "identity",
        fun: {
            data: null,
            max: null,
            min: null,
            args: {},
            y: null,
            ymin: null,
            ymax: null
        },
        orientation: 'NA',
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_unique: {
        mapping: null,
        data: null,
        geom: "point",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
    },
    stat_sf_coordinates: {
        mapping: null,
        data: null,
        geom: "point",
        position: "identity",
        na: {
            rm: false
        },
        show: {
            legend: 'NA'
        },
        inherit: {
            aes: true
        },
        fun: {
            geometry: null
        },
    },
    after_stat: {},

    after_scale: {},
    stage: {
        start: null,
        after_stat: null,
        after_scale: null
    },

    // position

    position_dodge: {
        width: null,
        preserve: ["total", "single"]
    },

    position_dodge2: {
        width: null,
        preserve: ["total", "single"],
        padding: 0.1,
        reverse: false
    },
    position_identity: {},

    position_jitter: {
        width: 0.4,
        height: 0.4,
        seed: 'NA'
    },

    position_jitterdodge: {
        jitter: {
            width: 0.4,
            height: 0,
        },
        dodge: {
            width: 0.75
        },
        seed: 'NA'
    },
    position_nudge: {
        x: 0,
        y: 0
    },
    position_stack: {
        vjust: 1,
        reverse: false
    },

    position_fill: {
        vjust: 1,
        reverse: false
    },

    //annotations

    annotate: {
        geom: null,
        x: null,
        y: null,
        xmin: null,
        xmax: null,
        ymin: null,
        ymax: null,
        xend: null,
        yend: null,
        na: {
            rm: false
        },
    },
    annotation_custom: {
        grob: null,
        xmin: Number.NEGATIVE_INFINITY,
        xmax: Number.INFINITY,
        ymin: Number.NEGATIVE_INFINITY,
        ymax: Number.INFINITY
    },
    annotation_logticks: {
        base: 10,
        sides: "bl",
        outside: false,
        scaled: true,
        short: [0.1, "cm"],
        mid: [0.2, "cm"],
        long: [0.3, "cm"],
        colour: "black",
        size: 0.5,
        linetype: 1,
        alpha: 1,
        color: null,
    },
    annotation_map: {},
    annotation_raster: {
        raster: null,
        xmin: null,
        xmax: null,
        ymin: null,
        ymax: null,
        interpolate: false
    },
    borders: {
        database: "world",
        regions: ".",
        fill: 'NA',
        colour: "grey50",
        xlim: null,
        ylim: null,
    },

    //aesthetics

    aes_colour_fill_alpha: {},
    aes_group_order: {},
    aes_linetype_size_shape: {},
    aes_position: {},

    //scales

    labs: {
        title: null,
        subtitle: null,
        caption: null,
        tag: null
    },
    xlab: {
        label: 'X Axis'
    },
    ylab: {
        label: 'Y Axis'
    },
    ggtitle: {
        label: null,
        subtitle: null
    },
    lims: {},
    xlim: {},
    ylim: {},
    expand_limits: {},
    expansion: {
        mult: 0,
        add: 0
    },
    expand_scale: {
        mult: 0, add: 0
    },
    scale_alpha: {
        type:"linear",
        aesthetics:['fill'],
        range: [0.1, 1]
    },
    scale_alpha_continuous: {
        type:"linear",
        aesthetics:['fill'],
        range: [0.1, 1]
    },
    scale_alpha_binned: {
        type:"ordinal",
        aesthetics:['fill'],
        range: [0.1, 1]
    },
    scale_alpha_discrete: {
        type:"ordinal",
        aesthetics:['fill'],
        range: [0.1, 1]
    },
    scale_alpha_ordinal: {
        type:"ordinal",
        aesthetics:['fill'],
        range: [0.1, 1]
    },
    scale_x_binned: {
        name: null,
        n: { breaks: 10 },
        nice: { breaks: true },
        breaks: null,
        labels: null,
        limits: null,
        expand: null,
        oob: 'squish',
        na: { value: 'NA_real_' },
        right: true,
        show: { limits: false },
        trans: "identity",
        guide: null,
        position: "bottom"
    },
    scale_y_binned: {
        name: null,
        n: { breaks: 10 },
        nice: { breaks: true },
        breaks: null,
        labels: null,
        limits: null,
        expand: null,
        oob: 'squish',
        na: { value: 'NA_real_' },
        right: true,
        show: { limits: false },
        trans: "identity",
        guide: null,
        position: "left"
    },
    scale_colour_brewer: {
        type: "seq",
        palette: 1,
        direction: 1,
        aesthetics: "colour"
    },
    scale_fill_brewer: {
        type: "seq",
        palette: 1,
        direction: 1,
        aesthetics: "fill"
    },
    scale_colour_distiller: {
        type: "seq",
        palette: 1,
        direction: -1,
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "colour"
    },
    scale_fill_distiller: {
        type: "seq",
        palette: 1,
        direction: -1,
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "fill"
    },
    scale_colour_fermenter: {
        type: "seq",
        palette: 1,
        direction: -1,
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "colour"
    },
    scale_fill_fermenter: {
        type: "seq",
        palette: 1,
        direction: -1,
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "fill"
    },
    scale_colour_continuous: {
        ref: 'scale_colour_gradient'
    },
    scale_fill_continuous: {
        ref: 'scale_fill_gradient'
    },
    scale_colour_discrete: {
        type: 'getOption("ggplot2.discrete.colour", getOption("ggplot2.discrete.fill"))',
    },
    scale_fill_discrete: {
        type: 'getOption("ggplot2.discrete.fill", getOption("ggplot2.discrete.colour"))',
    },
    continuous_scale:{
        aesthetics: null,
        scale_name: null,
        palette: null,
        name: null,
        breaks: null,
        minor_breaks: null,
        n: {
            breaks: null
        },
        labels: null,
        limits: null,
        rescaler: 'rescale',
        oob: 'censor',
        expand: null,
        na: {
            value : 'NA_real_'
        },
        trans: "identity",
        guide: "legend",
        position: "left",
        super: 'ScaleContinuous'
    },
    scale_x_continuous: {
        aes:'x',
        type:'linear',
        name: null,
        breaks: null,
        minor_breaks: null,
        n: { breaks: null },
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        trans: "identity",
        guide: null,
        position: "bottom",
        sec: { axis: null }
    },
    scale_y_continuous: {
        aes:'y',
        type:'linear',
        name: null,
        breaks: null,
        minor_breaks: null,
        n: { breaks: null },
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        trans: "identity",
        guide: null,
        position: "left",
        sec: { axis: null }
    },
    scale_x_log10: {
        aes:'x',
        type:'log',
        name: null,
        breaks: null,
        minor_breaks: null,
        n: { breaks: null },
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        trans: "identity",
        guide: null,
        position: "bottom",
        sec: { axis: null }
    },
    scale_y_log10: {
        aes:'y',
        type:'log',
        name: null,
        breaks: null,
        minor_breaks: null,
        n: { breaks: null },
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        trans: "identity",
        guide: null,
        position: "left",
        sec: { axis: null }
    },
    scale_x_reverse: {
        name: null,
        breaks: null,
        minor_breaks: null,
        n: { breaks: null },
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        trans: "identity",
        guide: null,
        position: "bottom",
        sec: { axis: null }
    },
    scale_y_reverse: {
        name: null,
        breaks: null,
        minor_breaks: null,
        n: { breaks: null },
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        trans: "identity",
        guide: null,
        position: "left",
        sec: { axis: null }
    },
    scale_x_sqrt: {
        aes:'x',
        type:'sqrt',
        name: null,
        breaks: null,
        minor_breaks: null,
        n: { breaks: null },
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        trans: "identity",
        guide: null,
        position: "bottom",
        sec: { axis: null }
    },
    scale_y_sqrt: {
        aes:'y',
        type:'sqrt',
        name: null,
        breaks: null,
        minor_breaks: null,
        n: { breaks: null },
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        trans: "identity",
        guide: null,
        position: "left",
        sec: { axis: null }
    },
    scale_x_date: {
        aes:'x',
        type:'time',
        name: null,
        breaks: null,
        date_breaks: null,
        labels: null,
        date_labels: null,
        minor_breaks: null,
        date_minor_breaks: null,
        limits: null,
        expand: null,
        guide: null,
        position: "bottom",
        sec: { axis: null }
    },
    scale_y_date: {
        aes:'y',
        type:'time',
        name: null,
        breaks: null,
        date_breaks: null,
        labels: null,
        date_labels: null,
        minor_breaks: null,
        date_minor_breaks: null,
        limits: null,
        expand: null,
        guide: null,
        position: "left",
        sec: { axis: null }
    },
    scale_x_datetime: {
        aes:'x',
        type:'time',
        name: null,
        breaks: null,
        date_breaks: null,
        labels: null,
        date_labels: null,
        minor_breaks: null,
        date_minor_breaks: null,
        timezone: null,
        limits: null,
        expand: null,
        guide: null,
        position: "bottom",
        sec: { axis: null }
    },
    scale_y_datetime: {
        aes:'y',
        type:'time',
        name: null,
        breaks: null,
        date_breaks: null,
        labels: null,
        date_labels: null,
        minor_breaks: null,
        date_minor_breaks: null,
        timezone: null,
        limits: null,
        expand: null,
        guide: null,
        position: "left",
        sec: { axis: null }
    },
    scale_x_time: {
        aes:'x',
        type:'time',
        name: null,
        breaks: null,
        minor_breaks: null,
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        guide: null,
        position: "bottom",
        sec: { axis: null }
    },
    scale_y_time: {
        aes:'y',
        type:'time',
        name: null,
        breaks: null,
        minor_breaks: null,
        labels: null,
        limits: null,
        expand: null,
        oob: 'censor',
        na: { value: 'NA_real_' },
        guide: null,
        position: "left",
        sec: { axis: null }
    },
    discrete_scale:{
        aesthetics: null,
        scale_name: null,
        palette: null,
        name: null,
        breaks: null,
        labels: null,
        limits: null,
        expand: null,
        na: {
            translate: true,
            value: 'NA'
        },
        drop:true,
        guide: "legend",
        position: "left",
        super: 'ScaleDiscrete'
    },
    scale_x_discrete: {
        aes:'x',
        type:'band',
        scale_name:null,
        palette:null,
        name: null,
        breaks: null,
        labels: null,
        limits : null,
        na: {
            translate: true,
            value: 'NA'
        },
        drop: true,
        expand: null,
        guide: null,
        position: "bottom"
    },
    scale_y_discrete: {
        aes:'y',
        type:'band',
        scale_name:null,
        palette:null,
        name: null,
        breaks: null,
        labels: null,
        limits : null,
        na: {
            translate: true,
            value: 'NA'
        },
        drop: true,
        expand: null,
        guide: null,
        position: "left"
    },
    scale_colour_gradient: {
        low: "#132B43",
        high: "#56B1F7",
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "colour"
    },
    scale_fill_gradient: {
        low: "#132B43",
        high: "#56B1F7",
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "fill"
    },
    scale_colour_gradient2: {
        low: '#CC6677',
        mid: "white",
        high: '#88CCEE',
        midpoint: 0,
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "colour"
    },
    scale_fill_gradient2: {
        low: '#CC6677',
        mid: "white",
        high: '#88CCEE',
        midpoint: 0,
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "fill"
    },
    scale_colour_gradientn: {
        colours: null,
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "colour",
        colors: null
    },
    scale_fill_gradientn: {
        colours: null,
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "fill",
        colors: null
    },
    scale_colour_grey: {
        start: 0.2,
        end: 0.8,
        na: { value: "red" },
        aesthetics: "colour"
    },
    scale_fill_grey: {
        start: 0.2,
        end: 0.8,
        na: { value: "red" },
        aesthetics: "fill"
    },
    scale_colour_hue: {
        h: [0, 360] + 15,
        c: 100,
        l: 65,
        h: { start: 15 },
        direction: 1,
        na: { value: "grey50" },
        aesthetics: "colour",
        guide:'legend'
    },
    scale_fill_hue: {
        h: [0, 360] + 15,
        c: 100,
        l: 65,
        h: { start: 0 },
        direction: 1,
        na: { value: "grey50" },
        aesthetics: "fill"
    },
    scale_colour_identity: {
        guide: "none",
        aesthetics: "colour"
    },
    scale_fill_identity: {
        guide: "none",
        aesthetics: "fill"
    },
    scale_shape_identity: {
        guide: "none",
        aesthetics: "shape"
    },
    scale_linetype_identity: {
        guide: "none",
        aesthetics: "linetype"

    },
    scale_alpha_identity: {
        guide: "none",
        aesthetics: "alpha"
    },
    scale_size_identity: {
        guide: "none",
        aesthetics: "size"
    },
    scale_discrete_identity: {
        aesthetics: null,
        guide: "none"
    },
    scale_continuous_identity: {
        aesthetics: null,
        guide: "none"
    },
    scale_linetype: {
        na: { value: "blank" }
    },
    scale_linetype_binned: {
        na: { value: "blank" }
    },
    scale_linetype_continuous: {},
    scale_linetype_discrete: {
        na: { value: "blank" }
    },
    scale_colour_manual: {
        values: null,
        aesthetics: "colour",
        breaks: null
    },
    scale_fill_manual: {
        values: null,
        aesthetics: "fill",
        breaks: null
    },
    scale_size_manual: {
        values: null,
        aesthetics: "size",
        breaks: null
    },
    scale_shape_manual: {
        values: null,
        aesthetics: "shape",
        breaks: null
    },
    scale_linetype_manual: {
        values: null,
        aesthetics: "linetype",
        breaks: null
    },
    scale_alpha_manual: {
        values: null,
        aesthetics: "alpha",
        breaks: null
    },
    scale_discrete_manual: {
        aesthetics: null,
        values: null,
        breaks: null
    },
    scale_shape: {
        solid: true,
        guide: "legend"
    },
    scale_shape_binned: {
        solid: true
    },
    scale_size: {
        name: null,
        breaks: null,
        labels: null,
        limits: null,
        range: [5, 10],
        trans: "identity",
        guide: "legend"
    },
    scale_radius: {
        name: null,
        breaks: null,
        labels: null,
        limits: null,
        range: [1, 6],
        trans: "identity",
        guide: "legend"
    },
    scale_size_binned: {
        name: null,
        breaks: null,
        labels: null,
        limits: null,
        range: [1, 6],
        n: { breaks: null },
        nice: { breaks: true },
        trans: "identity",
        guide: "bins"
    },
    scale_size_area: {
        max_size: 6
    },
    scale_size_binned_area: {
        max_size: 6
    },
    scale_colour_steps: {
        low: "#132B43",
        high: "#56B1F7",
        space: "Lab",
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "colour",
        n:{ breaks:5 },
        breaks:null
    },
    scale_colour_steps2: {
        low: '#CC6677',
        mid: "white",
        high: '#88CCEE',
        midpoint: 0,
        space: "Lab",
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "colour",
        n:{ breaks:5 },
        breaks:null
    },
    scale_colour_stepsn: {
        colours: null,
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "colour",
        colors: null,
        n:{ breaks:5 },
        breaks:null
    },
    scale_fill_steps: {
        low: "#132B43",
        high: "#56B1F7",
        space: "Lab",
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "fill",
        n:{ breaks:5 },
        breaks:null
    },
    scale_fill_steps2: {
        low: '#CC6677',
        mid: "white",
        high: '#88CCEE',
        midpoint: 0,
        space: "Lab",
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "fill",
        n:{ breaks:5 },
        breaks:null
    },
    scale_fill_stepsn: {
        colours: null,
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "fill",
        colors: null,
        n:{ breaks:5 },
        breaks:null
    },
    scale_colour_viridis_d: {
        alpha: 1,
        begin: 0,
        end: 1,
        direction: 1,
        option: "D",
        aesthetics: "colour"
    },
    scale_fill_viridis_d: {
        alpha: 1,
        begin: 0,
        end: 1,
        direction: 1,
        option: "D",
        aesthetics: "fill"
    },
    scale_colour_viridis_c: {
        alpha: 1,
        begin: 0,
        end: 1,
        direction: 1,
        option: "D",
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "colour"
    },
    scale_fill_viridis_c: {
        alpha: 1,
        begin: 0,
        end: 1,
        direction: 1,
        option: "D",
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "colourbar",
        aesthetics: "fill"
    },
    scale_colour_viridis_b: {
        alpha: 1,
        begin: 0,
        end: 1,
        direction: 1,
        option: "D",
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "colour"
    },
    scale_fill_viridis_b: {
        alpha: 1,
        begin: 0,
        end: 1,
        direction: 1,
        option: "D",
        values: null,
        space: "Lab",
        na: { value: "grey50" },
        guide: "coloursteps",
        aesthetics: "fill"
    },

    //guides

    draw_key_point: {
        data: null,
        params: null,
        size: null
    },
    draw_key_abline: {
        data: null,
        params: null,
        size: null
    },
    draw_key_rect: {
        data: null,
        params: null,
        size: null
    },
    draw_key_polygon: {
        data: null,
        params: null,
        size: null
    },
    draw_key_blank: {
        data: null,
        params: null,
        size: null
    },
    draw_key_boxplot: {
        data: null,
        params: null,
        size: null
    },
    draw_key_crossbar: {
        data: null,
        params: null,
        size: null
    },
    draw_key_path: {
        data: null,
        params: null,
        size: null
    },
    draw_key_vpath: {
        data: null,
        params: null,
        size: null
    },
    draw_key_dotplot: {
        data: null,
        params: null,
        size: null
    },
    draw_key_pointrange: {
        data: null,
        params: null,
        size: null
    },
    draw_key_smooth: {
        data: null,
        params: null,
        size: null
    },
    draw_key_text: {
        data: null,
        params: null,
        size: null
    },
    draw_key_label: {
        data: null,
        params: null,
        size: null
    },
    draw_key_vline: {
        data: null,
        params: null,
        size: null
    },
    draw_key_timeseries: {
        data: null,
        params: null,
        size: null
    },
    guide_colourbar: {
        title: {
            position: null,
            theme: null,
            hjust: null,
            vjust: null,
        },
        label: {
            position: null,
            theme: null,
            hjust: null,
            vjust: null,
        },
        barwidth: 10,
        barheight: null,
        nbin: 300,
        raster: true,
        frame: {
            colour: null,
            linewidth: 0.5,
            linetype: 1,
        },
        ticks: {
            colour: "white",
            linewidth: 0.5,
        },
        draw: {
            ulim: true,
            llim: true,
        },
        direction: null,
        default: {
            unit: "line"
        },
        reverse: false,
        order: 0,
        available_aes: ["colour", "color", "fill"],
    },
    guide_colorbar: {
        title: {
            position: null,
            theme: null,
            hjust: null,
            vjust: null,
        },
        label: {
            position: null,
            theme: null,
            hjust: null,
            vjust: null,
        },
        barwidth: 10,
        barheight: null,
        nbin: 300,
        raster: true,
        frame: {
            colour: null,
            linewidth: 0.5,
            linetype: 1,
        },
        ticks: {
            colour: "white",
            linewidth: 0.5,
        },
        draw: {
            ulim: true,
            llim: true,
        },
        direction: null,
        default: { unit: "line" },
        reverse: false,
        order: 0,
        available_aes: ["colour", "color", "fill"],
    },
    guide_legend: {
        title: {
            position: null,
            theme: null,
            hjust: null,
            vjust: null,
        },
        label: {
            position: null,
            theme: null,
            hjust: null,
            vjust: null,
        },
        keywidth: 10,
        keyheight: null,
        direction: null,
        default: { unit: "line" },
        override: { aes: {} },
        nrow: null,
        ncol: 1,
        byrow: false,
        reverse: false,
        order: 0,
    },
    guide_axis: {
        title: null,
        check: { overlap: false },
        angle: null,
        n: { dodge: 1 },
        order: 0,
        position: null
    },
    guide_bins: {
        title: {
            position: null,
            theme: null,
            hjust: null,
            vjust: null,
        },
        label: {
            position: null,
            theme: null,
            hjust: null,
            vjust: null,
        },
        keywidth: null,
        keyheight: null,
        axis: {
            colour: "black",
            linewidth: 0.5,
            arrow: null,
        },
        direction: null,
        default: { unit: "line" },
        override: { aes: {} },
        reverse: false,
        order: 0,
        show: { limits: null },
    },
    guide_coloursteps: {
        even: { steps: true },
        show: { limits: null },
        ticks: false,
    },
    guide_colorsteps: {
        even: { steps: true },
        show: { limits: null },
        ticks: false
    },
    guide_none: {
        title: null,
        position: null
    },
    guides: {
        size:'none',
        alpha:'none',
        linetype:'none',
        fill:'none',
        color:'none',
        shape:'none'
    },
    sec_axis: {
        trans: null,
        name: null,
        breaks: null,
        labels: null,
        guide: null
    },
    dup_axis: {
        trans: null,
        name: null,
        breaks: null,
        labels: null,
        guide: null
    },

    //Facetting

    facet_grid: {
        rows: null,
        cols: null,
        scales: "fixed",
        space: "fixed",
        shrink: true,
        labeller: "label_value",
        as: { table: true },
        switch: null,
        drop: true,
        margins: false,
        facets: null
    },
    facet_wrap: {
        facets:null,
        nrow: null,
        ncol: null,
        scales: "fixed",
        shrink: true,
        labeller: "label_value",
        as: { table: true },
        switch: null,
        drop: true,
        dir: "h",
        strip: { position: "top" }
    },
    vars: {},

    //Labels

    labeller: {
        rows: null, //.rows
        cols: null, //.cols
        keep_as_numeric: null, //keep.as.numeric
        multi_line: true, //.multi_line
        default: 'label_value' //.default
    },
    label_value: {
        labels: null,
        multi_line: true
    },
    label_both: {
        labels: null,
        multi_line: true,
        sep: ": "
    },
    label_context: {
        labels: null,
        multi_line: true,
        sep: ": "
    },
    label_parsed: {
        labels: null,
        multi_line: true
    },
    label_wrap_gen: {
        width: 25,
        multi_line: true
    },
    label_bquote: {
        rows: null,
        cols: null,
        default: null
    },

    //coordinates

    coord_cartesian: {
        xlim: null,
        ylim: null,
        expand: true,
        default: false,
        clip: "on"
    },
    coord_fixed: {
        ratio: 1,
        xlim: null,
        ylim: null,
        expand: true,
        clip: "on"
    },
    coord_flip: {
        xlim: null,
        ylim: null,
        expand: true,
        clip: "on"
    },
    coord_map: {
        projection: "mercator",
        parameters: null,
        orientation: null,
        xlim: null,
        ylim: null,
        clip: "on"
    },
    coord_quickmap: {
        xlim: null,
        ylim: null,
        expand: true,
        clip: "on"
    },
    coord_polar: {
        theta: "x",
        start: 0,
        direction: 1,
        clip: "on"
    },
    coord_trans: {
        x: "identity",
        y: "identity",
        xlim: null,
        ylim: null,
        limx: "DEPRECATED",
        limy: "DEPRECATED",
        clip: "on",
        expand: true
    },

    //themes

    theme: {
        line: null,
        rect: null,
        text: null,
        title: null,
        aspect: { ratio: null },
        axis: {
            title: {
                x: {
                    top: null,
                    bottom: null,
                },
                y: {
                    left: null,
                    right: null,
                }
            },
            text: {
                x: {
                    top: null,
                    bottom: null,
                },
                y: {
                    left: null,
                    right: null,
                }
            },
            ticks: {
                x: {
                    top: null,
                    bottom: null,
                },
                y: {
                    left: null,
                    right: null,
                },
                length: {
                    x: {
                        top: null,
                        bottom: null,
                    },
                    y: {
                        left: null,
                        right: null,
                    }
                },
                color: {
                    x: {
                        top: null,
                        bottom: null,
                    },
                    y: {
                        left: null,
                        right: null,
                    }
                },
                rotate: {
                    x: {
                        top: null,
                        bottom: null,
                    },
                    y: {
                        left: null,
                        right: null,
                    }
                }
            },
            line: {
                x: {
                    top: null,
                    bottom: null,
                },
                y: {
                    left: null,
                    right: null,
                }
            },
        },
        legend: {
            background: null,
            margin: null,
            spacing: {
                x: null,
                y: null,
            },
            key: {
                size: null,
                height: null,
                width: null,
            },
            text: {
                align: null,
            },
            title: {
                align: null,
            },
            position: null,
            direction: null,
            justification: null,
            box: {
                just: null,
                margin: null,
                background: null,
                spacing: null,
            }
        },
        panel: {
            background: null,
            border: null,
            spacing: {
                x: null,
                y: null,
            },
            grid: {
                major: {
                    x: null,
                    y: null,
                },
                minor: {
                    x: null,
                    y: null,
                }
            },
            ontop: null,
        },
        plot: {
            background: null,
            title: null,
            subtitle: null,
            caption: null,
            tag: null,
            margin: null,
        },
        strip: {
            background: {
                x: null,
                y: null,
            },
            stroke: {
                x: null,
                y: null,
            },
            placement: null,
            text: {
                x: null,
                y: null,
            },
            switch: {
                pad: {
                    grid: null,
                    wrap: null,
                }
            }
        },
        complete: false,
        validate: true
    },
    theme_grey: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_gray: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_bw: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_linedraw: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_light: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_dark: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_minimal: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_classic: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_void: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_test: {
        base_size: 11,
        base_family: "",
        base_line_size: 11 / 22,
        base_rect_size: 11 / 22
    },
    theme_get: {},
    theme_set: {},
    theme_update: {},
    theme_replace: {},
    margin: {
        t: 0,
        r: 0,
        b: 0,
        l: 0,
        unit: "pt"
    },
    element_blank: {},
    element_rect: {
        fill: null,
        colour: null,
        size: null,
        linetype: null,
        color: null,
        inherit: { blank: false }
    },
    element_line: {
        colour: null,
        size: null,
        linetype: null,
        lineend: null,
        color: null,
        arrow: null,
        inherit: { blank: false }
    },
    element_text: {
        family: null,
        face: null,
        colour: null,
        size: null,
        hjust: null,
        vjust: null,
        angle: null,
        lineheight: null,
        color: null,
        margin: null,
        debug: null,
        inherit: { blank: false }
    },
    rel: { x: null },
}