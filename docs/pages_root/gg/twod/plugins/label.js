"use strict";

H.label = class {

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
    let complexKeys = ['x', 'y', 'color', 'offset.x', 'offset.y', 'textAnchor']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    data.forEach((item, j) => {
      let x = sa.x(item)
      let y = sa.y(item)

      let fSize = gcf("font.size", cfg);
      // get color
      let c = sa.color(item)
      if (Math.abs(y) + (fSize * 1.5) > relKeys["bbox.h"] && "flipColor" in cfg) {
        y += (fSize * 1.5);
        c = cfg.flipColor;
      }

      let v; // get value
      if (typeof(cfg.value) == "function") {
        v = cfg.value(item);
      } else {
        v = item[cfg.value];
      }
      if (cfg.contentHandler)
        v = cfg.contentHandler(v);

      let xoff = 0;
      let yoff = -fSize / 2;
      let ta='middle';
      let r=0;
      let s='';
      if (relKeys["rotate"] == 90) {
        xoff = fSize * .25;
        ta = 'start';
        r = -90;
      }
      if (relKeys["rotate"] == 180) {
        //xoff = fSize * .25;
        yoff -= fSize;
        r = -180;
      }
      if (relKeys["rotate"] == 270) {
        xoff = -fSize * .25;
        ta = 'end';
        r = -270;
      }

      if(relKeys["mirror"]){
        s=`translate(${(relKeys["bbox.w"]) + x - (relKeys["bbox.w"] - x)},0) scale(-1,1)`
        if (relKeys["rotate"]== 90) r = 90;
        if (relKeys["rotate"]== 270) r = -90;
        if (relKeys["rotate"]%180 == 90) {
          xoff *= -1;
          yoff *= 2;
        }
      }

      // overrides
      if (cfg.offset && 'x' in cfg.offset)
        xoff = sa['offset.x'](item);

      if (cfg.offset && 'y' in cfg.offset)
        yoff = sa['offset.y'](item);

      if ('textAnchor' in cfg)
        ta = sa['textAnchor'](item);

      let attr = {
        id:`${g.id}-${cfg.id}-${j}`,
        x:x+xoff,
        y:y+yoff,
        fill:c,
        'text-anchor':ta,
        'font-family':gcf("font.family", cfg),
        'font-size':gcf("font.size", cfg),
        'font-style':gcf("font.style", cfg),
        'class':'plugin-label',
        'transform':`rotate(${r} ${x+xoff} ${y+yoff}) ${s}`
      };

      let text = vis.createElement(attr, "text", g);
      text.textContent = v;

    });
  }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults() {
    return {
          id:'default-id', frame:'frame-0', font:{family:"Roboto", size:14, style:"normal"},
          color:"#333333"
        }
  }
}
