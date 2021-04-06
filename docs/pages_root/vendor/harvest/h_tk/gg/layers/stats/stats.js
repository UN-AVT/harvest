// Stats
H.gg.prototype.stat = function (options={}) {
    if (options.stat){
        console.log(`running stat ${options.stat}`)
        return this[`stat_${options.stat}`](options)
    } else {
        return options
    }
};

// Compute empirical cumulative distribution
// H.gg.prototype.stat_ecdf = function (options={}) {
//     let defaults = this.defaults.ggplot.stat_ecdf
//     options = {...defaults, ...options}
//     return this;
// };

// Compute normal data ellipses
// H.gg.prototype.stat_ellipse = function (options={}) {
//     let defaults = this.defaults.ggplot.stat_ellipse
//     options = {...defaults, ...options}
//     return this;
// };

// Draw a function as a continuous curve
// H.gg.prototype.stat_function = function (options={}) {
//     let defaults = this.defaults.ggplot.stat_function
//     options = {...defaults, ...options}
//     return this;
// };

// Leave data as is
H.gg.prototype.stat_identity = function (options={}) {
    let defaults = this.defaults.ggplot.stat_identity
    options = {...defaults, ...options}
    return options;
};

// Bin and summarise in 2d (rectangle & hexagons)
// H.gg.prototype.stat_summary_2d = function (options={}) {
//     let defaults = this.defaults.ggplot.stat_summary_2d
//     options = {...defaults, ...options}
//     return this;
// };

// Bin and summarise in 2d (rectangle & hexagons)
// H.gg.prototype.stat_summary_hex = function (options={}) {
//     let defaults = this.defaults.ggplot.stat_summary_hex
//     options = {...defaults, ...options}
//     return this;
// };

// Summarise y values at unique/binned x
H.gg.prototype.stat_summary_bin = function (options={}) {
    let defaults = this.defaults.ggplot.stat_summary_bin
    options = {...defaults, ...options}

       //calculate breaks
       let breaks = this.bins(options)

       // create histogram
       var histogram = d3.histogram()
           .value(d => d[options.aes.x])
           .thresholds(breaks);
   
       let data = []
   
   
       //split data and calculate counts for each, if fill or color have been specified in aes
       if(options.aes.fill || options.aes.color){
   
           let split = options.aes.fill ? options.aes.fill.factor : options.aes.color.factor 
   
           let keys = d3.map(options.data, d => d[split]).keys()
           for (let key of keys){
               let temp = histogram(options.data.filter(d => d[split] == key))
   
               data = data.concat(
                   temp.map(d => {
                       return {
                           x:d.x0,
                           y:d3.mean(d, j => j[options.aes.y]),
                           ymin:d3.min(d, j => j[options.aes.y]),
                           ymax:d3.max(d, j => j[options.aes.y]),
                           [split]:key
                       }
                   })
               )
   
           }
   
       } else {
           data = histogram(options.data).map(d => {
               return {
                   x:d.x0,
                   y:d3.mean(d, j => j[options.aes.y]),
                   ymin:d3.min(d, j => j[options.aes.y]),
                   ymax:d3.max(d, j => j[options.aes.y]),
               }
           })
       }
   
       options.data = data
       options.aes.y = 'y'
   
       return options
};

// Summarise y values at unique/binned x
H.gg.prototype.stat_summary = function (options={}) {
    let defaults = this.defaults.ggplot.stat_summary
    options = {...defaults, ...options}

    let data = []

    //split data and calculate counts for each, if fill or color have been specified in aes
    if(options.aes.fill || options.aes.color){

        let split = options.aes.fill ? options.aes.fill.factor : options.aes.color.factor 

        let keys = d3.map(options.data, d => d[split]).keys()

        for (let key of keys){
            var temp = d3.nest()
                .key(d => d[options.aes.x.factor])
                .entries(options.data.filter(d => d[split] == key));
    
            data = data.concat(
                temp.map(d => {
                    return {
                        [options.aes.x.factor]:d.key,
                        y:d3.mean(d.values, j => j[options.aes.y]),
                        ymin:d3.min(d.values, j => j[options.aes.y]),
                        ymax:d3.max(d.values, j => j[options.aes.y]),
                        [split]:key
                    }
                })
            )
        }

    } else {
        data = d3.nest()
            .key(d => d[options.aes.x.factor])
            .entries(options.data)
            .map(d => {
                return {
                    [options.aes.x.factor]:d.key,
                    y:d3.mean(d.values, j => j[options.aes.y]),
                    ymin:d3.min(d.values, j => j[options.aes.y]),
                    ymax:d3.max(d.values, j => j[options.aes.y]),                }
            })
    }

    options.aes.y = 'y'
    options.data = data

    return options
};

// Remove duplicates
H.gg.prototype.stat_unique = function (options={}) {
    let defaults = this.defaults.ggplot.stat_unique
    options = {...defaults, ...options}

    let data = options.data
    let x = options.aes.x
    let y = options.aes.y

    options.data = data.filter(j => j[x] != d[x] && j[y] != d[y])

    return options;
};

// Extract coordinates from 'sf' objects
// H.gg.prototype.stat_sf_coordinates = function (options={}) {
//     let defaults = this.defaults.ggplot.stat_sf_coordinates
//     options = {...defaults, ...options}
//     return this;
// };

// Control aesthetic evaluation
// H.gg.prototype.after_stat = function (options={}) {
//     let defaults = this.defaults.ggplot.after_stat
//     options = {...defaults, ...options}
//     return this;
// };

// Control aesthetic evaluation
// H.gg.prototype.after_scale = function (options={}) {
//     let defaults = this.defaults.ggplot.after_scale
//     options = {...defaults, ...options}
//     return this;
// };

// Control aesthetic evaluation
// H.gg.prototype.stage = function (options={}) {
//     let defaults = this.defaults.ggplot.stage
//     options = {...defaults, ...options}
//     return this;
// };

// A box and whiskers plot (in the style of Tukey)
H.gg.prototype.stat_boxplot = function(options={}){

    let data = options.data
    let x = options.aes.x.factor
    let y = options.aes.y

    let categories = d3.map(data, d => d[x]).keys()
    let res = []
    for (let cat of categories){
        let filtered = data.filter(d => d[x] == cat)
        if (filtered.length > 0){
            if (filtered[0].hasOwnProperty('IQR')) filtered = filtered.filter(d => d.IQR == 'False')
            filtered = H.Descriptive.min(filtered, y)
            filtered = H.Descriptive.max(filtered, y)
            filtered = H.Descriptive.quantile(filtered, y)
            res.push({
                [x]:filtered[0][x], 
                min:filtered[0].MIN, 
                max:filtered[0].MAX, 
                lower:filtered[0].QUANTILE[0], 
                middle:filtered[0].QUANTILE[1], 
                upper:filtered[0].QUANTILE[2],
                notchLower:filtered[0].QUANTILE[1],
                notchUpper:filtered[0].QUANTILE[1],

            })
        }

    }

    options.data = res

    return options
}

// Contours of a 2D density estimate
H.gg.prototype.stat_density_2d = function (options={}) {

    let x_range = d3.max(options.data, d => d[options.aes.x]) - d3.min(options.data, d => d[options.aes.x])
    let y_range = d3.max(options.data, d => d[options.aes.y]) - d3.min(options.data, d => d[options.aes.y])

    let contours = d3.contourDensity()
    .x(d => d[options.aes.x])
    .y(d => d[options.aes.y])
    .size([100,100])
    .bandwidth(30)
    .thresholds(30)
    (options.data)

    options.data = contours.map(d => {return {val:d.value, coords:d.coordinates[0][0]}}).map((d,i) => d.coords.map(j =>{
        return {
            x:j[0],
            y:j[1],
            i:i,
            val:d.val
        }
    })).flat()

    return options

};

// Smoothed density estimates
H.gg.prototype.stat_density = function (options={}) {
    //ref: https://observablehq.com/@d3/kernel-density-estimation

    let defaults = this.defaults.ggplot.stat_density
    options = {...defaults, ...options}

    let breaks = this.bins(options)

    function kde(kernel, thresholds, data) {
        return thresholds.map(t => [t, d3.mean(data, d => kernel(t - d))]);
    }

    function epanechnikov(bandwidth) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }

    let data = []

    if(options.aes.color){
        let keys = d3.map(options.data, d => d[options.aes.color.factor]).keys()
        for (let key of keys){
            let filtered = options.data.filter(d => d[options.aes.color.factor] == key)
            let groupData = kde(epanechnikov(options.adjust), breaks, filtered.map(d => d[options.aes.x]))

            groupData  = groupData.map((d,i) => {
                return {
                    x: d[0],
                    y: d[1],
                    [options.aes.color.factor]: key
                }
            })

            data = data.concat(groupData)
        }
    } else {
        data = kde(epanechnikov(options.adjust), breaks, options.data.map(d => d[options.aes.x]))

        data  = data.map((d,i) => {
            return {
                x: d[0],
                y: d[1],
            }
        })
    }

    options.data = data
    
    return options;
};

// Count overlapping points
H.gg.prototype.stat_sum = function (options={}) {

    let data = options.data
    let x = options.aes.x.factor ? options.aes.x.factor : options.aes.x
    let y = options.aes.y

    data.map(d => {
        d.COUNT = data.filter(j => j[x] == d[x] && j[y] == d[y]).length
    })

    return options;
};

// 2D contours of a 3D surface
// H.gg.prototype.stat_contour_filled = function (n) {
//     this.amount += n;
//     return this;
// };


// 2D contours of a 3D surface
// H.gg.prototype.stat_contour = function (n) {
//     this.amount += n;
//     return this;
// };

// Heatmap of 2d bin counts
H.gg.prototype.stat_bin_2d = function (options={}) {


    d3.rectbin = function() {
        var dx = 0.1,
            dy = 0.1, 
            x = rectbinX,
            y = rectbinY;
    
        function rectbin(points) {
        var binsById = {};
        var xExtent = d3.extent(points, function(d, i){ return x.call(rectbin, d, i) ;});
        var yExtent = d3.extent(points, function(d, i){ return y.call(rectbin, d, i) ;});
    
        d3.range(yExtent[0], yExtent[1] + dx, dy).forEach(function(Y){
            d3.range(xExtent[0], xExtent[1] + dx, dx).forEach(function(X){
            var py = Y / dy; 
            var pj = trunc(py);
            var px = X / dx;
            var pi = trunc(px);
            var id = pi + '-' + pj;
            var bin = binsById[id] = [];
            bin.i = pi;
            bin.j = pj;
            bin.x = pi * dx;
            bin.y = pj * dy;
            });
        });
        points.forEach(function(point, i) {
            var py = y.call(rectbin, point, i) / dy;
            var pj = trunc(py);
            var px = x.call(rectbin, point, i) / dx;
            var pi = trunc(px);
    
            var id = pi + '-' + pj;
            var bin = binsById[id];
            bin.push(point);
        });
        return d3.values(binsById);
        }
    
        rectbin.x = function(_) {
        if (!arguments.length) return x;
        x = _;
        return rectbin;
        };
    
        rectbin.y = function(_) {
        if (!arguments.length) return y;
        y = _;
        return rectbin;
        };
    
        rectbin.dx = function(_) {
        if (!arguments.length) return dx;
        dx = _;
        return rectbin;
        };
    
        rectbin.dy = function(_) {
        if (!arguments.length) return dy;
        dy = _;
        return rectbin;
        };
    
        return rectbin;
    };
    
    var rectbinX = function(d) { return d[0]; },
        rectbinY = function(d) { return d[1]; };
      
      
    function trunc(x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    }

    ////////////////////////////////////
    let defaults = this.defaults.ggplot.stat_bin_2d
    options = {...defaults, ...options}
    
    let x_size = (d3.max(options.data, d => d[options.aes.x]) - d3.min(options.data, d => d[options.aes.x])) / options.bins
    let y_size = (d3.max(options.data, d => d[options.aes.y]) - d3.min(options.data, d => d[options.aes.y])) / options.bins
    
    var rectbinData = d3.rectbin()
        .dx(x_size)
        .dy(y_size)
        (options.data.map(d => [d[options.aes.x], d[options.aes.y]]));

    rectbinData = rectbinData.map(d => {
        return {
            x:d.x,
            y:d.y+y_size,
            w:x_size,
            h:y_size,
            count:d.length
        }
    })

    if (options.drop === true) rectbinData = rectbinData.filter(d => d.count > 0)

    options.data = rectbinData
    options.aes = {x:'x', y:'y', w:'w', h:'h', fill:'count'}

    return options

};

// Bar charts
H.gg.prototype.stat_count = function (options={}) {

    let defaults = this.defaults.ggplot.stat_count
    options = {...defaults, ...options}

    let data = []

    //split data and calculate counts for each, if fill or color have been specified in aes
    if(options.aes.fill || options.aes.color){

        let split = options.aes.fill ? options.aes.fill.factor : options.aes.color.factor 

        let keys = d3.map(options.data, d => d[split]).keys()

        for (let key of keys){
            var temp = d3.nest()
                .key(d => d[options.aes.x.factor])
                .entries(options.data.filter(d => d[split] == key));
    
            data = data.concat(
                temp.map(d => {
                    return {
                        [options.aes.x.factor]:d.key,
                        COUNT:d.values.length,
                        [split]:key
                    }
                })
            )
        }

    } else {
        data = d3.nest()
            .key(d => d[options.aes.x.factor])
            .entries(options.data)
            .map(d => {
                return {
                    [options.aes.x.factor]:d.key,
                    COUNT:d.values.length
                }
            })
    }

    options.aes.y = 'COUNT'
    options.data = data

    return options
};

// Hexagonal heatmap of 2d bin counts
// H.gg.prototype.stat_bin_hex = function (n) {
//     this.amount += n;
//     return this;
// };

// Visualise sf objects
// H.gg.prototype.stat_sf = function (n) {
//     this.n = n;
//     return this;
// };

// Histograms and frequency polygons
H.gg.prototype.stat_bin = function (options={}) {

    //calculate breaks
    let breaks = this.bins(options)
    
    let data = []

    let histogram = d3.histogram()
        .value(d => d[options.aes.x])
        .domain(d3.extent(breaks))
        .thresholds(breaks);

    //split data and calculate counts for each, if fill or color have been specified in aes
    if(options.aes.fill || options.aes.color){

        let split = options.aes.fill ? options.aes.fill.factor : options.aes.color.factor 
        let keys = d3.map(options.data, d => d[split]).keys()
        for (let key of keys){
            
            let temp = histogram(options.data.filter(d => d[split] == key)).map(d => {
                return {
                    x:d.x0,
                    y:d.length,
                    [split]:key
                }
            })
            data = data.concat(temp)
        }

    } else {

        data = histogram(options.data).map(d => {
            return {
                x:d.x0,
                y:d.length,
            }
        })
    }
    
    options.data = data
    options.aes.x = 'x', 
    options.aes.y = 'y'

    return options
};

// Smoothed conditional means
H.gg.prototype.stat_smooth = function (options={}) {
    let defaults = this.defaults.ggplot.stat_smooth
    options = {...defaults, ...options}

    if (options.method == 'lm'){
        let res = H.Regression.linear(options.data, options.aes.x, options.aes.y)
        let x_domain = d3.extent(options.data, d => d[options.aes.x])
        options.data = [
            {x:x_domain[0], y:res.b},
            {x:x_domain[1], y:res.a*x_domain[1]+res.b}
        ]
    
    } else {
        let res = H.Regression.loess(options.data, options.aes.x, options.aes.y, options.span)
        options.data = res.map(d => {
            return {x:d[0], y:d[1]}
        })
    }

    options.aes.x = 'x'
    options.aes.y = 'y'

    return options

};

// A quantile-quantile plot
// H.gg.prototype.stat_qq = function (options={}) {

//     let defaults = this.defaults.ggplot.stat_qq
//     options = {...defaults, ...options}

// };

// Violin plot
H.gg.prototype.stat_ydensity = function (options={}) {

    let break_options = JSON.parse(JSON.stringify(options))
    break_options.aes.x = break_options.aes.y

    let breaks = this.bins(break_options)

    let histogram = d3.histogram()
        .value(d => d[options.aes.y])
        .domain(d3.extent(breaks))
        .thresholds(breaks);

    // Compute the binning for each group of the dataset
    var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
        .key(k => k[options.aes.x.factor])
        .rollup(d => histogram(d))
        .entries(options.data)

    // assemble needed values
    let adata = sumstat.map(d => {
        let arr = []
        d.value.forEach((item, i) => {
            arr.push({[options.aes.x.factor]:d.key, [options.aes.y]:item.x0, len:item.length})
        });
        return arr;
    }).flat();

    let finalData = [];
    let finalExtent = [];
    let adataByKey = d3.nest().key(k => k[options.aes.x.factor]).object(adata);
  
    Object.keys(adataByKey).forEach((item, i) => {
      let meta = adataByKey[item].map((d,i) => {  // get dereference of first and last data objs
        if (d.len>0) return i;
        return -1;
      }).filter(d => d>-1);
  
      let filtered = adataByKey[item].filter((d,i) => {
        return (i >= meta[0] && i <= meta[meta.length-1]);
      });
  
      finalData.push(filtered);
      finalExtent.push(d3.extent(adataByKey[item], d=>d.len));
    });

    options.data = finalData

    return options
};


// helpers
H.gg.prototype.stat_outliers = function(options={}){

    let data = options.data
    let x = options.aes.x.factor
    let y = options.aes.y

    let categories = d3.map(data, d => d[x]).keys()
    let res = []
    for (let cat of categories){
        let filtered = data.filter(d => d[x] == cat)
        filtered = H.Outlier.iqr(filtered, y)
        res = res.concat(filtered)
    }
    return res
}

H.gg.prototype.bins = function (options={}) {

    let defaults = this.defaults.ggplot.stat_bin
    options = {...defaults, ...options}

    let data = options.data
    let bins = options.bins

    //bin_breaks_bins
    let x_range = d3.extent(data, d => +d[options.aes.x])
    let width, boundary=null, center=null, shift, origin, max_x, breaks;

    if (x_range.length != 2) console.log("`x_range` must have two elements")

    if (options.bins < 1) {
        console.log("Need at least one bin.")
    } else if (x_range[1] - x_range[0] < 0.1) {
        width = 0.1
    } else if (bins == 1) {
        width = x_range[1] - x_range[0]
        boundary = x_range[0]
    } else {
        width = (x_range[1] - x_range[0]) / (bins - 1)
    }

    //bin_break_width
    if (x_range.length != 2) console.log("`x_range` must have two elements")

    if (width <= 0) {
        console.log("`binwidth` must be positive")
    }
  
    if (boundary != null && center != null) {
        console.log("Only one of 'boundary' and 'center' may be specified.")
    } else if (boundary === null) {
        if (center === null) {
            boundary = width / 2
        } else {
            boundary = center - width / 2
        }
    }

    shift = Math.floor((x_range[0] - boundary) / width)
    origin = boundary + shift * width
  
    max_x = x_range[1] + (1 - 1e-08) * width

    if ((max_x - origin) / width > 1e6) {
        console.log("The number of histogram bins must be less than 1,000,000.\nDid you make `binwidth` too small?")
    }

    breaks = []
    for (let i=origin;i<max_x;i+=width){
        breaks.push(i)
    }
    
    if (breaks.length == 1) {
      breaks = [breaks, breaks + width]
    }

    //gglot2_bins
    let diff = []
    for (let i=0;i<breaks.length;i++){
        if (i<breaks.length-2) diff.push(breaks[i+1] - breaks[i])
    }

    let fuzz = 1e-08 * d3.median(diff) // not yet implemented

    return breaks
};