"use strict";

H.edge = class {

  /**
  * Appends elements to the provided group
  *
  * @param object The plugin configuration
  * @param object The group element to attach to
  * @param object Relative sizing keys for this frame
  * @param object The visualization Object
  * @return none
  */
  static draw (cfg, g, relKeys, vis) {
    let gcf = vis.getCfgValue;

    let frame = gcf("frame", cfg)
    if (relKeys.crop)
      g.setAttribute('clip-path', `url(#${g.id.split('-')[0]}-${frame}-crop)`); // crop the vis

    var dFcn = d3.line();

    let data = vis.getData(cfg)
    let complexKeys = ['sx', 'sy', 'tx', 'ty', 'stroke.color', 'stroke.alpha', 'stroke.dash']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);


    data.forEach((item, i) => {
      let sx = sa.sx(item);
      let sy = sa.sy(item);
      let tx = sa.tx(item);
      let ty = sa.ty(item);

      let begData = [], endData = [];
      if (cfg.curve != d3.curveLinear) {
        let dx = sx-tx;
        let dy = sy-ty;
        if (Math.abs(dx) > Math.abs(dy)) { // mostly horiz
          begData = [{x:sx-(tx/(10**9)), y:sy}];
          endData = [{x:tx+(tx/(10**9)), y:ty}];
          if (cfg.curve == 'auto'){
            if (dx < 0) dFcn.curve(d3.curveMonotoneY);
            else dFcn.curve(d3.curveMonotoneX);
          } else {
            dFcn.curve(cfg.curve);
          }
        } else { // mostly vert
          begData = [{x:sx, y:sy-(tx/(10**9))}];
          endData = [{x:tx, y:ty+(tx/(10**9))}];
          if (cfg.curve == 'auto'){
            if (dy < 0) dFcn.curve(d3.curveMonotoneY);
            else dFcn.curve(d3.curveMonotoneX);
          } else {
            dFcn.curve(cfg.curve);
          }
        }
      }
      let lineData = [...begData, {x:sx, y:sy}, {x:tx, y:ty}, ...endData];

      let id = `${g.id}-${cfg.id}-${i}`;

      // let attr = {};  // create src -> tgt gradient
      // let gradientAttr = {};
      // if (cfg.stroke.color2) {
      //   let defs = vis.createElement(attr, 'defs', g);
      //   attr = {
      //     id:id+'-gradient',
      //     x1:sx,
      //     y1:sy,
      //     x2:tx,
      //     y2:ty,
      //     gradientUnits:"userSpaceOnUse"
      //   }
      //   let lg = vis.createElement(attr, 'linearGradient', defs);
      //   attr = {
      //     'stop-color':sa['stroke.color'](item),
      //     offset:"0"
      //   }
      //   vis.createElement(attr, 'stop', lg);
      //   attr = {
      //     'stop-color':cfg.stroke.color2,
      //     offset:"1"
      //   }
      //   vis.createElement(attr, 'stop', lg);
      //   gradientAttr.stroke = `url(#${id}-gradient)`;
      // }


      let attr = {
        'id':id,
        "d":dFcn.x(d=>d.x).y(d=>d.y)(lineData),
        'fill':'none',
        ...vis.parseCfgStroke(sa, null, cfg.stroke),
        // ...gradientAttr,
      }
      attr.stroke = vis.parseCfgColor(attr.stroke, `${id}-gradient`, g, sx, sy, tx, ty);

      vis.createElement(attr, 'path', g);
    });

  }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults() {
    return {
          id:'default-id', frame:'frame-0', stroke:{width:1, color:"rgb(0,0,0,.5)", dash:'0'}, curve:d3.curveLinear
        }
  }
}
