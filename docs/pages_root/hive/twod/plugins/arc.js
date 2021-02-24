"use strict";

H.arc = class {

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

    let data = vis.getData(cfg)
    let complexKeys = ['startAngle', 'endAngle', 'innerRadius', 'outerRadius', 'color', 'alpha', 'stroke.color', 'stroke.alpha']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    data.forEach((item, j) => {

      let dFcn = d3.arc();
      ['startAngle', 'endAngle', 'innerRadius', 'outerRadius'].forEach((d, i) => {
        dFcn[d](sa[d](item));
      });

      let id = `${g.id}-${cfg.id}-${j}`;
      let attr = {
        'id':id,
        "d":dFcn(),
        "fill":sa.color(item),
        ...vis.parseCfgFill(sa, item),
        ...vis.parseCfgStroke(sa, item, cfg.stroke)
      };

      vis.eventRegister(id, g.id, cfg.ev, {popup:{attr:attr, idx:j, title:cfg.title, data:data}});
      vis.createElement(attr, 'path', g);

      let c = dFcn.centroid();

      attr = { // create alt points for popup
        'id':id + '-alt',
        'r':0,
        'fill-opacity':0,
        'stroke-opacity':0,
        cx:c[0],
        cy:c[1]
      };
      vis.createElement(attr, 'circle', g);
    });
  }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults() {
    return {
          id:'default-id', title:'arc', frame:'frame-0', stroke:{width:0, color:"rgb(0,0,0,.5)"},
          color:"orange"
        }
  }
}
