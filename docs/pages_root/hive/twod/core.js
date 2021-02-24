"use strict";
import './object.js';
import './element.js';
import './frame.js';

H.renderer = {};

// Calculates relative values Eg: percents & pixels for frames
//+ Carlos R. L. Rodrigues
//@ http://jsfromhell.com/classes/math-parser [rev. #3]
H.VisUtil = class {
  constructor(length){
    this.l = length;
    var o = this, p = o.operator = {};
    p["+"] = function(n, m){return n + m;}
    p["-"] = function(n, m){return n - m;}
    p["*"] = function(n, m){return n * m;}
    p["/"] = function(m, n){return n / m;}
    // p["%"] = function(m, n){return n % m;}
    // p["^"] = function(m, n){return Math.pow(n, m);}
    // p["~"] = function(m, n){return Math.sqrt(n, m);}
    o.custom = {}, p.f = function(s, n){
      if(Math[s]) return Math[s](n);
      else if(o.custom[s]) return o.custom[s].apply(o, n);
      else throw new Error("Function \"" + s + "\" not defined.");
    }, o.add = function(n, f){this.custom[n] = f;}

    this.add("pcnt", (v) => {
      return (v/100)*this.l;
    });

    this.add("px", (v) => { // for symmetry
      return v;
    });

  }

  eval(e, ig){
    var v = [], p = [], i, _, a, c = 0, s = 0, x, t = !ig ? e.indexOf("^") : -1, d = null;
    var cp = e, e = e.split(""), n = "0123456789.", o = "+-/*^%~", f = this.operator;
    if(t + 1)
    do{
      for(a = "", _ = t - 1;  _ && o.indexOf(e[_]) < 0; a += e[_], e[_--] = ""); a += "^";
      for(_ = t + 1, i = e.length; _ < i && o.indexOf(e[_]) < 0; a += e[_], e[_++] = "");
      e = e.slice(0, t).concat((this.eval(a, 1) + "").split("")).concat(e.slice(t + 1));
    }
    while(t = cp.indexOf("^", ++t) + 1);
    for(var i = 0, l = e.length; i < l; i++){
      if(o.indexOf(e[i]) > -1)
      e[i] == "-" && (s > 1 || d === null) && ++s, !s && d !== null && (p.push(e[i]), s = 2), "+-".indexOf(e[i]) < (d = null) && (c = 1);
      else if(a = n.indexOf(e[i]) + 1 ? e[i++] : ""){
        while(n.indexOf(e[i]) + 1) a += e[i++];
        v.push(d = (s & 1 ? -1 : 1) * a), c && v.push(f[p.pop()](v.pop(), v.pop())) && (c = 0), --i, s = 0;
      }
    }
    for(var c = v[0], i = 0, l = p.length; l--; c = f[p[i]](c, v[++i]));
    return c;
  }

  parse(e){
    var p = [], f = [], ag, n, c, a, o = this, v = "0123456789.+-*/^%~(, )", y;
    for(var x, i = 0, l = e.length; i < l; i++){
      if(v.indexOf(c = e.charAt(i)) < 0){
        for(a = c; v.indexOf(c = e.charAt(++i)) < 0; a += c); f.push((--i, a));
      }
      else if(!(c == "(" && p.push(i)) && c == ")"){
        if(a = e.slice(0, (n = p.pop()) - (x = v.indexOf(e.charAt(n - 1)) < 0 ? y = (c = f.pop()).length : 0)), x)
        for(var j = (ag = e.slice(n, ++i).split(",")).length; j--; ag[j] = o.eval(ag[j]));
        l = (e = a + (x ? o.operator.f(c, ag) : o.eval(e.slice(n, ++i))) + e.slice(i)).length, i -= i - n + c.length;
      }
    }
    return o.eval(e);
  }
}

H.Draw = class {
  /**
  * Sets up and calls each plugin listed in the draw array.
  *
  * @param object The draw subsection of the config
  * @return none
  */
  draw (cfg) {
    this.renderList = [];
    this.events = [];
    this.pluginState = {curIdx:0, layer:[], svg:null};

    this.resolveCfgDraw(cfg);

    if (this.v.opts.popup.enabled){
      this.popup = new H.popup(this.rendererObj, this.v.element.selector, this.events, this.v.opts.popup);
    }

    cfg.forEach((item, i) => {
      // make group
      let uid = `${this.v.name}-${cfg[i].name}-${i}`; // unique id
      let attr = {id:uid};
      let g = this.createElement(attr, 'g', null);

      // get relative keys
      let frame = cfg[i].frame;
      let relKeys = this.framesList[frame];

      // if norotate and perpendicularly rotated re-reverse h/w (reversed in frame)
      if(cfg[i].renderopts && cfg[i].renderopts.includes('norotate') && relKeys.rotate%180 == 90)
        relKeys = {...relKeys, 'bbox.w':relKeys['bbox.h'], 'bbox.h':relKeys['bbox.w']};

      // generate element and add to group
      // let safeOnes = ['rectangle','tbar', 'line', 'area', 'circle', 'labels', 'axis', 'text', 'legend'];
      // if (! safeOnes.includes(item.name)) return;

      this.pluginState.curIdx = i;
      this.pluginState.layer[i] = {handler:H[item.name], relKeys:relKeys};
      if (!this.pluginState.layer[i].handler) {
        this.warn('No handler for drawable:', item.name);
        return;
      }

      this.pluginState.layer[i].handler.draw(item, g, relKeys, this);

      this.addToRender(frame, g);

    });
    this.render();
  }

  /**
  * Creates an SVG element
  *
  * @param object list of attr-val pairs
  * @param string element type
  * @param element The element (usually a <g>) where the new element is appended
  * @return The child element
  */
  // create HTML element and apply attrs
  createElement(attr, eName, parent) {
    // let child = document.createElement(eName)
    let child = document.createElementNS('http://www.w3.org/2000/svg', eName);
    Object.keys(attr).forEach((item, i) => {
      child.setAttribute(item, attr[item]);
    });
    if (parent)
      parent.appendChild(child);
    return child;
  }

  /**
  * Adds a new frame/group to the render list.
  *
  * @param object The frame the group belongs to
  * @param element The group (w plugin appended children)
  * @return none
  */
  addToRender(frame, g) {
    // if (! (frame in this.renderList)) this.renderList[frame] = [];
    // this.renderList[frame].push(g);
    this.renderList.push({frame:frame, group:g})
  }

  /**
  * For keys w % values, calculate absolute px lengths for the current frame size
  *
  * @param object The keys to convert
  * @param object The plugin config
  * @return An object containing the converted keys
  */
  // resolve relative values (ex: 10%)
  getRelative(keys, cfg) {
    let rv = {}
    keys.forEach((item, i) => {
      let key = item[0];
      let relval = item[1]; // value you are relative to

      rv[key] = this.getCfgValue(key, cfg);

      // handle %
      if (/\d+%/s.test(rv[key])) {
        rv[key] = (parseFloat(rv[key]) / 100) * relval;
      }

      // handle calc()
      if (/calc\(.+\)/g.test(rv[key])) {
        let util = new H.VisUtil(relval);
        rv[key] = util.parse(rv[key].slice(5,-1))
      }

    });
    return rv
  }

  /**
  * Parse the accessor section, resolve the scales with the local frame sizes,
  * and return the set of functions for all plugin config fields requested.
  *
  * @param object The frame relative sizes
  * @param array The list of cfg fields to resolve
  * @param object The plugin cfg
  * @param object The plugin data to calculate the domain (to be deprocated)
  * @return An object containing the accessor functions
  */
  getScaledAccessors(relKeys, complexKeys, cfg, data) {
    let sd = this.scaleDict
    let accessorDict = {};

    complexKeys.forEach((k) => {
      if (! k in cfg) return; // bail if not defined
      let accDes = cfg;
      k.split('.').forEach((param, i) => {
        if (accDes == undefined) return;
        accDes = accDes[param];
      });

      // let accDes = cfg[k];    // accessor designator == scales section key, string, number, function constant, or data col name
      if (typeof accDes == 'string') {
        if (accDes in this.v.accessors) {
          if (! this.v.accessors[accDes].domain) {   // calc extents  TODO should be cached
            let l = data.map(d => parseFloat(d[accDes]));
            l = l.filter(d => !isNaN(d));
            let e = d3.extent(l);
            this.log('Auto range:', e[0], e[1]);
            sd[accDes] = sd[accDes].domain(e);
          }
          // set range
          if (sd[accDes].range) { // some don't have it.
            let range = this.v.accessors[accDes].range // define correct range
            let rBeg = sd[accDes].bandwidth?sd[accDes].bandwidth()/2:0; // if it is a band, offset the axis
            if(Array.isArray(range))
              sd[accDes] = sd[accDes].range(range)
            if(range == "width"){
              rBeg = rBeg<1?rBeg:rBeg/relKeys['bbox.w'];
              sd[accDes] = sd[accDes].range([rBeg * relKeys['bbox.w'], relKeys['bbox.w'] + (relKeys['bbox.w'] * rBeg)])
            }
            if(range == "height"){
              rBeg = rBeg<1?rBeg:-rBeg/relKeys['bbox.h'];
              sd[accDes] = sd[accDes].range([- rBeg * relKeys['bbox.h'], relKeys['bbox.h'] - (relKeys['bbox.h'] * rBeg)])
            }
            if(range == "-height"){
              rBeg = rBeg<1?rBeg:rBeg/relKeys['bbox.h'];
              sd[accDes] = sd[accDes].range([rBeg * relKeys['bbox.h'], - relKeys['bbox.h'] + (relKeys['bbox.h'] * rBeg)])
            }
            if(range == "circleRadians"){
              sd[accDes] = sd[accDes].range([0,Math.PI*2])
            }
          }

          let s = sd[accDes] // ready scale function

          let fieldCfg = this.v.accessors[accDes].field;
          let field = fieldCfg!=undefined?fieldCfg:accDes

          let preF = (d) => d; // ready pre scaler filter
          if ('preFilter' in this.v.accessors[accDes])
            preF = this.v.accessors[accDes].preFilter

          let postF = (d) => d; // ready post scaler filter
          if ('postFilter' in this.v.accessors[accDes])
            postF = (d,i,data) => {return this.v.accessors[accDes].postFilter(d,i,data)}

          accessorDict[k] = (d,i) => {
            if (d == undefined) return s;
            return postF(s(preF(d[field],i)), i, d);
          } // is scaled object accessor
        } else { // is a string of some sort
          if (/^\[[\w-]*\]/g.test(accDes)) {
            accessorDict[k] = d => d[accDes.slice(1,-1)]   // is pre-calc col name
            return
          }
          if (/getGeneratedAccessor\(.+\)/g.test(accDes)) {  // BUG: Having the current function will be a problem on zoom / rotate / etc
            let args = accDes.slice(21,-1).split(',');
            let context = {field:args[1]};
            accessorDict[k] = this.generated.accessors[args[0]].bind(context);   // is pre-calc col name
            return;
          }
          if (/bindAccessor\(.+\)/g.test(accDes)) { // bind accessor to specific domain value
            let args = accDes.slice(13,-1).split(',');
            // find the accessor obj and field
            let accessor = args[0];
            let field = accessor;
            let sao = this.v.accessors[accessor];
            if ('field' in sao) {
              field = sao.field;
            }
            // get the scaler and derive the value
            let sa = this.getScaledAccessors(relKeys, ['sakey'], {['sakey']:accessor}, null)
            let val = sa['sakey']({[field]:args[1]});
            accessorDict[k] = d => val;
            return;
          }
          // if (/pcntBBox\(.+\)/g.test(accDes)) {
          //   let args = accDes.slice(9,-1).split(',');
          //   let v = this.pluginState.layer[this.pluginState.curIdx].relKeys['bbox.'+args[1]];
          //   accessorDict[k] = d => (+args[0]/100)*v;
          //   return;
          // };
          accessorDict[k] = d => accDes;    // is string constant
        }
      }

      if (typeof(accDes) == 'object') {
        accessorDict[k] = d => accDes;        // is object
      }

      if (! isNaN(accDes)) {
        accessorDict[k] = d => accDes;        // is number constant
      }
      if (typeof(accDes) == 'function') {
        accessorDict[k] = (d,i,t) => accDes(d,i,this); // is fcn data, index, plugin this
      }

    });

    return accessorDict;
  }

  /**
  * Performs the final (general) steps for every entry in the render list and calls
  * the render backend for actual drawing.
  *
  * @return none
  */
  render() {

    let eSize = this.rendererObj.getSize();
    let attr = {'width':eSize.w, 'height':eSize.h, viewBox:this.viewBox.join(' '), xmlns:"http://www.w3.org/2000/svg"};
    let svg = this.createElement(attr, 'svg', null);

    // let keys = Object.keys(this.renderList);

    this.renderList.forEach((d, i) => {
      // if (d == "undefined") return;
      let relKeys = this.framesList[d.frame];

      // bbox crop outline
      let cpAttr = {id:`${this.v.name}-${d.frame}-crop`};
      let cp = this.createElement(cpAttr, 'clipPath', svg);
      let rectAttr = {width:relKeys["bbox.w"], height:relKeys["bbox.h"], transform:`translate(0, -${relKeys["bbox.h"]})`};

      this.createElement(rectAttr, 'rect', cp);

      let g = d.group;

      let dro = g.getAttribute('data-renderopts') || '';
      let t = `translate(${relKeys["translate.x"] - (relKeys["bbox.w"]/2)}, ${eSize.h - relKeys["translate.y"] + (relKeys["bbox.h"]/2)})`;
      let r = `rotate(${relKeys["rotate"]} ${relKeys["bbox.w"]/2},${-relKeys["bbox.h"]/2})`;
      let s = (relKeys.mirror && !(dro.includes('nomirror')))?`translate(${relKeys["bbox.w"]},0) scale(-1,1)`:''; // "transform-origin" ignored

      if (dro.includes('norotate')) {
        if (relKeys.rotate%180 == 90) {
          t = `translate(${relKeys["translate.x"] - (relKeys["bbox.h"]/2)}, ${eSize.h - relKeys["translate.y"] + (relKeys["bbox.w"]/2)})`;
          r = '';
          s = s!=''?`translate(${relKeys["bbox.h"]},0) scale(-1,1)`:'';
        }
        if (relKeys.rotate == 180) {
          r = '';
        }
      }

      g.setAttribute('transform', `${t} ${r} ${s}`);
      svg.appendChild(g); // append groups
    });

    console.log(svg)
    this.pluginState.svg = svg;

    if (H.renderer[this.v.element.renderer.name]) {
      let pubsubMsgs = this.rendererObj.render(svg, this.events);
      if (this.v.opts.popup.enabled){
        pubsubMsgs = [... new Set(pubsubMsgs)];
        pubsubMsgs.forEach((item, i) => {  // subscribe to any groups in cfg
           H.Emitter.PubSub.subscribe(item, this.popup.pubsubHandler.bind(this.popup));
        });
      }
    } else {
      this.error('No renderer for:', this.v.element.renderer);
    }
  }

 /**
   * Cuts a text element vertically.
   * Yes. Tspan should do this.  No Paperjs does not support it.
   *
   * @param {Object} cfg.text Selected text elements
   * @param {string} cfg.width Max width
   * @param {string} cfg.fFamily Font family
   * @param {string} cfg.fSize Font size
   * @param {string} cfg.move How to move the text
   */
  wrap(text, width, fFamily, fSize, move) {
    let wFcn = this.rendererObj.getTextWidth.bind(this.rendererObj);
    text.each(function() {
      let texts = [];
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1,
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy"))
      let subText = text.text(null).clone();

      let origDy = subText.node().getAttribute('dy');
      origDy = origDy.includes('em')?fSize*parseFloat(origDy):0;

      subText.node().getAttribute('dy')
      subText.attr('dy', 0 + origDy);
      texts.push(subText);
      let idx = 1;
      while (word = words.pop()) {
        line.push(word);
        let delta = subText.attr('font-size')// dy;
        subText.text(line.join(" "));
        // if (subText.node().innerText.length > width && line.length > 1) { // .getComputedTextLength()
        if (wFcn(subText.node().innerHTML, fFamily, fSize) > width && line.length > 1) { // .getComputedTextLength()
          line.pop();
          subText.text(line.join(" "));
          line = [word];
          subText = subText.clone().text(word).attr('dy', (a,b,c) => `${(delta*idx) + origDy}`); // .attr("dy", ++lineNumber * lineHeight + dy + "em")
          texts.push(subText);
          idx++;
        }
      }
      // move the text based on orientation
      if (move == "top"){
        texts.forEach((item, i) => {
          item.attr('transform', (d,e,f) => {
            let tf = f[0].getAttribute('transform');
            tf = tf==null?'':(tf+' ');
            return `${tf}translate(0 ${-fSize*(idx-1)})`;
          });
        });
      }
    });
  }

  /**
  * Registers an event for an element.
  *
  * @param string The element id
  * @param string The group the element is in
  * @param object The event cfg object
  * @param boolean The popup cfg object
  * @return none
  */
  eventRegister(id, gid, ev, altcfg) {
    if (!ev) return;
    if (!ev.group) ev.group = this.v.name + ' default';

    let p={}, item={elId:id, groupId:gid, ev:ev}
    if (this.v.opts.popup.enabled)
      p = this.popup.register(altcfg.popup);
    this.events.push({...item, ...p});
  }

  /**
  * Get allowable width for an element based on axis bandwidth.
  *
  * @param object The x scaled accessor
  * @param number If <= 1, == the percent of the bandwidth. If > 1, == the px width.
  * @return the width in px
  */
  getDrawWidth(s, v) {
    if (v>1) return v;
    let bw;
    if (s.bandwidth)
      bw = s.bandwidth()
    else {
      this.warn('Axis bandwidth missing or zero.  Are you using the right scale? Using default: 10px')
      bw = 10;
    }
    return bw * v;
  }

  /**
  * Parse the fill color attributes
  *
  * @param object The current scaled accessors
  * @param object The current row of data
  * @return array of attributes
  */
  parseCfgFill(sa, item) {
    let attr = {};
    if ('color' in sa) attr['fill'] = sa.color(item);
    if ('alpha' in sa) attr['fill-opacity'] = sa.alpha(item);
    return attr;
  }

  /**
  * Parse the stroke attributes
  *
  * @param object The current scaled accessors
  * @param object The current row of data
  * @param object The current plugin config
  * @return array of attributes
  */
  parseCfgStroke(sa, item, cfg) {
    let attr = {};
    if ('stroke.dash' in sa) attr['stroke-dasharray'] = sa['stroke.dash'](item)
    if ('stroke.color' in sa) attr['stroke'] = sa['stroke.color'](item);
    if ('stroke.alpha' in sa) attr['stroke-opacity'] = sa['stroke.alpha'](item);
    if ('width' in cfg) attr['stroke-width'] = cfg.width;
    if ('linecap' in cfg) attr['stroke-linecap'] = cfg.linecap;
    if ('linejoin' in cfg) attr['stroke-linejoin'] = cfg.linejoin;
    if ('miterlimit' in cfg) attr['stroke-miterlimit'] = cfg.miterlimit;
    return attr;
  }

  /**
  * Parse the complex color (gradient) attributes
  *
  * @param object The color attribute
  * @param string The unique plugin id
  * @param string The plugin element group
  * @param string The x1 stop color
  * @param string The y1 stop color
  * @param string The x2 stop color
  * @param string The y2 stop color
  * @return URL to the gradient definition
  */
  // allow for linear gradients
  parseCfgColor(color, uid, group, x1, y1, x2, y2) {
    if (typeof(color) != 'object') return color;
    else {
      let defs = this.createElement({}, 'defs', group);
      let attr = {
        id:uid,
        x1:x1==undefined?'0%':x1,
        y1:y1==undefined?'0%':y1,
        x2:x2==undefined?'0%':x2,
        y2:y2==undefined?'100%':y2,
      }
      if (x1!=undefined) attr.gradientUnits = "userSpaceOnUse"; // for point to point gradients. Eg: not horiz/vert
      let grad = this.createElement(attr, 'linearGradient', defs);
      color.forEach((item, i) => {
        attr = {
          'stop-color':item['stop-color'],
          offset:item.offset||(1/(color.length-1))*i
        }
        this.createElement(attr, 'stop', grad);
      });
      return `url(#${uid})`;
    }
  }

  /**
  * Get defaults for the config draw section
  *
  * @param object The incomplete user specified draw cfg
  * @return a complete draw cfg
  */
  resolveCfgDraw(v) {
    v.forEach((item, i) => {
      let pluginHandler = H[item.name];
      if (!pluginHandler) {
        this.warn('No handler for drawable:', item.name);
        return;
      }

      v[i] = this.mergeDeep(pluginHandler.getDefaults(i), item);
    });

    return v;
  }
}

H.Accessors = class {
  /**
  * Creates a scale for each accessor object in cfg and adds it to the scaleDict obj.
  * Since any accessor can be used in any frame, the range is deferred until the plugin runs.
  *
  * @param object The accessor cfg
  * @return none
  */
  accessors (cfg) {
    this.scaleDict = {};
    let gcf = this.getCfgValue;
    Object.keys(cfg).forEach((d, i) => {
      let c = cfg[d];
      let type = c.type.charAt(0).toUpperCase() + c.type.slice(1);

      this.scaleDict[d] = d3[`scale${type}`]();
      if ('interpolate' in c)
        this.scaleDict[d].interpolate(c.interpolate);

      if ('interpolator' in c)
        this.scaleDict[d].interpolator(c.interpolator);

      if ('unknown' in c)
        this.scaleDict[d].unknown(c.unknown);

      if ('domain' in c)
        this.scaleDict[d].domain(c.domain);
    });
  }

  /**
  * Get defaults for the config accessor section
  *
  * @param object The incomplete user specified accessor cfg
  * @return a complete accessor cfg
  */
  resolveCfgAccessors(v) {

    let cfg = {type:"linear", range:"-height"};

    let keys = Object.keys(v);
    keys.forEach((k, i) => {
      let c = JSON.parse(JSON.stringify(cfg));
      v[k] = this.mergeDeep(c, v[k]);
    });

    return v;
  }
}

H.Data = class {

  /**
  * Parses the data array.  This is a stub for future addons which may include:
  * Getting data from urls
  * Verification and wrangling callbacks
  *
  * @param object The relevant data array object
  * @return none
  */
  data (cfg) {
    // verify data is good, get extents
    // get url / library data
  }

  /**
  * Gets a data object for a plugin
  *
  * @param object The plugin cfg
  * @return a data array
  */
  getData(cfg) {
    let data;
    if ('data' in cfg) {
      if (typeof cfg.data == 'string')
        data = this.v.data.filter(d => d.name==cfg.data)[0].content;
    } else {
      data = this.v.data[0].content;
    }
    return data
  }

  /**
  * Get defaults for the config data section
  *
  * @param object The incomplete user specified data cfg
  * @return a complete data cfg
  */
  resolveCfgData(v) {
    let cfg = {"name":"data-0"};
    v = v.map((frame, i) => {
        cfg = JSON.parse(JSON.stringify(cfg));
        return this.mergeDeep(cfg, frame)
      });
    return v;
  }
}

let visObjects = [H.Object, H.Element, H.Data, H.Accessors, H.Frame, H.Draw]
H.Visualization = class extends H.Multi.inherit(...visObjects){

  /**
  * Main entry point for drawing a chart/graph.
  *
  * @param object The whole config object.
  * @return none
  */
  constructor(...args) {
    super(args);

		this.v = args[0]; // new H.Config(args[0])
    if (!this.v.name)
      this.v.name = 'graph'+Math.abs(this.hash(JSON.stringify(this.v)));

    // this.eventSubscriptions = [];
    this.legendList = [];
    this.generated = {legend:[], accessors:{}};  // dynamically created info

    // resolve unset cfg params
    this.resolveCfgFunctions = {
      root:this.resolveCfgRoot.bind(this),
      element:this.resolveCfgElement.bind(this),
      accessors:this.resolveCfgAccessors.bind(this),
      frames:this.resolveCfgFrames.bind(this),
      data:this.resolveCfgData.bind(this)
    }
    this.v = this.resolveCfgFunctions['root'](this.v);

    let modPaths = [];  // dyn load code
    if (this.v.opts.popup.enabled) modPaths.push('./popup.js');
    if (this.v.element.renderer.name == 'svg') modPaths.push('./renderers/svg.js');
    if (this.v.element.renderer.name == 'paperjs') modPaths.push('./renderers/paperjs.js');
    if (this.v.element.renderer.name == 'threesvg') modPaths.push('./renderers/threesvg.js');
    if (this.v.element.renderer.name == 'three') modPaths.push('./renderers/three.js');
    let pluginPaths = this.v.draw.map(d => `./plugins/${d.name}.js`);
    modPaths = [...modPaths, ...new Set(pluginPaths)];

    let promises = modPaths.map(d => import(d));
		this.#parseConfig(Object.keys(this.v), promises);
	}

  /**
  * Returns the resources allocated by a call to the constructor
  *
  * @return none
  */
  destroy(){
    let instance = document.querySelector(this.v.element.selector + " > div");
    if (this.popup && this.popup.PopupElement && this.popup.PopupElement._tippy)
      instance._tippy.destroy();  // TODO: make plugin destroy method
    if (this.rendererObj.dispose)
      this.rendererObj.dispose();
  }

  /**
  * Dynamically creates an accessor.  Used currently only for maps.
  *
  * @param object The accessor
  * @param string The accessor key
  * @return none
  */
  // store a dyanamically created accessor
  generateAccessor(f, name) {
    this.generated.accessors[name] = f;
  }

  /**
  * Get defaults for the config root
  *
  * @param object The incomplete user specified cfg
  * @return a complete root cfg
  */
  resolveCfgRoot(v) {
    let cfg = {
      logLevel:"warn",
      name:'graph-',
      opts:{popup:{enabled:true}},
      element:{},
      accessors:{},
      frames:[],
      data:[],
      draw:[]
    };

    v = this.mergeDeep(cfg, v);

    let keys = Object.keys(v);
    keys.forEach((c, i) => {
      let handler = this.resolveCfgFunctions[c];
      if (handler)
        v[c] = handler(v[c]);
    });

    return v;
  }

  /**
  * Tests if item is an object
  *
  * @param unknown The item to be tested
  * @return boolean result of the test
  */
  isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }

  /**
   * Deep merge two objects.   WARNING DOES NOT MERGE ARRAYS - OVERWRITES ONLY
   * @param target
   * @param ...sources
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
  * Checks that all imports are finished, then starts the config parsing
  *
  * @param object Keys of objects in the config
  * @param object Array of promises
  * @return none
  */
	async #parseConfig(keys, promises) {
    try {
      await Promise.all(promises);
    } catch(e) {
      console.error(e);
    }
    keys = ["logLevel", "element", "frames", "accessors", "data", "draw"].filter(x => keys.includes(x));
		keys.forEach((item, i) => {
      if(typeof(this.v[item]) == "object")
			   this[item](this.v[item]); // send path regex
		});
    if (this.v.onStateChange)
      this.v.onStateChange('PARSE_CFG_END')
	}

  /**
  * Gets a single config value
  *
  * @param string Object path.  Eg: "cfg.stroke.width"
  * @param object The plugin cfg
  * @return the value of the config key
  */
  // TODO turn off Inherit from parents
  getCfgValue(path, cfg) {
    let pparts = path.split('.');
    let key = pparts.pop();
    let current = cfg;
    let value = cfg[key];
    pparts.forEach((item, i) => {
      if (current[item] != undefined) {
        current = current[item];
        if (current[key] != undefined) value = current[key];
      }
    });
    return (value);
  }

  /**
  * Deprocated in favor of ggplot style legends
  *
  */
  // legendRegister(obj) {
  //   let num = this.legendList.filter(d => d.label == obj.label)
  //   if (!num.length)
  //     this.legendList.push(obj);
  // }

  /**
  * Returns the current config
  *
  * @return the config
  */
  getConfig() {
    return this.v;
  }

  /**
  * Sets a new configuration
  *
  * @param object The new cfg
  * @return none
  */
  setConfig(cfg) {
    this.v = cfg;
    this.accessors(cfg.accessors);
    this.rendererObj.redraw();
  }

  /**
  * Merge data into an existing config
  * This assumes unique id's which don't conflict
  *
  * @param object The new cfg
  * @param boolean If the new config should trigger a redraw
  * @return none
  */
  // merge accessors, frames, data, draw
  // assumes unique id's don't conflict
  mergeConfig(newCfg, update=true) {
    let mergeObjs = ['accessors','frames','data','draw'];
    mergeObjs.forEach((o, i) => {
      if (! newCfg[o]) return;
      if (Array.isArray(this.v[o]))
        this.v[o] = [...this.v[o], ...newCfg[o]];
      else
        this.v[o] = {...this.v[o], ...newCfg[o]};
    });

    this.resolveCfgRoot(this.v);

    // // make sure legends are always last
    // let legend = this.v.draw.filter(d => d.name=='legend');
    // this.v.draw = this.v.draw.filter(d => d.name!='legend');
    // this.v.draw = [...this.v.draw, ...legend];

    this.accessors(this.v.accessors);
    if(update)
      this.rendererObj.redraw();
  }

  static genGradientFromSA(sa, cfg) {
    if (!cfg) cfg = this.v;

    let range = cfg.accessors[sa]
    if(range) range = range.range;
    else {
      console.warn('No scaled accesor key:', sa);
      return;
    }
    return range.map(d => {return {'stop-color':d}});
  }
}
