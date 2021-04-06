/** R Functions for use in ggplot */

H.gg.prototype.seq = function (options={}) {

    let defaults = {from:1, to:1, by:1}
    options = {...defaults, ...options}

    let res = []
    for (let i=options.from;i<options.to;i+=options.by){
        res.push(i)
    }
    return res
};

H.gg.prototype.seq_len = function (options={}) {

    let defaults = {from:1, to:1, out:1}
    options = {...defaults, ...options}

    let res = []

    for (let i=0;i<options.out;i++){
        let inc = (options.to - options.from) / (options.out-1)
        res.push(options.from + (inc*i))
    }

    return res
};