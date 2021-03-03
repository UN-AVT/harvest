"use strict";

H.boxplot = class {

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
    let complexKeys = ['x', 'y', 'min', 'max', 'lower', 'upper', 'notchLower', 'notchUpper', 'stroke.color', 'stroke.alpha']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    let w = vis.getDrawWidth(sa.x(), cfg.width); //gcf("width", cfg);
    let wl = vis.getDrawWidth(sa.x(), cfg.whiskerLen); // gcf("whiskerLen", cfg);
    let nl = vis.getDrawWidth(sa.x(), cfg.notchWidth); //gcf("notchWidth", cfg);

    data.forEach((item, j) => {
      let x = sa.x(item);
      let y = sa.y(item);
      let min = sa.min(item);
      let max = sa.max(item);
      let lower = sa.lower(item);
      let upper = sa.upper(item);
      let notchLower = sa.notchLower(item);
      let notchUpper = sa.notchUpper(item);

      if (isNaN(x) || isNaN(y) || isNaN(min) || isNaN(max)) {
        vis.warn(`Bad data: Line ${j} not wrangled properly.`)
        return;
      }

      function makeBoxPlot(x, y, min, max, w, ml, wl) {
        return(
          `M${x} ${max} L${x} ${upper}
           L${x+(w/2)} ${upper} L${x+(w/2)} ${notchUpper}
           L${x+(nl/2)} ${y} L${x-(nl/2)} ${y}
           L${x-(w/2)} ${notchUpper} L${x-(w/2)} ${upper}
           L${x} ${upper}
           M${x} ${min} L${x} ${lower}
           L${x+(w/2)} ${lower} L${x+(w/2)} ${notchLower}
           L${x+(nl/2)} ${y} L${x-(nl/2)} ${y}
           L${x-(w/2)} ${notchLower} L${x-(w/2)} ${lower}
           L${x} ${lower}
           M${x-(wl/2)} ${max} L${x+(wl/2)} ${max}
           M${x-(wl/2)} ${min} L${x+(wl/2)} ${min}`
        )
      }

      let attr = {
        'id':`${g.id}-${cfg.id}-${j}`,
        "d":makeBoxPlot(x, y, min, max, w, nl, wl),
        "fill":gcf("color", cfg),
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
          id:'default-id', frame:'frame-0', stroke:{width:2, color:"rgb(0,0,0,.5)"},
          color:"white", width:.3, y:0, notchLower:0, notchUpper:0, min:0, max:0, whiskerLen:.3,
          min:'min', max:'max', lower:'lower', upper:'upper', notchLower:'notchLower', notchUpper:'notchUpper', notchWidth:.25
        }
  }

}
