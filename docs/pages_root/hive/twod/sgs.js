"use strict";


// Split graph by category
H.SplitGraph = class {

  /**
  * Split a graph by category (Deprocated: USE FACETS)
  *
  * @param string The
  * @return
  */
  constructor(cfg, data, frame) {
    console.warn('SplitGraph is DEPROCATED:  Use facets.')
    this.cfg = cfg;
    this.vc = cfg.rootCfg;
    this.szScale = .90;
    this.onDict = {};
    // add missing keys/objects
    if(!this.vc.accessors) this.vc.accessors = {};
    if(!this.vc.frames) this.vc.frames = [];
    if(!this.vc.data) this.vc.data = [];
    if(!this.vc.draw) this.vc.draw = [];

    cfg.nest.forEach((d, i) => {
      let on=d.on;
      if (!(on in this.onDict)) // get keys at top level
        this.onDict[on] = Object.keys(d3.nest().key(k => k[on]).object(data)); // H.Collection.unique_by(cfg.data, on)
    });

    this.visObj = new H.Visualization(this.vc);
    this[cfg.nest[0].type] (cfg.nest, data, frame, true);
    return this.visObj;
  }

  /**
  * Util function for mergeDeep
  *
  * @param unknown The structure to test
  * @return boolean
  */
  isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  /**
   * Deep merge two objects.
   * @param Object Target
   * @param Objects Sources
   * @return The merged object
   */
  mergeDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.mergeDeep(target, ...sources);
  }

  /**
  * Run the next line of the config.  Used internally.
  *
  * @param Object The grouping config
  * @param Array The grouping data
  * @param Function The callback function
  * @param Boolean Whether to draw the axis
  */
  callNext(cfg, data, fn, drawAxis) {
    let nextCfg = cfg.slice(1);
    if(nextCfg.length) this[nextCfg[0].type](nextCfg, data, fn, drawAxis);
    else this.cfg.graphHandler(this.visObj, data, fn, this.cfg.graphData);
  }

  /**
  * Split wide (horizontally)
  *
  * @param Object The grouping config
  * @param Array The grouping data
  * @param Function The callback function
  * @param Boolean Whether to draw the axis
  */
  splitw (cfg, data, fn, drawAxis) {
    let c = cfg[0];
    let domain = this.onDict[c.on];
    let f = this.visObj.v.frames.filter(d => d.name==fn)[0];
    let tx = parseFloat(f.translate.x); // only if %
    let ty = parseFloat(f.translate.y);
    let bh = parseFloat(f.bbox.h);
    let bw = parseFloat(f.bbox.w);

    let scale = `${fn}-axis-split`;
    this.visObj.v.accessors[scale] = {domain:domain, type:'band', range:"width"}; // [0,bw]

    let font={family:'Roboto', size:'9', weight:400, style:'normal'}
    let axisOpts = c.axis?c.axis:{};
    let axisDefs = {name:'axis', padding:8, frame:fn, scale:scale, orientation:'bottom', renderopts:"norotate nomirror", ticks:{font:font, rotate:0, padding:8, textWrap:'auto'}};
    let a = this.mergeDeep(axisDefs, axisOpts);
    if(drawAxis) this.visObj.v.draw.push(a);

    let dl = domain.length;
    let section = bw/dl;
    let tbeg = tx - ((section*(dl-1))/2);
    let tend = tx + ((section*(dl-1))/2);
    let txScale = d3.scaleLinear().domain([0, dl-1]).range([tbeg, tend]);
    domain.forEach((d, i) => {
      let subFn = `${f.name}-${d}`;
      let subTx = txScale(i);
      this.visObj.v.frames.push({
        name:subFn, translate:{x:`${subTx}%`,y:`${ty}%`}, bbox:{h:`${bh*this.szScale}%`, w:`${section*this.szScale}%`}, rotate:0, mirror:false
      });

      let subData = data.filter(e => e[c.on] == d); // split out data
      this.callNext(cfg, subData, subFn, !i);
    });
  }

  /**
  * Split long (vertically)
  *
  * @param Object The grouping config
  * @param Array The grouping data
  * @param Function The callback function
  * @param Boolean Whether to draw the axis
  */
  splitl (cfg, data, fn, drawAxis) {
    let c = cfg[0];
    let domain = this.onDict[c.on];
    let f = this.visObj.v.frames.filter(d => d.name==fn)[0];
    let tx = parseFloat(f.translate.x); // only if %
    let ty = parseFloat(f.translate.y);
    let bh = parseFloat(f.bbox.h);
    let bw = parseFloat(f.bbox.w);

    let scale = `${fn}-axis-split`;
    this.visObj.v.accessors[scale] = {domain:domain, type:'band', range:"-height"}; // [0,bw]

    let font={family:'Roboto', size:'9', weight:400, style:'normal'};
    let axisOpts = c.axis?c.axis:{};
    let axisDefs = {name:'axis', padding:8, frame:fn, scale:scale, orientation:'left', renderopts:"norotate nomirror", ticks:{font:font, rotate:0, padding:8, textWrap:'auto'}};
    let a = this.mergeDeep(axisDefs, axisOpts);
    if (drawAxis) this.visObj.v.draw.push(a);

    let dl = domain.length;
    let section = bh/dl;
    let tbeg = ty - ((section*(dl-1))/2);
    let tend = ty + ((section*(dl-1))/2);
    let tyScale = d3.scaleLinear().domain([0, dl-1]).range([tbeg, tend]);
    domain.forEach((d, i) => {
      let subFn = `${f.name}-${d}`;
      let subTy = tyScale(i);
      this.visObj.v.frames.push({
        name:subFn, translate:{x:`${tx}%`,y:`${subTy}%`}, bbox:{h:`${section*this.szScale}%`, w:`${bw*this.szScale}%`}, rotate:0, mirror:false
      });

      let subData = data.filter(e => e[c.on] == d); // split out data
      this.callNext(cfg, subData, subFn, !i);
    });
  }
}

H.dataDiv = class {

  /**
  * Convert a frame into subframes (facets)
  *
  * @param string New frame name prefix
  * @param object Root frame
  * @param Array Split data for each facet
  * @param string Facet direction 'H'|'W'
  * @param number Normalized scale of each bbox
  * @return
  */
  static getFacets(pre, f, domain, dir, sizer) {
    let tx = f.translate.x;
    let ty = f.translate.y;
    let bh = parseFloat(f.bbox.h);
    let bw = parseFloat(f.bbox.w);
    let txPc = typeof(f.translate.x) == 'string', tyPc = typeof(f.translate.y) == 'string', bhPc = typeof(f.bbox.h) == 'string', bwPc = typeof(f.bbox.w) == 'string'; // if the respective are in percent form
    let clonedRootFrame = JSON.parse(JSON.stringify(f));

    let dl = domain.length;
    let section, tbeg, tend;
    if ((dir=='H' && bhPc) || (dir=='W' && bwPc)) { // if param is in pcent form
      section = (dir=='H'?bh:bw)/domain.length;
      tbeg = (dir=='H'?parseFloat(ty):parseFloat(tx)) - ((section*(dl-1))/2);
      tend = (dir=='H'?parseFloat(ty):parseFloat(tx)) + ((section*(dl-1))/2);
    } else {  // param is not in percent form
      section = (dir=='H'?bh:bw)/domain.length;
      tbeg = -(section*(domain.length-1))/2;
      tend = (section*(domain.length-1))/2;
    }
    let scale = d3.scaleLinear().domain([0,dl-1]).range([tbeg, tend]);
    let frames = domain.map((d,i) => { //return dir=='H'?
        // {name:`${pre}${f.name}-${d}`, translate:{x:`${tx}%`,y:`${scale(i)}%`}, bbox:{h:`${(bh/100)*section*sizer}%`, w:`${bw*sizer}%`}, rotate:0, mirror:false}:
        // {name:`${pre}${f.name}-${d}`, translate:{x:`${scale(i)}%`,y:`${ty}%`}, bbox:{h:`${bh*sizer}%`, w:`${(bw/100)*section*sizer}%`}, rotate:0, mirror:false}

        if (dir=='H'){
          let localbw = bwPc?`${bw*sizer}%`:bw;
          if (bhPc)
            return {...clonedRootFrame, name:`${pre}${f.name}-${d}`, translate:{x:tx,y:`${scale(i)}%`}, bbox:{h:`${(bh/100)*section*sizer}%`, w:localbw}, rotate:0, mirror:false}
          else
            return {...clonedRootFrame, name:`${pre}${f.name}-${d}`, translate:{x:tx,y:scale(i)}, bbox:{h:section, w:localbw}, rotate:0, mirror:false}
        }
        if (dir=='W'){
          let localbh = bhPc?`${bh*sizer}%`:bh;
          if (bwPc) {
            return {...clonedRootFrame, name:`${pre}${f.name}-${d}`, translate:{x:`${scale(i)}%`,y:ty}, bbox:{h:localbh, w:`${(bw/100)*section*sizer}%`}, rotate:0, mirror:false}
          } else {
            return {...clonedRootFrame, name:`${pre}${f.name}-${d}`, translate:{x:scale(i),y:ty}, bbox:{h:localbh, w:section}, rotate:0, mirror:false}
          }
        }
    });

    return frames;
  }

  /**
   * Wrangles facet grids
   *
   * @param {Object} cfg configuration object
   * @param {Object} cfg.data Data object array
   * @param {string} cfg.splitFieldH Field used to split data wide
   * @param {string} cfg.splitFieldW Field used to split data long
   * @param {string} cfg.rootFrame Reference frame for splits
   * @param {string} cfg.prefix Prefix to ensure unique config names
   * @return {Object} An object with cfg fields to add.
   * Note: bbox width & height can be either BOTH be a number or a % formatted string
   */
  static facet_grid (cfg) {
    let szScale = 1; //.90;
    let pre = cfg.prefix=='undefined'?'grid-':cfg.prefix;
    let gridData = d3.nest().key(k => cfg.splitFieldH == undefined?null:k[cfg.splitFieldH])
                            .key(k => cfg.splitFieldW == undefined?null:k[cfg.splitFieldW])
                            .object(cfg.data)
    let domainH = Object.keys(gridData);
    let domainW_ALL = [];
    domainH.forEach((d, i) => domainW_ALL = [...domainW_ALL, ...Object.keys(gridData[d])]);
    let domainW = [... new Set(domainW_ALL)];

    // add missing keys/objects
    let cfgFrames = [];
    let cfgData = [];

    let pcntMath = true;
    let pcntTx = 0, numTx = 0, pcntTy = 0, numTy = 0;
    if (typeof(cfg.rootFrame.bbox.w) == 'number' || typeof(cfg.rootFrame.bbox.h) == 'number') {
      pcntMath = false;

      let tr = cfg.rootFrame.translate;
      if (typeof(tr.x)=='number') numTx = tr.x;
      else pcntTx = parseFloat(tr.x);
      if (typeof(tr.y)=='number') numTy = tr.y;
      else pcntTy = parseFloat(tr.y);
      cfg.rootFrame = JSON.parse(JSON.stringify(cfg.rootFrame));
      cfg.rootFrame.translate = {x:0,y:0}; // take off the percent. save for later
    }

    let gridH = {};
    let fH = this.getFacets(pre, cfg.rootFrame, domainH, 'H', szScale);

    domainH.forEach((h, i) => {
      let gridW = {};
      let fW = this.getFacets('', fH[i], domainW, 'W', szScale);
      domainW.forEach((w, j) => {
        cfgData.push({name:`${pre}data-${h}-${w}`, content:gridData[h][w]});
        cfgFrames.push(fW[j]);
        gridW[w] = {nameH:h, nameW:w, data:`${pre}data-${h}-${w}`, frame:fW[j].name};
      });
      gridH[h] = gridW;
    });

    if (!pcntMath) { // add the percent or number back on
      cfgFrames = cfgFrames.map(d => {
        let trX = d.translate.x;
        let trY = d.translate.y;
        return {...d, translate:{x:`calc(pcnt(${pcntTx})+px(${numTx + trX}))`, y:`calc(pcnt(${pcntTy})+px(${numTy + trY}))`}}
      })
    }
    return({cfgs:{data:cfgData, frames:cfgFrames}, sets:{facets:gridH, domainH:domainH, domainW:domainW}});
  }

  /**
   * Wrangles a grouped graph
   *
   * @param {Object} cfg.data Data object array
   * @param {string} cfg.splitField Field used to split data
   * @param {string} cfg.rootFrame Reference frame for splits  Requirement: SPECIFIED IN % ONLY!
   * @param {string} cfg.visItemWidth Relative width of a vis item to bbox.  Eg: A single bar could be '2%' of a bbox.
   * @param {string} cfg.prefix Prefix to ensure unique config names
   * @return {Object} An object with cfg fields to add.
   */
  static group (cfg) {
    let keys = H.Collection.unique_by(cfg.data, cfg.splitField)
    let isVert = cfg.rootFrame.rotate%180 == 0; // orientation
    let pre = cfg.prefix==undefined?'grouped-frame-':cfg.prefix;

    let dataObjs = keys.map(k => {
      let content = H.Filter.where(cfg.data, {[cfg.splitField]: [k]});
      return {name:pre+k, content:content};
    })

    let viw = parseFloat(cfg.visItemWidth);
    let f = cfg.rootFrame;
    let tx = parseFloat(f.translate.x);
    let ty = parseFloat(f.translate.y);
    let bh = parseFloat(f.bbox.h);
    let bw = parseFloat(f.bbox.w);
    let dl = dataObjs.length;

    let frames;
    if (isVert) {
      let section = viw;
      let tbeg = tx - ((section*(dl-1))/2);
      let tend = tx + ((section*(dl-1))/2);
      let scale = d3.scaleLinear().domain([0, dl-1]).range([tbeg, tend]);
      frames = dataObjs.map((item, i) => {
        let frame = JSON.parse(JSON.stringify(cfg.rootFrame)); // poor mans deep clone
        frame.name = `${item.name}`;
        frame.translate.x = `${scale(i)}%`;
        return frame;
      });
    } else {
      let section = viw;
      let tbeg = ty - ((section*(dl-1))/2);
      let tend = ty + ((section*(dl-1))/2);
      let scale = d3.scaleLinear().domain([0, dl-1]).range([tbeg, tend]);
      frames = dataObjs.map((item, i) => {
        let frame = JSON.parse(JSON.stringify(cfg.rootFrame)); // poor mans deep clone
        frame.name = `${item.name}`;
        frame.translate.y = `${scale(i)}%`;
        return frame;
      });
    }

    let rv = {cfgs:{data:dataObjs, frames:frames}, sets:{datas:dataObjs.map(d => d.name), frames:frames.map(d => d.name)}};

    return rv;
  }

  // DEPROCATED in favor of D3 stacker
  // /**
  //  * Wrangles a stacked graph
  //  * Augments existing data with topline and bottomline params
  //  *
  //  * @param {Object} cfg Stack configuration object
  //  * @param {Object} cfg.data Data object array
  //  * @param {string} cfg.splitField Field used to split data
  //  * @param {string} cfg.stackField Field to stack on
  //  * @param {string} cfg.stackScaleType Stack field scale type
  //  * @param {string,Array[2]} cfg.stackScaleRange Stack field range passed to accessor
  //  * @param {string} cfg.prefix Prefix to ensure unique config names
  //  * @param {number} cfg.rangeMax Max Y range. If unset, will return the calculated max.
  //  * @param {boolean} cfg.rangeMaxPositive If the max Y range is positive.
  //  * @return {Object} An object with cfg fields to add.
  //  */
  // static stack (cfg) {
  //
  //   let on = cfg.splitField;
  //   let stackField = cfg.stackField;
  //   let pre = cfg.prefix==undefined?'':cfg.prefix;
  //   let domain = H.Collection.unique_by(cfg.data, on)
  //
  //   let byValue = domain.map(dom => {
  //     let d = H.Filter.where(cfg.data, {[on]: [dom]});
  //     return {name:pre+dom, content:d};
  //   })
  //
  //   let rmp = cfg.rangeMaxPositive?cfg.rangeMaxPositive:true;
  //   let defaultRangeMax = 0;
  //   let rangeMaxArr = new Array(domain.length).fill(0);;
  //   // augment dataset
  //   byValue.forEach((d, i) => {
  //     d.content = d.content.map((e, j) => {
  //       if (rmp){
  //         if (+e[stackField] > rangeMaxArr[i]) rangeMaxArr[i] = +e[stackField];
  //       } else {
  //         if (+e[stackField] < rangeMaxArr[i]) rangeMaxArr[i] = +e[stackField];
  //       }
  //       if (i == 0)
  //         return {...e, [pre+'topline']:e[stackField], [pre+'baseline']:0}
  //       else
  //         return {...e, [pre+'topline']:+(+e[stackField]), [pre+'baseline']:(+byValue[i-1].content[j][pre+'topline'])+(+byValue[i-1].content[j][pre+'baseline'])}
  //     });
  //   });
  //
  //   if (isNaN(parseFloat(cfg.rangeMax)))
  //     cfg.rangeMax = rangeMaxArr.reduce( (sum, current) => sum + current);
  //
  //   // make accessors
  //   let ac = {};
  //   let acSet = {};
  //   ['topline', 'baseline'].forEach(d => {
  //     ac[pre+d] = {domain:[0, cfg.rangeMax], type:cfg.stackScaleType, range:cfg.stackScaleRange};
  //     acSet[d] = pre+d;
  //    });
  //
  //   let rv = {cfgs:{data:byValue, accessors:ac}, sets:{datas:domain.map(d=> pre+d), accessors:acSet}};
  //
  //   return rv;
  // }
}

/**
* Convert long data to wide data
*
* @param Object cfg.data Data object array
* @param Object cfg.splitField
* @param Object cfg.sumField
* @param Object cfg.wideField
* @return
*/
H.longToWide = function (cfg) {
  let splitField = cfg.splitField;
  let sumField = cfg.sumField;
  let wideField = cfg.wideField;
  let data = cfg.data;
  let min = 0, max = 0;

  let uniqSF = [...new Set(data.map(d=>d[splitField]))];

  let outData =  d3.nest().key(k => k[wideField]).rollup(d=>{
    let rv = {[wideField]:d[0][wideField]};

    let localMax = 0;
    let localMin = 0;
    uniqSF.forEach(e=> {
        let sum = d3.sum(d.filter(f=>f[splitField]==e), d=>d[sumField])
        rv[e] = sum || 0
        if (rv[e]>0) localMax += rv[e];
        if (rv[e]<0) localMin += rv[e];
    })

    if (localMax > max) max = localMax;
    if (localMin < min) min = localMin;

    // adds missing groups
    rv.data = uniqSF.map(e => {
      let fRv = d.filter(f => f[splitField]==e);
      return fRv.length==0?{}:fRv[0];
    })

    return rv
    }).entries(data).map(d=>d.value);

  return {data:outData, uniqSplitVals:uniqSF, extent:[min, max]};
}

/**
* Convert wide data to long
*
* @param Object cfg.data Data object array
* @param Object cfg.extent Data extent
* @param Object cfg.stackScaleType Scale type
* @param Object cfg.stackScaleRange Scale range
* @param string cfg.uniqSplitVals Fields used to split data

* @return Long Formatted data
*/
H.formatD3StackToLong = function (cfg) {
  let pfx = cfg.prefix || 'stack-'
  let acTopLine = pfx + 'topline'
  let acBotLine = pfx + 'baseline'
  let acSet = [acTopLine, acBotLine]

  function posOnly(d, key) {
    let val = d[key]
    return val>=0?val:0;
  }

  function negOnly(d, key) {
    let val = d[key]
    return val<0?val:0;
  }

  let stackData = cfg.call.keys(cfg.uniqSplitVals).value(posOnly)(cfg.data);
  let stackDataN = cfg.call.keys(cfg.uniqSplitVals).value(negOnly)(cfg.data);
  // Merge
  stackData.forEach((d, i) => {
    d.forEach((e, j) => {
      if (e[0] == e[1]) d[j] = stackDataN[i][j];
    });
  });

  let datas = {}
  let dKeys = [];
  stackData.forEach((item, i) => {
    dKeys.push(pfx+item.key);
    datas[pfx+item.key] = item.map(d=>{
      if (!d.data.data[i])
        console.log('poop');
      return{...d.data.data[i], [acTopLine]:d[1], [acBotLine]: d[0]}})
  });

  let cfgData = dKeys.map(d => {return{name:d, content:datas[d]}})

  let cfgAc = {};
  [pfx + 'topline', pfx + 'baseline'].forEach(d => {
    cfgAc[d] = {domain:cfg.extent, type:cfg.stackScaleType, range:cfg.stackScaleRange};
  });

  return {cfgs:{data:cfgData, accessors:cfgAc}, sets:{accessors:{topline:acTopLine, baseline:acBotLine}, datas:dKeys}}
}
