"use strict";

H.binhex = class {

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
    // Issue: clipping is hard-coded to a negative Y
    if (relKeys.crop)
      g.setAttribute('clip-path', `url(#${g.id.split('-')[0]}-${frame}-crop)`); // crop the vis

    let data = vis.getData(cfg)
    let complexKeys = ['x', 'y', 'color', 'alpha', 'stroke.color', 'stroke.alpha']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    let hs = gcf("hexSize", cfg);
    let maxX = sa.x().range()[1];
    let maxY = sa.y().range()[1];
    let scaledData = data.map(d => [sa.x(d), sa.y(d)])
    let bhGen = d3.hexbin().radius(hs).extent([[0,0], [maxX, maxY]]);
    let binhexData = [];

    bhGen(scaledData).forEach((item, j) => {
      let id = `${g.id}-${cfg.id}-${j}`;
      let attr = {
        'id':id,
        "d":bhGen.hexagon(),
        transform:`translate(${item.x} ${item.y})`,
        ...vis.parseCfgFill(sa, {color:item.length-2}),
        ...vis.parseCfgStroke(sa, {color:item.length-2}, cfg),
      };

      binhexData.push({qty:item.length-2});
      vis.eventRegister(id, g.id, cfg.ev, {popup:{attr:attr, idx:j, title:cfg.title, data:binhexData}});
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
          id:'default-id', frame:'frame-0', stroke:{width:.1, color:"rgb(0,0,0,1)"},
          color:"grey"
        }
  }

}
