"use strict";

H.violin = class {

  static violin() {
    let dFcn = d3.area();
    let band = d => 0;
    let bandwidth = d => 10;

    let gen = function(d){
      return dFcn(d);
    }

    // inherit all methods
    let methods = Object.keys(dFcn);
    methods.forEach((m, i) => {
      gen[m] = function(d){
        dFcn[m](d);
        return(this);
      }
    });

    gen.area_x = dFcn.x;

    // redefine x
    gen.x = function(d){
      if (d) {
        dFcn.x0((e) => ( (bandwidth(d(e))/2) + band(e)));
        dFcn.x1((e) => (-(bandwidth(d(e))/2) + band(e)));

        return this;
      } else return([dFcn.x0(),dFcn.x1()]);
    }

    gen.band = function(d){
      if (d) {
        band = d;
        return this;
      } else return band;
    }

    gen.bandwidth = function(d){
      if (d) {
        bandwidth = d;
        return this;
      } else return bandwidth;
    }

    return(gen);
  }

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

    let dFcn = this.violin();
    let shapeKeys = Object.keys(dFcn);

    let data = vis.getData(cfg)
    if (!(Array.isArray(data[0]))) data = [data];

    let complexKeys = [...shapeKeys, 'color', 'alpha', 'stroke.color', 'stroke.alpha']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    shapeKeys.forEach((k, i) => {
      if(sa[k]) {
        if(["x", "x0", "x1", "y", "y0", "y1", "band", "curve"].includes(k))
          dFcn = dFcn[k](sa[k]); // functions
        else
          dFcn = dFcn[k](sa[k]()); // attributes
      }
    });

    dFcn.bandwidth(d=>vis.getDrawWidth(sa.band(), d)); // violin width

    data.forEach((item, j) => {
      let attr = {
        'id':`${g.id}-${cfg.id}-${j}`,
        "d":dFcn(item),
        ...vis.parseCfgFill(sa, item[0]),
        ...vis.parseCfgStroke(sa, item[0], cfg.stroke)
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
          id:'default-id', frame:'frame-0', stroke:{width:0, color:"rgb(0,0,0,.5)"}
        }
  }

}
