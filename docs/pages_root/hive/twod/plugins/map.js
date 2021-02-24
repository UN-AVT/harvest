"use strict";

H.map = class {

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
    if (cfg.clip)
      g.setAttribute('clip-path', `url(#${g.id.split('-')[0]}-${frame}-crop)`); // crop the vis

    let data = vis.getData(cfg);
    let complexKeys = ['feature', 'color', 'alpha', 'stroke.color', 'stroke.alpha'];
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    let projection = d3[`geo${cfg.projection}`]()
      .translate([relKeys["bbox.w"]/2, -relKeys["bbox.h"]/2]);

    Object.keys(cfg.projectionOpts||{}).forEach((item, i) => {
      projection = projection[item](cfg.projectionOpts[item])
    });

    var dFcn = d3.geoPath()
      .projection(projection);

    let bounds = [[Infinity,Infinity],[0,0]];
    // create features
    data.forEach((item, i) => {
      let id = `${g.id}-${cfg.id}-${item.id}`;
      let attr = {
        'id':id,
        "d":dFcn(sa['feature'](item)),
        fill:sa['color'](item),
        ...vis.parseCfgFill(sa, item),
        ...vis.parseCfgStroke(sa, item, cfg.stroke)
      };

      vis.eventRegister(id, g.id, cfg.ev, {popup:{attr:attr, idx:i, title:cfg.title, data:data}});
      vis.createElement(attr, 'path', g);

      if (cfg.centroid) {
        attr = { // create alt points for popup
          'id':id + '-alt',
          'r':0,
          'fill-opacity':0,
          'stroke-opacity':0,
          cx:projection(item[cfg.centroid])[0],
          cy:projection(item[cfg.centroid])[1]
        };
        vis.createElement(attr, 'circle', g);
      }
    });

    function getLon(d) {
      d = d[this.field];
      return projection([d, 0])[0];
    };

    function getLat(d) {
      d = d[this.field];
      return projection([0, d])[1];
    };

    if (cfg.generate && typeof(cfg.generate.latitude) == 'string')
      vis.generateAccessor(getLat, cfg.generate.latitude);

    if (cfg.generate && typeof(cfg.generate.longitude) == 'string')
      vis.generateAccessor(getLon, cfg.generate.longitude);

  }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults() {
    return {frame:'frame-0', projection:'Mercator', stroke:{width:3, color:"rgb(0,0,0,.5)"},
        projectionOpts:{center:[-73.9679163, 40.7495461], scale:100000}, clip:true};
  }
}
