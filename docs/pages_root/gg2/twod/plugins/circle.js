"use strict";

H.circle = class {

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
    let complexKeys = ['x', 'y', 'r', 'color', 'alpha', 'stroke.color', 'stroke.alpha'];
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    vis.eventData = [];

    function makeCircle(CX, CY, R) {
      return(
        `M ${CX - R}, ${CY}
        a ${R},${R} 0 1,0 ${R*2},0
        a ${R},${R} 0 1,0 ${-(R*2)},0`
      )
    }

    data.forEach((item, j) => {
      let x = sa.x(item)
      let y = sa.y(item)
      let r = sa.r(item)
      let id = `${g.id}-${cfg.id}-${j}`

      var attr = {
        'id':id,
        "d":makeCircle(x, y, r),
        ...vis.parseCfgFill(sa, item),
        ...vis.parseCfgStroke(sa, item, cfg.stroke)
      }

      vis.eventRegister(id, g.id, cfg.ev, {popup:{attr:attr, idx:j, title:cfg.title, data:data}});
      vis.createElement(attr, 'path', g);
    });

  }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults(i) {
    return {
          id:'default-id', title:'circle', frame:'frame-0', stroke:{width:0, color:"rgb(0,0,0,.5)"}, alpha:1, color:"#252a56", legend:false, r:5
        }
  }
}
