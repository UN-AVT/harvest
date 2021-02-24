"use strict";

H.legend = class {

  /**
  * Appends elements to the provided group
  *
  * @param object The plugin configuration
  * @param object The group element to attach to
  * @param object Relative sizing keys for this frame
  * @param object The visualization Object
  * @return none
  */
  static draw(cfg, g, relKeys, vis) {

    let complexKeys = ['color']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, []);
    relKeys = {...relKeys, ...vis.getRelative([['pos.x', relKeys["bbox.w"]], ['pos.y', relKeys["bbox.h"]]], cfg)}
    g.setAttribute('data-renderopts', cfg.renderopts)

    let pos = [relKeys["pos.x"], -relKeys["pos.y"]] // -

    let padding = 2;
    let fontFamily = cfg.font.family;
    let fontSize = cfg.font.size;
    let fontWeight = cfg.font.weight;
    let fontStyle = cfg.font.style;
    let fontColor = cfg.font.color;
    let orientation = cfg.orientation;

    // get color or gradient
    function getColor(c) {
      // user color handlers MUST return color string or array when their arg[0] == undefined
      if (typeof(c) == 'function') c = c();
      if (typeof(c) == 'function') {  // hopefully a scale
        if (c.range) {
          let cr = c.range();
          if (cr.length == 1) c = [cr[0], cr[0]]
          else c = cr;
        } else {
          vis.warn('Could not determine legend color.  Using black.');
          c = ['black'];
        }
      }
      return c;
    }

    // sets solid or gradient fill color
    function setColor(colors, i) {
      if (typeof(colors) == 'string') colors = [colors,colors];
      let attr;
      let g = document.createElement("g")
      let defs = vis.createElement([], "defs", g)
      let gName = `gradient-${i}`;
      attr = {id:gName, x1:"0%", y1:"0%", x2:"100%", y2:"0%"}
      let lg = vis.createElement(attr, "linearGradient", defs)

      let pcnt = d3.scaleLinear().domain([0,colors.length]).range([0,100]);
      colors.forEach((item, i) => {
        let p = pcnt(i);
        attr = { offset:`${p}%`, style:`stop-color:${item}`}
        let stop = vis.createElement(attr, "stop", lg)
      });

      return g;
    }

    vis.legendList.forEach((item, i) => {
      let c = getColor(item.color);
      let offY = (i*fontSize) + (i>0?padding*i:0);
      let x = pos[0], y = pos[1]+offY, attr;
      let gName = `gradient-${i}`;

      if (item.type == 'box') {
        let lg = setColor(c, i)
        attr = {fill:`url(#${gName})`, x:x, y:y+(fontSize*.15), height:fontSize, width:fontSize, rx:3, ry:3}
        let rect = vis.createElement(attr, "rect", lg);
        attr = {fill:fontColor, x:x+fontSize+padding, y:y+fontSize, 'font-family':fontFamily, 'font-size':fontSize, 'font-weight':fontWeight, 'font-style':fontStyle}      // transform:`rotate(30 ${x + fs},${y + fs})`
        let text = vis.createElement(attr, "text", lg);
        text.textContent = item.label;
        g.appendChild(lg); // 'text-anchor':"middle",
      }
      if (item.type == 'circle') {
        let lg = setColor(c, i)
        attr = {fill:`url(#${gName})`, x:x, y:y+(fontSize*.15), height:fontSize, width:fontSize, rx:50, ry:50}
        let rect = vis.createElement(attr, "rect", lg);
        attr = {fill:fontColor, x:x+fontSize+padding, y:y+fontSize, 'font-family':fontFamily, 'font-size':fontSize, 'font-weight':fontWeight, 'font-style':fontStyle}      // transform:`rotate(30 ${x + fs},${y + fs})`
        let text = vis.createElement(attr, "text", lg);
        text.textContent = item.label;
        g.appendChild(lg);
      }
      if (item.type == 'line') {
        let lg = setColor(c, i)
        let lineY = (y+(fontSize*.65))
        attr = {x1:x, y1:lineY, x2:x+fontSize, y2:lineY, 'stroke-dasharray':item.dash, 'stroke-width':item.width, stroke:`url(#${gName})`};
        let line = vis.createElement(attr, "line", lg);
        attr = {fill:fontColor, x:x+fontSize+padding, y:y+fontSize, 'font-family':fontFamily, 'font-size':fontSize, 'font-weight':fontWeight, 'font-style':fontStyle}      // transform:`rotate(30 ${x + fs},${y + fs})`
        let text = vis.createElement(attr, "text", lg);
        text.textContent = item.label;
        g.appendChild(lg);
      }
    });
  }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults() {
    return {
      frame:'frame-0', pos:{x:'88%', y:'90%'}, orientation:'vertical',
      font:{family:"Roboto", size:14, weight:400, style:"normal", color:'black'}, renderopts:"norotate nomirror",
    }
  }

  // legendOLDHTMLVERSION(cfg, i) {
  //
  //   // hex to rgba
  //   const isValidHex = (hex) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(hex)
  //   const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, "g"))
  //   const convertHexUnitTo256 = (hexStr) => parseInt(hexStr.repeat(2 / hexStr.length), 16)
  //   const getAlphafloat = (a, alpha) => {
  //       if (typeof a !== "undefined") {return a / 255}
  //       if ((typeof alpha != "number") || alpha <0 || alpha >1){
  //         return 1
  //       }
  //       return alpha
  //   }
  //   function hexToRGBA (hex, alpha) {
  //       if (!isValidHex(hex)) {throw new Error("Invalid HEX")}
  //       const chunkSize = Math.floor((hex.length - 1) / 3)
  //       const hexArr = getChunksFromString(hex.slice(1), chunkSize)
  //       const [r, g, b, a] = hexArr.map(convertHexUnitTo256)
  //       return `rgba(${r}, ${g}, ${b}, ${getAlphafloat(a, alpha)})`
  //   }
  //
  //   let complexKeys = ['color']; // keys which take numbers, col names, or scale names
  //   let resVals = vis.resolveCfgVals([['pos.x', vis.element.w], ['pos.y', vis.element.h]], complexKeys, cfg, null); // resolve config values
  //   let relKeys = resVals.rk;
  //   let sa = resVals.sa
  //
  //   let pos = [relKeys["translate.x"] + relKeys["pos.x"], relKeys["bbox.h"] + relKeys["translate.y"] - relKeys["pos.y"]] // -
  //
  //   let l = [];
  //   let fontFamily = cfg.font.family;
  //   let fontSize = cfg.font.size;
  //   let fontWeight = cfg.font.weight;
  //   let fontStyle = cfg.font.style;
  //   let fontColor = cfg.font.color;
  //   let orientation = cfg.orientation;
  //   // name:'legend', translate:translate, bbox:{h:"80%", w:"90%"},
  //   // font:{family:"Roboto", size:10, weight:400, style:"normal"},
  //   // pos:{x:'-4%', y:'40%'}, orientation:'vertical'
  //
  //   // get color or gradient
  //   function getColor(c) {
  //     // user color handlers MUST return color string or array when their arg[0] == undefined
  //     if (typeof(c) == 'function') c = c();
  //     if (typeof(c) == 'function') {  // hopefully a scale
  //       if (c.range) {
  //         let cr = c.range();
  //         if (cr.length == 1) c = [cr[0], cr[0]]
  //         else c = cr;
  //       } else {
  //         vis.warn('Could not determine legend color.  Using black.');
  //         c = ['black', 'black'];
  //       }
  //     }
  //     if(typeof(c) == "string") c = [c, c];
  //     c = c.map(d => {
  //       if (d.slice(0,1) == '#') return hexToRGBA(d);
  //       return d;
  //     });
  //     return c;
  //   }
  //
  //   vis.legendList.forEach((item, i) => {
  //     let c = getColor(item.color);
  //     if (item.type == 'box') {
  //       l.push(`<div style="display:inline-flex; align-content:center;"><span style="background-image: linear-gradient(to right, ${c.join(',')}); border-radius:10%; margin:2px; font-family:courier; font-size:${fontSize}px;">&nbsp;&nbsp;</span><span style="font-family:${fontFamily}; font-size:${fontSize}px; font-weight:${fontWeight}; font-style:${fontStyle}; color:${fontColor}; align-items:center; display:inline-flex;" >${item.label}</span></div>`);
  //     }
  //     if (item.type == 'circle') {
  //       l.push(`<div style="display:inline-flex; align-content:center;"><span style="background-image: linear-gradient(to right, ${c.join(',')}); border-radius:50%; margin:2px; font-family:courier; font-size:${fontSize}px;">&nbsp;&nbsp;</span><span style="font-family:${fontFamily}; font-size:${fontSize}px; font-weight:${fontWeight}; font-style:${fontStyle}; color:${fontColor}; align-items:center; display:inline-flex;">${item.label}</span></div>`);
  //     }
  //     if (item.type == 'line') {
  //       l.push(`<svg height="${fontSize}" width="${fontSize}" style="margin:2px;"> <line stroke-dasharray="${item.dash}" stroke-width="${item.width}" x1="2" y1="${fontSize*.75}" x2="${fontSize}" y2="${fontSize*.75}" stroke="${c[0]}"/> </svg> <span style="font-family:${fontFamily}; font-size:${fontSize}px; font-weight:${fontWeight}; font-style:${fontStyle}; color:${fontColor};">${item.label}</span>`);
  //     }
  //   });
  //
  //   let canvas = vis.drawableElement;
  //   var ctx = canvas.getContext('2d')
  //   let html;
  //   if (cfg.orientation == 'vertical')
  //     html = l.join(`<br> <div style="font-family:courier; font-size:${fontSize*.2}px;">&nbsp;</div>`);
  //   else
  //     html = l.join('&nbsp;');
  //
  //   // get image width
  //   H.html2canvas.render(html, ctx, pos[0], pos[1], relKeys["bbox.w"], relKeys["bbox.h"], vis);
  //
  //   let attr;
  //   let fs = 10; // font size
  //   let x = 100;
  //   let y = 100;
  //
  //   let svg = setColor(['red','blue'])
  //   attr = {fill:"url(#grad)",x:x,y:y,height:fs,width:fs}
  //   let rect = vis.createElement(attr, "rect", svg);
  //   attr = {fill:'red',x:x + fs,y:y + fs,transform:`rotate(30 ${x + fs},${y + fs})`}
  //   let text = vis.createElement(attr, "text", svg);
  //   text.textContent = 'test';
  //
  //   let serializer = new XMLSerializer();
  //   let source = serializer.serializeToString(svg);
  //
  //   vis.drawableObject.project.importSVG(svg, {expandShapes:true, applyMatrix:true} );
  // }
}
