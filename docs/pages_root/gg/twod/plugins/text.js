"use strict";

// vis is a poor fix that results from two problems:
// - You can't get a bounding box on svg text which isn't in the DOM
// - Paper does not honor svg rotate origin on importSVG
H.text = class {

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

    let complexKeys = ['color', 'font.color']; // keys which take numbers, col names, or scale names
    let sa = vis.getScaledAccessors(relKeys, complexKeys, cfg, null);
    g.setAttribute('data-renderopts', cfg.renderopts)

    let pKeys = vis.getRelative([['pos.x', relKeys['bbox.w']], ['pos.y', relKeys['bbox.h']]], cfg);

    let pos = [pKeys["pos.x"], -pKeys["pos.y"]];
    let font = cfg.font;
    let r = cfg.rotate;
    let ta = cfg.textAnchor;

    let attr = {
      id:`${g.id}-${cfg.id}-0`,
      fill:sa['font.color'](null),
      x:pos[0],
      y:pos[1],
      'font-family':font.family,
      'font-size':font.size,
      'font-weight':font.weight, 'font-style':font.style,
      'text-anchor':ta,
      'transform':`translate(${cfg.offset.x} ${cfg.offset.y}) rotate(${r} ${pos[0]},${pos[1]})`,
    }
    let text = vis.createElement(attr, "text", g);
    text.textContent = cfg.content;

  }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults() {
    return {
          content:"Default Text", frame:'frame-0',
          font:{color:'#333', family:"Roboto", size:16, weight:400, style:"normal"},
          color:"black", rotate:0, pos:{x:'50%', y:'90%'}, textAnchor:"middle", offset:{x:0, y:0}, renderopts:"norotate nomirror"
        }
  }
}
