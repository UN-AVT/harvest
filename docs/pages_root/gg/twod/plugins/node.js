"use strict";

H.node = class {

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
    let complexKeys = ['x', 'y', 'size', 'sym', 'color', 'alpha']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    let imgDict = {};
    data.forEach((item, j) => {

      let x = sa.x(item);
      let y = sa.y(item);
      let sym = sa.sym(item);
      let sz = sa.size(item);

      if (!(sym in imgDict)){
        var request = new XMLHttpRequest();
          request.open('GET', cfg.path+sym+'.svg', false);  // `false` makes the request synchronous
          request.send(null);
          imgDict[sym] = request.status===200?request.responseXML.rootElement:null;
      }

      let id = `${g.id}-${cfg.id}-${j}`;
      if (imgDict[sym] != null){

        let e = imgDict[sym].cloneNode(true);
        d3.select(e).selectAll('*').attr('data-svgid',id) // for popups

        let vb = e.getAttribute("viewBox").split(' ');
        let vw = vb[2];
        let vh = vb[3];
        let h = (sz/vw) * vh;

        // Importing svgs within svgs yields inconsistent results.
        // So, create a new group and append transformed children of svg.
        let attr = {
          id:id,
          transform:`translate(${x-(sz/2)} ${y-(sz/2)}) scale(${sz/vw})`,
        };
        let locGrp = vis.createElement(attr, 'g', g);
        locGrp.append(...e.childNodes)

        vis.eventRegister(id, g.id, cfg.ev, {popup:{idx:j, title:cfg.title, data:data}});

        g.appendChild(locGrp);
      }
    });
  }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults() {
    return {id:'default-id', title:'node', frame:'frame-0', color:"black", y:0, size:'15', path:'/nopath/', sym:'noimg'}
  }
}
