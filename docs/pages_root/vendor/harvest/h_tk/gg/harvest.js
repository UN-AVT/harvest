// Copy of Harvest tools used in ggplot2
"use strict";

// HARVEST ROOT
var H = H || {};

H.Array = {}

H.Array.unique = function (arr, compare) {
    const filter = H.Array.filter;
    const isEqual = (a, b) => { return a === b; };
    compare = compare || isEqual;
    return filter(arr, function (item, i, arr) {
        var n = arr.length;
        while (++i < n) {
            if (compare(item, arr[i])) {
                return false;
            }
        }
        return true;
    });
};

H.Array.filter = function (arr, callback, thisObj) {
    const makeIterator = H.Func.make_iterator;

    callback = makeIterator(callback, thisObj);
    var results = [];
    if (arr == null) {
        return results;
    }

    var i = -1,
        len = arr.length,
        value;
    while (++i < len) {
        value = arr[i];
        if (callback(value, i, arr)) {
            results.push(value);
        }
    }

    return results;
};

H.Collection = {}

H.Collection.pluck = function (collection, column) {
    let result = collection.map(function (row) {
        return row[column];
    });
    return result;
};

H.Collection.unique_by = function (arr, mapper) {
    const pluck = H.Collection.pluck;
    const unique = H.Array.unique;
    return unique(pluck(arr, mapper));
}

H.Obj = {}

H.Obj.merge = function (source, target) {
    let result = Object.assign({}, target, source);
    return result;
};

H.Clone = function () {

    /**
     * Deep clone of original collection
     *
     * @param {*} collection
     * @returns collection
     */
    var deep = function (collection, opts) {

        // adapted from https://github.com/davidmarkclements/rfdc
        opts = opts || {}

        if (opts.circles) return rfdcCircles(collection, opts)
        return opts.proto ? cloneProto(collection) : clone(collection)

        function cloneArray(a, fn) {
            var keys = Object.keys(a)
            var a2 = new Array(keys.length)
            for (var i = 0; i < keys.length; i++) {
                var k = keys[i]
                var cur = a[k]
                if (typeof cur !== 'object' || cur === null) {
                    a2[k] = cur
                } else if (cur instanceof Date) {
                    a2[k] = new Date(cur)
                } else {
                    a2[k] = fn(cur)
                }
            }
            return a2
        }

        function clone(o) {
            if (typeof o !== 'object' || o === null) return o
            if (o instanceof Date) return new Date(o)
            if (Array.isArray(o)) return cloneArray(o, clone)
            var o2 = {}
            for (var k in o) {
                if (Object.hasOwnProperty.call(o, k) === false) continue
                var cur = o[k]
                if (typeof cur !== 'object' || cur === null) {
                    o2[k] = cur
                } else if (cur instanceof Date) {
                    o2[k] = new Date(cur)
                } else {
                    o2[k] = clone(cur)
                }
            }
            return o2
        }

        function cloneProto(o) {
            if (typeof o !== 'object' || o === null) return o
            if (o instanceof Date) return new Date(o)
            if (Array.isArray(o)) return cloneArray(o, cloneProto)
            var o2 = {}
            for (var k in o) {
                var cur = o[k]
                if (typeof cur !== 'object' || cur === null) {
                    o2[k] = cur
                } else if (cur instanceof Date) {
                    o2[k] = new Date(cur)
                } else {
                    o2[k] = cloneProto(cur)
                }
            }
            return o2
        }

        function rfdcCircles(collection, opts) {
            var refs = []
            var refsNew = []

            return opts.proto ? cloneProto(collection) : clone(collection)

            function cloneArray(a, fn) {
                var keys = Object.keys(a)
                var a2 = new Array(keys.length)
                for (var i = 0; i < keys.length; i++) {
                    var k = keys[i]
                    var cur = a[k]
                    if (typeof cur !== 'object' || cur === null) {
                        a2[k] = cur
                    } else if (cur instanceof Date) {
                        a2[k] = new Date(cur)
                    } else {
                        var index = refs.indexOf(cur)
                        if (index !== -1) {
                            a2[k] = refsNew[index]
                        } else {
                            a2[k] = fn(cur)
                        }
                    }
                }
                return a2
            }

            function clone(o) {
                if (typeof o !== 'object' || o === null) return o
                if (o instanceof Date) return new Date(o)
                if (Array.isArray(o)) return cloneArray(o, clone)
                var o2 = {}
                refs.push(o)
                refsNew.push(o2)
                for (var k in o) {
                    if (Object.hasOwnProperty.call(o, k) === false) continue
                    var cur = o[k]
                    if (typeof cur !== 'object' || cur === null) {
                        o2[k] = cur
                    } else if (cur instanceof Date) {
                        o2[k] = new Date(cur)
                    } else {
                        var i = refs.indexOf(cur)
                        if (i !== -1) {
                            o2[k] = refsNew[i]
                        } else {
                            o2[k] = clone(cur)
                        }
                    }
                }
                refs.pop()
                refsNew.pop()
                return o2
            }

            function cloneProto(o) {
                if (typeof o !== 'object' || o === null) return o
                if (o instanceof Date) return new Date(o)
                if (Array.isArray(o)) return cloneArray(o, cloneProto)
                var o2 = {}
                refs.push(o)
                refsNew.push(o2)
                for (var k in o) {
                    var cur = o[k]
                    if (typeof cur !== 'object' || cur === null) {
                        o2[k] = cur
                    } else if (cur instanceof Date) {
                        o2[k] = new Date(cur)
                    } else {
                        var i = refs.indexOf(cur)
                        if (i !== -1) {
                            o2[k] = refsNew[i]
                        } else {
                            o2[k] = cloneProto(cur)
                        }
                    }
                }
                refs.pop()
                refsNew.pop()
                return o2
            }
        }
    };

    /**
     * Shallow clone of original collection
     *
     * @param {*} collection
     * @returns collection
     */
    var shallow = function (collection) {
        const result = collection;
        return result;
    };

    return {
        deep: deep,
        shallow: shallow
    };

}();

H.Func = {}

H.Func.make_iterator = function (src, thisObj) {
    const identity = H.Func.identity;
    const deepMatches = H.Obj.deep_match;
    const prop = H.Obj.prop;

    if (src == null) {
        return identity;
    }
    switch (typeof src) {
        case "function":
            // function is the first to improve perf (most common case)
            // also avoid using `Function#call` if not needed, which boosts
            // perf a lot in some cases
            return typeof thisObj !== "undefined"
                ? function (val, i, arr) {
                    return src.call(thisObj, val, i, arr);
                }
                : src;
        case "object":
            return function (val) {
                return deepMatches(val, src);
            };
        case "string":
        case "number":
            return prop(src);
    }
};

H.Filter = {}

H.Filter.where = function (collection, filters) {

    return collection.filter(function (row) {
        return Object.entries(filters).every(function ([filterProperty, filterValues]) {

            switch (Object.prototype.toString.call(row[filterProperty])) {

                case '[object Object]':
                    return Object.entries(filterValues).every(function ([extFilterProperty, extFilterValue]) {
                        return new Map(Object.entries(row[filterProperty])).get(extFilterProperty) === extFilterValue;
                    });

                case '[object Array]':
                    return row[filterProperty].some(function (rowValue) {
                        return filterValues.includes(rowValue);
                    });

                default:
                    return filterValues.includes(row[filterProperty]);

            }

        });
    });
}


H.Merge = function () {

    /**
     * Deep merge two collections
     *
     * @param {*} collection
     * @returns collection
     */
    var deep = function (target, source) {

        // edited from https://gist.github.com/ahtcx/0cd94e62691f539160b32ecda18af3d6
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object && target !== undefined && key in target) Object.assign(source[key], H.Merge.deep(target[key], source[key]))
        }
        Object.assign(target || {}, source)
        return target

    };

    /**
     * Shallow merge two collections
     *
     * @param {*} collection
     * @returns collection
     */
    var shallow = function (target, source) {
        return { ...target, ...source };
    };

    return {
        deep: deep,
        shallow: shallow
    };

}();

H.Stats = {}

H.Stats.min = function (arr) {
    var low = arr[0];
    var i = 0;
    while (++i < arr.length)
        if (arr[i] < low)
            low = arr[i];
    return low;
};

H.Stats.max = function (arr) {
    var high = arr[0];
    var i = 0;
    while (++i < arr.length)
        if (arr[i] > high)
            high = arr[i];
    return high;
};

H.Stats.sum = function (arr) {
    var sum = 0;
    var i = arr.length;
    while (--i >= 0)
        sum += arr[i];
    return sum;
};

H.Stats.median = function (arr) {

    const ascNum = H.Stats.asc_num;

    var arrlen = arr.length;
    var _arr = arr.slice().sort(ascNum);
    // check if array is even or odd, then return the appropriate
    return !(arrlen & 1)
        ? (_arr[(arrlen / 2) - 1] + _arr[(arrlen / 2)]) / 2
        : _arr[(arrlen / 2) | 0];
};

H.Stats.clip = function (arg, min, max) {
    return Math.max(min, Math.min(arg, max));
}

H.Stats.quantiles = function (arr, quantilesArray, alphap, betap) {

    const ascNum = H.Stats.asc_num;
    const clip = H.Stats.clip;

    var sortedArray = arr.slice().sort(ascNum);
    var quantileVals = [quantilesArray.length];
    var n = arr.length;
    var i, p, m, aleph, k, gamma;

    if (typeof alphap === 'undefined')
        alphap = 3 / 8;
    if (typeof betap === 'undefined')
        betap = 3 / 8;

    for (i = 0; i < quantilesArray.length; i++) {
        p = quantilesArray[i];
        m = alphap + p * (1 - alphap - betap);
        aleph = n * p + m;
        k = Math.floor(clip(aleph, 1, n - 1));
        gamma = clip(aleph - k, 0, 1);
        quantileVals[i] = (1 - gamma) * sortedArray[k - 1] + gamma * sortedArray[k];
    }

    return quantileVals;
};

H.Stats.quartiles = function (arr) {
    var arrlen = arr.length;
    var _arr = arr.slice().sort(ascNum);
    return [
        _arr[Math.round((arrlen) / 4) - 1],
        _arr[Math.round((arrlen) / 2) - 1],
        _arr[Math.round((arrlen) * 3 / 4) - 1]
    ];
};

H.Descriptive = function () {

    /**
     * Calculate min of collection and add MIN column as property
     * @memberof Descriptive
     *
     * @param {*} collection
     * @param {*} column
     * @returns collection
     */
    var min = function (collection, column) {
        let col = H.Collection.pluck(collection, column);
        // Make sure values are numbers
        let vals = col.map(Number);
        let min = H.Stats.min(vals);

        let result = [];
        let i = 0;
        let len = collection.length;

        for (i; i < len; i++) {
            var merged = H.Obj.merge({ MIN: min }, collection[i]);
            result.push(merged);
        }
        return result;
    };

    /**
     * 
     * @memberof Descriptive
     *
     * @param {*} collection
     * @param {*} column
     * @returns
     */
    var max = function (collection, column) {
        let col = H.Collection.pluck(collection, column);
        // Make sure values are numbers
        let vals = col.map(Number);
        let max = H.Stats.max(vals);

        let result = [];
        let i = 0;
        let len = collection.length;

        for (i; i < len; i++) {
            var merged = H.Obj.merge({ MAX: max }, collection[i]);
            result.push(merged);
        }
        return result;
    };

    /**
     * 
     * @memberof Descriptive
     *
     * @param {*} collection
     * @param {*} column
     * @returns
     */
    var quantile = function (collection, column) {
        let col = H.Collection.pluck(collection, column);
        // Make sure values are numbers
        let vals = col.map(Number);
        let quantiles = H.Stats.quantiles(vals, [0.25, 0.5, 0.75]);
        let result = [];
        let i = 0;
        let len = collection.length;

        for (i; i < len; i++) {
            var merged = H.Obj.merge({ QUANTILE: quantiles }, collection[i]);
            result.push(merged);
        }
        return result;
    };

    /**
     * 
     * @memberof Descriptive
     *
     * @param {*} collection
     * @param {*} column
     * @returns
     */
    var quartile = function (collection, column) {
        let col = H.Collection.pluck(collection, column);
        // Make sure values are numbers
        let vals = col.map(Number);
        let quartiles = H.Stats.quartiles(vals);
        let result = [];
        let i = 0;
        let len = collection.length;

        for (i; i < len; i++) {
            var merged = H.Obj.merge({ QUARTILE: quartiles }, collection[i]);
            result.push(merged);
        }
        return result;
    };

    /**
     * 
     * @memberof Descriptive
     *
     * @param {*} collection
     * @param {*} column
     * @returns
     */
    var total = function (collection, column) {
        let col = H.Collection.pluck(collection, column);
        // Make sure values are numbers
        let vals = col.map(Number);
        let sum = H.Stats.sum(vals);
        let result = [];
        let i = 0;
        let len = collection.length;

        for (i; i < len; i++) {
            var merged = H.Obj.merge({ TOTAL: sum }, collection[i]);
            result.push(merged);
        }
        return result;
    };

    /**
     * 
     * @memberof Descriptive
     *
     * @param {*} collection
     * @param {*} column
     * @returns
     */
    var percentile = function (collection, column) {
        let col = H.Collection.pluck(collection, column);
        // Make sure values are numbers
        let vals = col.map(Number);
        let total = H.Stats.sum(vals);

        let result = [];
        let i = 0;
        const len = collection.length;
        for (i; i < len; i++) {

            let percent = vals[i] / total;
            let insert = { PERCENTILE: percent.toFixed(4) };
            let merged = H.Obj.merge(insert, collection[i]);
            result.push(merged);
        }
        return result;

    };

    return {
        min: min,
        max: max,
        quantile: quantile,
        quartile: quartile,
        total: total,
        percentile: percentile
    };

}();

H.Regression = (function () {
    /**
     * Simple Linear Regression
     * 
     * @memberof Regression
     *
     * @param {*} collection
     * @param {*} x_measure
     * @param {*} y_measure
     * @returns {*} prediction based on values of x and y
     */
    var simple_linear = function (collection, x_measure, y_measure) {
        console.log(
            "Building simple linear regression model...x: " +
            x_measure +
            ", y: " +
            y_measure
        );

        let xcol = H.Collection.pluck(collection, x_measure);
        // Make sure values are numbers
        let x = xcol.map(Number);

        let ycol = H.Collection.pluck(collection, y_measure);
        // Make sure values are numbers
        let y = ycol.map(Number);

        const regression = new ML.SimpleLinearRegression(x, y);
        console.log(regression);
        let result = mergeToCollection(collection, x, regression, "SIMPLE_LINEAR");

        return result;
    };


    // Adapted from science.js by Jason Davies
    // License: https://github.com/jasondavies/science.js/blob/master/LICENSE
    // Source: https://github.com/jasondavies/science.js/blob/master/src/stats/loess.js
    // Adapted from vega-statistics by Jeffrey Heer
    // License: https://github.com/vega/vega/blob/f058b099decad9db78301405dd0d2e9d8ba3d51a/LICENSE
    // Source: https://github.com/vega/vega/blob/f21cb8792b4e0cbe2b1a3fd44b0f5db370dbaadb/packages/vega-statistics/src/regression/loess.js
    var loess = function (data, xf, yf, bandwidth) {

        const median = H.Stats.median;
        const ols = H.Stats.ols;
        const points = H.Stats.points.points;

        const maxiters = 2, epsilon = 1e-12;

        let x = function (d) { return d[xf] };
        let y = function (d) { return d[yf] };

        const [xv, yv, ux, uy] = points(data, x, y, true),
            n = xv.length,
            bw = Math.max(2, ~~(bandwidth * n)), // # nearest neighbors
            yhat = new Float64Array(n),
            residuals = new Float64Array(n),
            robustWeights = new Float64Array(n).fill(1);

        for (let iter = -1; ++iter <= maxiters;) {
            const interval = [0, bw - 1];

            for (let i = 0; i < n; ++i) {
                const dx = xv[i],
                    i0 = interval[0],
                    i1 = interval[1],
                    edge = (dx - xv[i0]) > (xv[i1] - dx) ? i0 : i1;

                let W = 0, X = 0, Y = 0, XY = 0, X2 = 0,
                    denom = 1 / Math.abs(xv[edge] - dx || 1); // Avoid singularity

                for (let k = i0; k <= i1; ++k) {
                    const xk = xv[k],
                        yk = yv[k],
                        w = tricube(Math.abs(dx - xk) * denom) * robustWeights[k],
                        xkw = xk * w;

                    W += w;
                    X += xkw;
                    Y += yk * w;
                    XY += yk * xkw;
                    X2 += xk * xkw;
                }

                // Linear regression fit
                const [a, b] = ols(X / W, Y / W, XY / W, X2 / W);
                yhat[i] = a + b * dx;
                residuals[i] = Math.abs(yv[i] - yhat[i]);

                updateInterval(xv, i + 1, interval);
            }

            if (iter === maxiters) {
                break;
            }

            const medianResidual = median(residuals);
            if (Math.abs(medianResidual) < epsilon) break;

            for (let i = 0, arg, w; i < n; ++i) {
                arg = residuals[i] / (6 * medianResidual);
                // Default to epsilon (rather than zero) for large deviations
                // Keeping weights tiny but non-zero prevents singularites
                robustWeights[i] = (arg >= 1) ? epsilon : ((w = 1 - arg * arg) * w);
            }
        }

        // Weighting kernel for local regression
        function tricube(x) {
            return (x = 1 - x * x * x) * x * x;
        }

        // Advance sliding window interval of nearest neighbors
        function updateInterval(xv, i, interval) {
            let val = xv[i],
                left = interval[0],
                right = interval[1] + 1;

            if (right >= xv.length) return;

            // Step right if distance to new right edge is <= distance to old left edge
            // Step when distance is equal to ensure movement over duplicate x values
            while (i > left && (xv[right] - val) <= (val - xv[left])) {
                interval[0] = ++left;
                interval[1] = right;
                ++right;
            }
        }

        // Generate smoothed output points
        // Average points with repeated x values
        function output(xv, yhat, ux, uy) {
            const n = xv.length, out = [];
            let i = 0, cnt = 0, prev = [], v;

            for (; i < n; ++i) {
                v = xv[i] + ux;
                if (prev[0] === v) {
                    // Average output values via online update
                    prev[1] += (yhat[i] - prev[1]) / (++cnt);
                } else {
                    // Add new output point
                    cnt = 0;
                    prev[1] += uy;
                    prev = [v, yhat[i]];
                    // out.push({ x: prev[0], y: prev[1] });
                    out.push(prev);
                }
            }
            prev[1] += uy;

            return out;
        }

        return output(xv, yhat, ux, uy);

    }

    /**
 *
 *
 * @param {*} date
 * @param {*} key
 * @returns
 */
    function mergeToCollection(collection, x, regression, type) {
        let result = [];
        let i = 0;
        let len = collection.length;
        for (i; i < len; i++) {
            switch (type) {
                case "SIMPLE_LINEAR":
                    var v = regression.predict(x[i]).toFixed(2);
                    var merged = H.Obj.merge({ SIMPLE_LINEAR: v }, collection[i]);
                    result.push(merged);
                    break;
                case "EXPONENTIAL":
                    var v = regression.predict(x[i]).toFixed(2);
                    var merged = H.Obj.merge({ EXPONENTIAL: v }, collection[i]);
                    result.push(merged);
                    break;
                case "POWER":
                    var v = regression.predict(x[i]).toFixed(2);
                    var merged = H.Obj.merge({ POWER: v }, collection[i]);
                    result.push(merged);
                    break;
                case "POLYNOMIAL":
                    var v = regression.predict(x[i]).toFixed(2);
                    var merged = H.Obj.merge({ POLYNOMIAL: v }, collection[i]);
                    result.push(merged);
                    break;
                case "ROBUST_POLYNOMIAL":
                    var v = regression.predict(x[i]).toFixed(2);
                    var merged = H.Obj.merge({ ROBUST_POLYNOMIAL: v }, collection[i]);
                    result.push(merged);
                    break;
                case "LOESS":
                    var v = regression[i].toFixed(2);
                    var merged = H.Obj.merge({ LOESS: v }, collection[i]);
                    result.push(merged);
                    break;
                case "THEIL_SEN":
                    var v = regression.predict(x[i]).toFixed(2);
                    var merged = H.Obj.merge({ THEIL_SEN: v }, collection[i]);
                    result.push(merged);
                    break;
                case "DECISION_TREE":
                    var v = regression.predict(x);
                    v[i] = v[i].toFixed(2);
                    var merged = H.Obj.merge({ DECISION_TREE: v[i] }, collection[i]);
                    result.push(merged);
                    break;
                default:
            }
        }

        return result;
    }

    return {
        simple_linear: simple_linear,
        loess: loess
    };
})();



H.Outlier = (function () {

    /**
     * @description Interquartile range
     * https://en.wikipedia.org/wiki/Interquartile_range#Interquartile_range_and_outliers
     * Based on https://github.com/MatthewMueller/outliers
     * @memberof Outlier
     *
     * @param {*} collection
     *
     * @returns collection
     */
    var iqr = function (collection, column, opts) {
        let vals = H.Collection.pluck(collection, column);
        let array = vals.map(Number);
        let arr = array.slice(0).sort((a, b) => a - b);

        let len = arr.length;
        let median = H.Stats.median(arr);

        let q1 = H.Stats.median(arr.slice(0, ~~(len / 2)));
        let q3 = H.Stats.median(arr.slice(Math.ceil(len / 2)));
        let g = 1.5;
        let range = (q3 - q1) * g;

        let outliers = arr.filter(e => Math.abs(e - median) > range);

        let res =
            opts && !!opts.indexes
                ? array
                    .map((e, i) => outliers.indexOf(e) != -1 && i)
                    .filter(e => e !== false)
                : outliers;

        let controller = [];
        let result = [];
        for (var i = 0; i < collection.length; i++) {
            controller[i] = "False";

            for (var j = 0; j < res.length; j++) {
                if (array[i] == res[j]) {
                    controller[i] = "True";
                    j++;
                }
            }
            let merge = H.Obj.merge({ IQR: controller[i] }, collection[i]);
            result.push(merge);
        }
        return result;
    }

    return {
        iqr: iqr
    };
})();


H.Df = (function () {
    ///////////////////////////////////////////////////////////
    ////////////////////////// csv ////////////////////////////
    ///////////////////////////////////////////////////////////

    /**
     * Ingest a comma delimited file as array of objects
     *
     * @param {*} file_path
     * @returns
     */
    var csv_auto_type = function (file_path) {
        let source = d3.csv(file_path, d3.autoType).then(function (data) {
            return data;
        });
        return source;
    };

    /**
     * Ingest a comma delimited file as array of objects
     *
     * @param {*} file_path
     * @returns
     */
    var csv = function (file_path) {
        let source = d3.csv(file_path).then(function (data) {
            return data;
        });
        return source;
    };

    /**
     * Ingest a user defined delimited file as array of objects
     *
     * @param {*} file_path
     * @returns
     */
    var dsv_auto_type = function (file_path, delimiter) {
        let source = d3.dsv(delimiter, file_path, d3.autoType).then(function (data) {
            return data;
        });
        return source;
    };

    /**
     * Ingest a comma delimited file as array of objects
     *
     * @param {*} file_path
     * @returns
     */
    var dsv = function (file_path, delimiter) {
        let source = d3.dsv(delimiter, file_path).then(function (data) {
            return data;
        });
        return source;
    };

    /**
     * Ingest a json file as array of objects
     *
     * @param {*} file_path
     * @returns
     */
    var json = function (file_path) {
        let source = d3.json(file_path).then(function (data) {
            return data;
        });
        return source;
    };

    /**
     * Ingest a tab delimited file as array of objects
     *
     * @param {*} file_path
     * @returns
     */
    var tsv_auto_type = function (file_path) {
        let source = d3.tsv(file_path, d3.autoType).then(function (data) {
            return data;
        });
        return source;
    };

    /**
     * Ingest a tab delimited file as array of objects
     *
     * @param {*} file_path
     * @returns
     */
    var tsv = function (file_path) {
        let source = d3.tsv(file_path).then(function (data) {
            return data;
        });
        return source;
    };

    return {
        csv_auto_type: csv_auto_type,
        csv: csv,
        dsv_auto_type: dsv_auto_type,
        dsv: dsv,
        json: json,
        tsv_auto_type: tsv_auto_type,
        tsv: tsv
    };
})();

H.Stats.determination = function (data, x, y, uY, predict) {
    const visitPoints = H.Stats.points.visit_points;

    let SSE = 0,
        SST = 0;

    visitPoints(data, x, y, (dx, dy) => {
        const sse = dy - predict(dx),
            sst = dy - uY;

        SSE += sse * sse;
        SST += sst * sst;
    });

    return 1 - SSE / SST;
};

H.Stats.ols = function (uX, uY, uXY, uX2) {
    const delta = uX2 - uX * uX,
        slope = Math.abs(delta) < 1e-24 ? 0 : (uXY - uX * uY) / delta,
        intercept = uY - slope * uX;

    return [intercept, slope];
}

H.Stats.points = function () {

    var points = function (data, x, y, sort) {
        data = data.filter(d => {
            let u = x(d), v = y(d);
            return u != null && isFinite(u) && v != null && isFinite(v);
        });

        if (sort) {
            data.sort((a, b) => x(a) - x(b));
        }

        const n = data.length,
            X = new Float64Array(n),
            Y = new Float64Array(n);

        // extract values, calculate means
        let ux = 0, uy = 0, xv, yv, d;
        for (let i = 0; i < n;) {
            d = data[i];
            X[i] = xv = +x(d);
            Y[i] = yv = +y(d);
            ++i;
            ux += (xv - ux) / i;
            uy += (yv - uy) / i;
        }

        // mean center the data
        for (let i = 0; i < n; ++i) {
            X[i] -= ux;
            Y[i] -= uy;
        }

        return [X, Y, ux, uy];
    }


    var visit_points = function (data, x, y, cb) {
        let iterations = 0;

        for (let i = 0, n = data.length; i < n; i++) {
            const d = data[i],
                dx = +x(d),
                dy = +y(d);

            if (dx != null && isFinite(dx) && dy != null && isFinite(dy)) {
                cb(dx, dy, iterations++);
            }
        }
    }

    return {
        points: points,
        visit_points: visit_points
    }

}();


H.Regression.linear = function (data, xf, yf, domain) {

    const determination = H.Stats.determination;
    const ols = H.Stats.ols;
    const visitPoints = H.Stats.points.visit_points;

    let n = 0,
        X = 0, // sum of x
        Y = 0, // sum of y
        XY = 0, // sum of x * y
        X2 = 0, // sum of x * x
        xmin = domain ? +domain[0] : Infinity,
        xmax = domain ? +domain[1] : -Infinity;


    let x = function (d) { return d[xf] }
    let y = function (d) { return d[yf] }

    visitPoints(data, x, y, (dx, dy) => {
        ++n;
        X += (dx - X) / n;
        Y += (dy - Y) / n;
        XY += (dx * dy - XY) / n;
        X2 += (dx * dx - X2) / n;

        if (!domain) {
            if (dx < xmin) xmin = dx;
            if (dx > xmax) xmax = dx;
        }
    });

    const [intercept, slope] = ols(X, Y, XY, X2),
        fn = x => slope * x + intercept,
        out = [[xmin, fn(xmin)], [xmax, fn(xmax)]];

    out.a = slope;
    out.b = intercept;
    out.predict = fn;
    out.rSquared = determination(data, x, y, Y, fn);

    return out;
};

H.Obj.pick = function (obj, var_keys) {
    const slice = H.Array.slice;

    var keys =
        typeof arguments[1] !== "string" ? arguments[1] : slice(arguments, 1),
        out = {},
        i = 0,
        key;
    while ((key = keys[i++])) {
        out[key] = obj[key];
    }
    return out;
};

H.Transforms = function () {

    // http://jonathansoma.com/tutorials/d3/wide-vs-long-data/
    // Long -> COLS: Series, Value
    // Wide -> COLS: Series A, Series B, Series ...
    //         ROWS: Value A,  Value B,  Value ...
    // e.g., spread(key = type, value = count)
    /**
     * Sort a collection from a given reference with set order
     * https://gist.github.com/ecarter/1423674
     *
     * @param {*} collection
     * @param {*} long_column
     * @param {*} key
     * @param {*} value
     * @returns
     */
    var long_to_wide = function (collection, long_column, key, value) {
        console.log('Transforming Long to Wide...');
        let wide = d3
            .nest()
            .key(function (d) {
                return d[long_column];
            }) // sort by key
            .rollup(function (d) {
                // do this to each grouping
                // reduce takes a list and returns one value
                // in this case, the list is all the grouped elements
                // and the final value is an object with keys
                return d.reduce(function (prev, curr) {
                    prev[long_column] = curr[long_column];
                    prev[curr[key]] = curr[value];
                    return prev;
                }, {});
            })
            .entries(collection) // tell it what data to process
            .map(function (d) {
                // pull out only the values
                return d.value;
            });

        return wide;
    };

    /*
      let dimensions = [ 'SERIES_A', 'SERIES_B' ]
      let measures = [ 'VALUE_A','VALUE_B' ]
      let wide_to_long_2 = H.Transforms.wide_to_long( filtered_2, dimensions, measures );
    */
    /**
      * Sort a collection from a given reference with set order
      * https://gist.github.com/ecarter/1423674
      *
      * @param {*} collection
      * @param {*} dimensions
      * @param {*} measures
      * @returns
      */
    var wide_to_long = function (collection, dimensions, measures) {
        console.log('Transforming Wide to Long...');
        let result = [];
        collection.forEach(function (row) {
            let transformers = H.Obj.pick(row, measures);
            let t = 0;
            const tlen = measures.length;
            for (t; t < tlen; t++) {
                let insert = { MEASURE: measures[t], VALUE: transformers[measures[t]] };
                // let merged = H.Obj.merge(insert, keepers);
                let merged = H.Obj.merge(insert, row);
                result.push(merged);
            }
        });
        return result;
    };

    return {
        long_to_wide: long_to_wide,
        wide_to_long: wide_to_long
    };
}();


H.Emitter = function () {

    var PubSub = {};

    var messages = {},
        lastUid = -1;

    function hasKeys(obj) {
        var key;

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Returns a function that throws the passed exception, for use as argument for setTimeout
     * @alias throwException
     * @function
     * @param { Object } ex An Error object
     */
    function throwException(ex) {
        return function reThrowException() {
            throw ex;
        };
    }

    function callSubscriberWithDelayedExceptions(subscriber, message, data) {
        try {
            subscriber(message, data);
        } catch (ex) {
            setTimeout(throwException(ex), 0);
        }
    }

    function callSubscriberWithImmediateExceptions(subscriber, message, data) {
        subscriber(message, data);
    }

    function deliverMessage(originalMessage, matchedMessage, data, immediateExceptions) {
        var subscribers = messages[matchedMessage],
            callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
            s;

        if (!messages.hasOwnProperty(matchedMessage)) {
            return;
        }

        for (s in subscribers) {
            if (subscribers.hasOwnProperty(s)) {
                callSubscriber(subscribers[s], originalMessage, data);
            }
        }
    }

    function createDeliveryFunction(message, data, immediateExceptions) {
        return function deliverNamespaced() {
            var topic = String(message),
                position = topic.lastIndexOf('.');

            // deliver the message as it is now
            deliverMessage(message, message, data, immediateExceptions);

            // trim the hierarchy and deliver message to each level
            while (position !== -1) {
                topic = topic.substr(0, position);
                position = topic.lastIndexOf('.');
                deliverMessage(message, topic, data, immediateExceptions);
            }
        };
    }

    function messageHasSubscribers(message) {
        var topic = String(message),
            found = Boolean(messages.hasOwnProperty(topic) && hasKeys(messages[topic])),
            position = topic.lastIndexOf('.');

        while (!found && position !== -1) {
            topic = topic.substr(0, position);
            position = topic.lastIndexOf('.');
            found = Boolean(messages.hasOwnProperty(topic) && hasKeys(messages[topic]));
        }

        return found;
    }

    function publish(message, data, sync, immediateExceptions) {
        message = (typeof message === 'symbol') ? message.toString() : message;

        var deliver = createDeliveryFunction(message, data, immediateExceptions),
            hasSubscribers = messageHasSubscribers(message);

        if (!hasSubscribers) {
            return false;
        }

        if (sync === true) {
            deliver();
        } else {
            setTimeout(deliver, 0);
        }
        return true;
    }

    /**
     * Publishes the message, passing the data to it's subscribers
     * @function
     * @alias publish
     * @param { String } message The message to publish
     * @param {} data The data to pass to subscribers
     * @return { Boolean }
     */
    PubSub.publish = function (message, data) {
        return publish(message, data, false, PubSub.immediateExceptions);
    };

    /**
     * Publishes the message synchronously, passing the data to it's subscribers
     * @function
     * @alias publishSync
     * @param { String } message The message to publish
     * @param {} data The data to pass to subscribers
     * @return { Boolean }
     */
    PubSub.publishSync = function (message, data) {
        return publish(message, data, true, PubSub.immediateExceptions);
    };

    /**
     * Subscribes the passed function to the passed message. Every returned token is unique and should be stored if you need to unsubscribe
     * @function
     * @alias subscribe
     * @param { String } message The message to subscribe to
     * @param { Function } func The function to call when a new message is published
     * @return { String }
     */
    PubSub.subscribe = function (message, func) {
        if (typeof func !== 'function') {
            return false;
        }

        message = (typeof message === 'symbol') ? message.toString() : message;

        // message is not registered yet
        if (!messages.hasOwnProperty(message)) {
            messages[message] = {};
        }

        // forcing token as String, to allow for future expansions without breaking usage
        // and allow for easy use as key names for the 'messages' object
        var token = 'uid_' + String(++lastUid);
        messages[message][token] = func;

        // return token for unsubscribing
        return token;
    };

    /**
     * Subscribes the passed function to the passed message once
     * @function
     * @alias subscribeOnce
     * @param { String } message The message to subscribe to
     * @param { Function } func The function to call when a new message is published
     * @return { PubSub }
     */
    PubSub.subscribeOnce = function (message, func) {
        var token = PubSub.subscribe(message, function () {
            // before func apply, unsubscribe message
            PubSub.unsubscribe(token);
            func.apply(this, arguments);
        });
        return PubSub;
    };

    /**
     * Clears all subscriptions
     * @function
     * @public
     * @alias clearAllSubscriptions
     */
    PubSub.clearAllSubscriptions = function clearAllSubscriptions() {
        messages = {};
    };

    /**
     * Clear subscriptions by the topic
     * @function
     * @public
     * @alias clearAllSubscriptions
     * @return { int }
     */
    PubSub.clearSubscriptions = function clearSubscriptions(topic) {
        var m;
        for (m in messages) {
            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
                delete messages[m];
            }
        }
    };

    /** 
       Count subscriptions by the topic
     * @function
     * @public
     * @alias countSubscriptions
     * @return { Array }
    */
    PubSub.countSubscriptions = function countSubscriptions(topic) {
        var m;
        var count = 0;
        for (m in messages) {
            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
                count++;
            }
        }
        return count;
    };


    /** 
       Gets subscriptions by the topic
     * @function
     * @public
     * @alias getSubscriptions
    */
    PubSub.getSubscriptions = function getSubscriptions(topic) {
        var m;
        var list = [];
        for (m in messages) {
            if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
                list.push(m);
            }
        }
        return list;
    };

    /**
     * Removes subscriptions
     *
     * - When passed a token, removes a specific subscription.
     *
     * - When passed a function, removes all subscriptions for that function
     *
     * - When passed a topic, removes all subscriptions for that topic (hierarchy)
     * @function
     * @public
     * @alias subscribeOnce
     * @param { String | Function } value A token, function or topic to unsubscribe from
     * @example // Unsubscribing with a token
     * var token = PubSub.subscribe('mytopic', myFunc);
     * PubSub.unsubscribe(token);
     * @example // Unsubscribing with a function
     * PubSub.unsubscribe(myFunc);
     * @example // Unsubscribing from a topic
     * PubSub.unsubscribe('mytopic');
     */
    PubSub.unsubscribe = function (value) {
        var descendantTopicExists = function (topic) {
            var m;
            for (m in messages) {
                if (messages.hasOwnProperty(m) && m.indexOf(topic) === 0) {
                    // a descendant of the topic exists:
                    return true;
                }
            }

            return false;
        },
            isTopic = typeof value === 'string' && (messages.hasOwnProperty(value) || descendantTopicExists(value)),
            isToken = !isTopic && typeof value === 'string',
            isFunction = typeof value === 'function',
            result = false,
            m, message, t;

        if (isTopic) {
            PubSub.clearSubscriptions(value);
            return;
        }

        for (m in messages) {
            if (messages.hasOwnProperty(m)) {
                message = messages[m];

                if (isToken && message[value]) {
                    delete message[value];
                    result = value;
                    // tokens are unique, so we can just stop here
                    break;
                }

                if (isFunction) {
                    for (t in message) {
                        if (message.hasOwnProperty(t) && message[t] === value) {
                            delete message[t];
                            result = true;
                        }
                    }
                }
            }
        }

        return result;
    };

    return {
        PubSub: PubSub
    }
}();
