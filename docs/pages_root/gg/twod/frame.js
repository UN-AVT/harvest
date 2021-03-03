"use strict";

H.Frame = class {
  constructor () {
    this.framesList = {};
  }

  /**
  * Get defaults for the config frames section
  *
  * @param object The incomplete user specified cfg
  * @return a complete frames cfg
  */
  resolveCfgFrames(v) {
    let cfg = {"name":"frame-0","translate":{"x":"50%","y":"50%"},"bbox":{"h":"80%","w":"80%"},"rotate":0,"mirror":false,'crop':true};

    if (v.length == 0) {
      v.push(cfg);
    } else {
      v = v.map((frame, i) => {
        cfg = JSON.parse(JSON.stringify(cfg));
        return this.mergeDeep(cfg, frame)
      });
    }

    return v;
  }

  /**
  * Parses the frames array
  *
  * @param array Frames array
  * @return none
  */
  frames(cfg) {
    cfg.forEach((c, i) => {
      let eSize = this.rendererObj.getSize();
      let w = eSize.w;
      let h = eSize.h;
      let mainKeys = [['bbox.w', w], ['bbox.h', h],
                      ['translate.x', w], ['translate.y', h]];
      let mainRel = this.getRelative(mainKeys, c);
      if (c.rotate%180 == 90){
        let bucket = mainRel['bbox.w'];
        mainRel['bbox.w'] = mainRel['bbox.h'];
        mainRel['bbox.h'] = bucket;
      }
      let extraKeys = [['origin.w', mainRel['bbox.w']], ['origin.h', mainRel['bbox.h']]]
      let extraRel = this.getRelative(extraKeys, c);

      this.framesList[c.name] = {...mainRel, ...extraRel, rotate:c.rotate, mirror:c.mirror, crop:c.crop};
    });
  }
}
