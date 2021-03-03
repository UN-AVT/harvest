"use strict";

H.rectangle = class {

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
    let complexKeys = ['x', 'y', 'b', 'w', 'h', 'color', 'alpha', 'stroke.color', 'stroke.alpha', 'rotate']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    data.forEach((item, j) => {
      let x = sa.x(item);
      let y = sa.y(item);
      let w;
      if (typeof(cfg.w) == 'number')
        w = vis.getDrawWidth(sa.x(), cfg.w)
      else
        w = sa.w(item);

      if (isNaN(x) || isNaN(y)) {
        vis.warn(`Bad data: Line ${j} not wrangled properly.`)
        return;
      }

      let shapeFcn = [
        (x, y, w, b) => `M ${x}, ${b} L${x-(w/2)} ${b} L${x-(w/2)} ${y} L${x+(w/2)} ${y} L${x+(w/2)} ${b} L${x} ${b} Z`,
        (x, y, w, h) => `M ${x}, ${y} L${x+w} ${y} L${x+w} ${y-h} L${x} ${y-h} L${x} ${y} Z`,
      ];

      let d;
      if (cfg.shape == 0) d = shapeFcn[cfg.shape](x, y, w, sa.b(item));
      if (cfg.shape == 1) d = shapeFcn[cfg.shape](x, y, w, sa.h(item));

      let rotateOrigX = 0
      let rotateOrigY = 0
      if (cfg.rotateOrigin == 'xy'){
        rotateOrigX = x
        rotateOrigY = y
      }

      let id = `${g.id}-${cfg.id}-${j}`;
      let attr = {
        'id':id,
        "d":d,
        "fill":sa.color(item),
        'transform':`rotate(${sa.rotate(item)},${rotateOrigX},${rotateOrigY})`,
      ...vis.parseCfgFill(sa, item),
      ...vis.parseCfgStroke(sa, item, cfg.stroke)
      };

      vis.eventRegister(id, g.id, cfg.ev, {popup:{attr:attr, idx:j, title:cfg.title, data:data}});
      vis.createElement(attr, 'path', g);

      attr = { // create alt points for popup
        'id':id + '-alt',
        'r':0,
        fill:'blue',
        stroke:'blue',
        'fill-opacity':0,
        'stroke-opacity':0,
        cx:x,
        cy:y
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
          id:'default-id', title:'rectangle', frame:'frame-0', stroke:{width:0, color:"rgb(0,0,0,.5)"}, rotate:0,
          color:"orange", b:0, w:.3, shape:0
        }
  }
}
