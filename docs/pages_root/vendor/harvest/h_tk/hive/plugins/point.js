"use strict";

H.point = class {

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
    let complexKeys = ['x', 'y', 'size', 'shape', 'color', 'alpha', 'stroke.color', 'stroke.alpha']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, data);

    let jitter = gcf("jitter", cfg);

    data.forEach((item, j, d=data) => {
      let x = sa.x(item) + vis.getDrawWidth(sa.x(),Math.random()*jitter);
      let y = sa.y(item);

      if (isNaN(x) || isNaN(y)) {
        vis.warn(`Bad data: Line ${j} not wrangled properly.`)
        return;
      }

      // more symbols
      var sqrt3 = Math.sqrt(3);
      let extra = {
        diamondSquare: {
          draw: function(context, size) {
            var w = Math.sqrt(size);
            var d = w / 2 * Math.sqrt(2);

            context.moveTo(0, -d);
            context.lineTo(d, 0);
            context.lineTo(0, d);
            context.lineTo(-d, 0);
            context.closePath();
          }
        },
        triangleDn: {
          draw: function(context, size) {
            var y = -Math.sqrt(size / (sqrt3 * 3));
            context.moveTo(0, -y * 2);
            context.lineTo(-sqrt3 * y, y);
            context.lineTo(sqrt3 * y, y);
            context.closePath();
          }
        },
        Times: {
          draw: function(context, size) {
            var w = Math.sqrt(size);
            var d = w / 2 * Math.sqrt(2);

            context.moveTo(d, d);
            context.lineTo(-d, -d);
            context.moveTo(-d,d);
            context.lineTo(d,-d);
          }
        },
        Plus: {
          draw: function(context, size) {
            var w = Math.sqrt(size);
            var d = w / 2 * Math.sqrt(2);

            context.moveTo(d, 0);
            context.lineTo(-d, 0);
            context.moveTo(0,d);
            context.lineTo(0,-d);
          }
        }
      }

      let symbolNames = [
        'square open',
        'circle open',
        'triangle open',
        'plus',
        'cross',
        'diamond open',
        'triangle down open',
        'square cross',
        'asterisk',
        'diamond plus',
        'circle plus',
        'star',
        'box plus',
        'circle cross',
        'square triangle',
        'square',
        'circle',
        'triangle',
        'diamond',
        'circle',
        'bullet',
        'circle filled',
        'square filled',
        'diamond filled',
        'triangle filled',
      ]

      // GGPLOT: Square Circle Diamond TriangleDn Triangle Plus Times
      // https://ggplot2.tidyverse.org/articles/ggplot2-specs.html?q=points#point
      let symbolStack = [ // 25 base points
        ['Square'],
        ['Circle'],
        ['Triangle'],
        ['Plus'],
        ['Times'],
        ['diamondSquare'],
        ['TriangleDn'],
        ['Square', 'Times'],
        ['Plus', 'Times'],
        ['diamondSquare', 'Plus'],
        ['Circle', 'Plus'],
        ['Star'], //['TriangleDn', 'Triangle'],
        ['Square', 'Plus'],
        ['Circle', 'Plus'],
        ['Square', 'Triangle'],
        ['Square'],
        ['Circle'],
        ['Triangle'],
        ['diamondSquare'],
        ['Circle'],
        ['Circle'],
        ['Circle'],
        ['Square'],
        ['diamondSquare'],
        ['Triangle'],
      ];

      let shape = sa.shape(item);
      let sym;
      if (typeof(shape) == 'string') { // received string name instead
        sym = symbolStack[symbolNames.indexOf(shape)];
      } else {
        sym = symbolStack[shape];
      }


      let type;
      sym.forEach((s, i) => { // create composite symbols

        if (d3[`symbol${s}`])
          type = d3[`symbol${s}`]; // from d3
        else {
          type = extra[s]; // extra from above
        }

        var symbolGenerator = d3.symbol()
          .type(type)
          .size(sa.size(item)**2);

        let id = `${g.id}-${cfg.id}-${j}`
        let attr = {
          'id':id,
          "d":symbolGenerator(),
          "transform":`translate(${x} ${y})`,
          "fill":sa.color(item),
        ...vis.parseCfgFill(sa, item),
        ...vis.parseCfgStroke(sa, item, cfg.stroke)
        };

        vis.eventRegister(id, g.id, cfg.ev, {popup:{attr:attr, idx:j, title:cfg.title, data:data}});
        vis.createElement(attr, 'path', g);
      });

    });
  }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults() {
    return {
          id:'default-id', title:'point', frame:'frame-0', stroke:{width:1, color:"rgb(0,0,0,.5)"},
          color:"black", y:0, size:'5', shape:0, legend:false, jitter:0
        }
  }
}


H.bar = H.rectangle;
