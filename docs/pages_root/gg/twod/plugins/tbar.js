"use strict";

H.tbar = class {

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
    let complexKeys = ['x', 'y', 'b', 'stroke.color', 'stroke.alpha']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    // let relWidth = vis.getRelative([['w', relKeys["bbox.w"]]], cfg);

    function makeTee(x, y, w, b) {
      return(
        `M${x} ${y} L${x} ${b} M${x-(w/2)} ${y} L${x+(w/2)} ${y} Z`
      )
    }

    data.forEach((item, j) => {
      let x = sa.x(item);
      let y = sa.y(item);
      let w = vis.getDrawWidth(sa.x(), cfg.whiskerLen);
      let b = sa.b(item);
      if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(b)) {
        vis.warn(`Bad data: Line ${j} not wrangled properly.`)
        return;
      }

      let attr = {
        'id':`${g.id}-${cfg.id}-${j}`,
        "d":makeTee(x, y, w, b),
      ...vis.parseCfgStroke(sa, item, cfg.stroke)
      };

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
          id:'default-id', frame:'frame-0', stroke:{width:1, color:"rgb(0,0,0,.5)"},
          b:0, whiskerLen:.3, legend:false
        }
  }

}
