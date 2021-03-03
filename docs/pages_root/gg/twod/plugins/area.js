"use strict";

H.area = class {

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
    let gcf = vis.getCfgValue;

    let frame = gcf("frame", cfg)
    if (relKeys.crop)
      g.setAttribute('clip-path', `url(#${g.id.split('-')[0]}-${frame}-crop)`); // crop the vis

    var dFcn = d3.area()

    let data = vis.getData(cfg)
    if (!(Array.isArray(data[0]))) data = [data];

    let complexKeys = ['x', 'y', 'x0', 'y0', 'x1', 'y1', 'color', 'alpha', 'stroke.color', 'stroke.alpha']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    dFcn.curve(cfg.curve);

    ['x', 'y', 'x0', 'y0', 'x1', 'y1'].forEach((k, i) => { // assign accessors
      if (k in sa)
        dFcn = dFcn[k](sa[k])
    });

    data.forEach((item, j) => {
      let attr = {
        'id':`${g.id}-${cfg.id}-${j}`,
        "d":dFcn(item),
        ...vis.parseCfgFill(sa, item[0]),
        ...vis.parseCfgStroke(sa, item[0], cfg.stroke)
      }
      attr.fill = vis.parseCfgColor(attr.fill, `${g.id}-${cfg.id}-0-gradient`, g, 0, 0, 0, -relKeys['bbox.h']);

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
          id:'default-id', frame:'frame-0', stroke:{width:0, color:"rgb(0,0,0,.5)"},
          continuous:false, curve:d3.curveLinear, color:"#e9bcb733"
        }
  }
}
