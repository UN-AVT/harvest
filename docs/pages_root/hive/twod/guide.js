class Guide {

  /**
  * Initialize an array with range subset
  * Eg: a 4 object linear subset of [1..9] == [1,3,6,9]
  *
  * @param number Max domain of scale
  * @param array Range of scale
  * @param string Type of scale (optional)
  * @return array subset
  */
  static subset(qty, range, type) {
    if (!type) type = 'linear';
    type = type.charAt(0).toUpperCase() + type.slice(1);
    let s = d3[`scale${type}`]().domain([0,qty-1]).range(range);
    return Array(qty).fill(0).map((d,i) => s(i));
  }

  /**
  *  Create a guide layout
  *
  * @param number The guide height (in objects)
  * @param number The guide width (in objects)
  * @param object The containing frame
  * @param string The string previx
  * @param string The translation
  * @return data object containing all frames
  */
  static format (hQty, wQty, frame, prefix, position) {
    if (position == undefined) position = ['mm']
    let ax = `${prefix}Guide-X`;
    let ay = `${prefix}Guide-Y`;
    let accessors = {[ax]:{field:'x', domain:[0,2], range:'width'},[ay]:{field:'y', domain:[0,2]}};
    let layout = Array(hQty*wQty).fill(0).map((d,i) => {return {h:i%hQty, w:parseInt(i/hQty)}});
    let cfg = {
          data: layout,
          rootFrame:frame,
          splitFieldH:'h',
          splitFieldW:'w',
          prefix:prefix
        }
    let facets = H.dataDiv.facet_grid(cfg);
    let frames = d3.cross(facets.sets.domainH, facets.sets.domainW).map((d, i) =>
      facets.sets.facets[d[0]][d[1]].frame)
    let dataName = `${prefix}guide-data`
    // various positions: top, middle, bottom, left, middle, right, lineTop, lineMIddle, line bottom & area fill
    let positionData = {
      tl:[{x:0, y:2}],
      tm:[{x:1, y:2}],
      tr:[{x:2, y:2}],
      ml:[{x:0, y:1}],
      mm:[{x:1, y:1}],
      mr:[{x:2, y:1}],
      bl:[{x:0, y:0}],
      bm:[{x:0, y:1}],
      br:[{x:0, y:2}],
      lt:[{x:0, y:2}, {x:2, y:2}],
      lm:[{x:0, y:1}, {x:2, y:1}],
      lb:[{x:0, y:0}, {x:2, y:0}],
      af:[{x:0, y:2}, {x:2, y:2}]
    }
    let data = position.map(d => {return {name:dataName+`-${d}`, content:positionData[d]}});
    return {cfgs:{frames:facets.cfgs.frames, accessors:accessors, data:data}, sets:{dataBasename:dataName, frames:frames, accessorX:ax, accessorY:ay}};
  }

  /**
  * Create permutations of draw objects
  *
  * @param Object The context from format
  * @param Array Draw objects, Permutations, Prefix String
  * @return draw objects
  */
  static populate (sets, popInfo) {
    let rv = [];
    popInfo.forEach((item, i) => {
      let drawObj = item[0];
      let defCombos = item[1];
      let dataName = item[2]?sets.dataBasename+`-${item[2]}`:sets.dataBasename+'-mm';

      let keys = [];
      let depth;

      if (typeof(defCombos) == 'object'){
        keys = Object.keys(defCombos);
        // sanity check
        let dcCheck = keys.map(k => Array.isArray(defCombos[k])?defCombos[k].length:0);
        dcCheck = dcCheck.filter(d => d>0);
        depth = dcCheck[0] // save this for later
        dcCheck = dcCheck.filter(d => d != dcCheck[0]);
        if (dcCheck.length)
          console.warn('All combination arrays must be of equal length.');
      }
      if (defCombos == 'rootFrame') depth = 1;
      if (defCombos == 'numFrames') depth = sets.frames.length;

      Array(depth).fill(0).map ((d,i) => {

        let curCombo = {data:dataName, x:sets.accessorX, y:sets.accessorY, frame:sets.frames[i]};
        if (defCombos == 'rootFrame') delete curCombo.frame;  // leave rootframe

        keys.forEach((k, j) => { // generate current combo
          let val = Array.isArray(defCombos[k])?defCombos[k][i]:defCombos[k];
          let keySplit = k.split('.');
          let ksLen = keySplit.length-1;
          let newKey = {}
          let ccPtr = newKey;
          keySplit.forEach((ks, i) => { // make the key
            ccPtr[ks] = ksLen-i?{}:val; // assign last one the val
            ccPtr = ccPtr[ks];
          });
          H.Merge.deep(curCombo, newKey);
        });
        rv.push(H.Merge.deep(JSON.parse(JSON.stringify(drawObj)), curCombo));
      });
    });
    return rv;
  }
}
