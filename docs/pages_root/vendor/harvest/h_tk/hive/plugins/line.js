"use strict";

H.line = class {

  /**
  * Appends elements to the provided group
  *
  * @param object The plugin configuration
  * @param object The group element to attach to
  * @param object Relative sizing keys for this frame
  * @param object The visualization Object
  * @return none
  */
  static draw (cfg, g, relKeys, vis) {
    let gcf = vis.getCfgValue;

    let frame = gcf("frame", cfg)
    if (relKeys.crop)
      g.setAttribute('clip-path', `url(#${g.id.split('-')[0]}-${frame}-crop)`); // crop the vis

    var dFcn = d3.line();

    let data = vis.getData(cfg);
    if (!(Array.isArray(data[0]))) data = [data];

    let complexKeys = ['x', 'y', 'stroke.color', 'stroke.alpha', 'stroke.dash']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    ['x', 'y'].forEach((k, i) => { // assign accessors
      dFcn = dFcn[k](sa[k]);
    });

    dFcn.curve(cfg.curve);

    // marker-end not supported in paperjs
    // https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/marker-end
    // d3.select(g).append("defs").append("marker")
    //     .attr("id", "triangle")
    //     .attr("refX", 1) /*must be smarter way to calculate shift*/
    //     .attr("refY", 5)
    //     .attr("markerUnits", "strokeWidth")
    //     .attr("markerWidth", 10)
    //     .attr("markerHeight", 10)
    //     .attr("orient", "auto")
    //     .append("path")
    //         .attr("d", "M 0 0 L 10 5 L 0 10 z")
    //         .attr('fill', 'red');

    data.forEach((item, j) => {
      let attr = {
        // "marker-end":"url(#triangle)",
        'id':`${g.id}-${cfg.id}-${j}`,
        "d":dFcn(item),
        'fill':'none',
        ...vis.parseCfgStroke(sa, null, cfg.stroke)
      }
      attr.stroke = vis.parseCfgColor(attr.stroke, `${g.id}-${cfg.id}-0-gradient`, g, 0, 0, 0, -relKeys['bbox.h']);

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
          id:'default-id', frame:'frame-0', stroke:{width:1, color:"rgb(0,0,0,.5)", dash:'0'},
          continuous:false, curve:d3.curveLinear, legend:false
        }
  }
}
