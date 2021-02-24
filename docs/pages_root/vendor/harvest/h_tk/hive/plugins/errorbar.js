"use strict";

H.errorbar = class {

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
    let complexKeys = ['x', 'y0', 'y1', 'stroke.color', 'stroke.alpha', 'stroke.dash']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    let wl = vis.getDrawWidth(sa.x(), cfg.whiskerLen);

    data.forEach((item, j) => {
      let x = sa.x(item);
      let y1 = sa.y1(item);
      let y0 = sa.y0(item);

      function makeEbar(x, y0, y1, wl) {
        return(
          `M${x} ${y1} L${x} ${y0}
           M${x-(wl/2)} ${y1} L${x+(wl/2)} ${y1}
           M${x-(wl/2)} ${y0} L${x+(wl/2)} ${y0}`
        )
      }

      let attr = {
        'id':`${g.id}-${cfg.id}-${j}`,
        "d":makeEbar(x, y0, y1, wl),
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
          whiskerLen:.3, y:0, min:0, max:0
        }
  }

}
