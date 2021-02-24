"use strict";

H.popup = class {

  /**
  * Sets up the popup infrastructure
  *
  * @param object The render object
  * @param string The containing element selector
  * @param object The events list
  * @param object The cfg object
  * @return none
  */
  constructor(rObj, selector, events, cfg) {
    let sel = document.querySelector(selector);
    this.events = events;
    this.rendererObj = rObj;
    this.element = rObj.getSize();
    // To set tippy popup coords
    //if (oldPD) oldPD.remove();
    this.PopupElement = document.createElement('div');
    this.PopupElement.style.width = '0px';
    this.PopupElement.style.height = '0px';
    // this.PopupElement.style['background-color'] = 'blue'
    // this.PopupElement.style['z-index'] = '5'
    let oldPD = document.querySelector(selector + ' #popupDiv'); // remove old div
    if(oldPD) {
      if (oldPD._tippy) oldPD._tippy.destroy();
      oldPD.remove();
    }

    this.PopupElement.setAttribute('id', 'popupDiv');

    this.PopupElement.style.position = 'absolute';
    sel.appendChild(this.PopupElement);

    let props = cfg.props?cfg.props:{};
    if (tippy) {
      this.popup = {obj:tippy(this.PopupElement, {
        trigger:'manual',
        hideOnClick: true,
        allowHTML: true,
        ...props
      })}  // , contentHandler:this.popupContentHandler
    } else {
      console.warn('Can not init Tippy popup libs.')
    }
  }


  /**
  * Sets up a specific popup data
  *
  * @param object Cfg event attributes
  * @return popup data
  */
  register(cfg) {
    // let top, left;

    // position the relative div the w attached popup
    // if (cfg.rk['rotate'] == 0) {
    //   top = this.element.h-cfg.rk["translate.y"]+cfg.y+(cfg.rk["bbox.h"]/2);
    //   left = cfg.x+cfg.rk["translate.x"]-(cfg.rk["bbox.w"]/2);
    // }
    // if (cfg.rk['rotate'] == 90) {
    //   top = cfg.rk["translate.y"] - (cfg.rk["bbox.w"]/2) + cfg.x;
    //   left = cfg.rk["translate.x"] - (cfg.rk["bbox.h"]/2) - cfg.y;
    // }
    // if (cfg.rk['rotate'] == 180) {
    //   top = - (-this.element.h + (this.element.h-cfg.rk["translate.y"]+cfg.y+(cfg.rk["bbox.h"]/2)));
    //   left = (this.element.w - (cfg.x+cfg.rk["translate.x"]-(cfg.rk["bbox.w"]/2)));
    // }
    // if (cfg.rk['rotate'] == 270) {
    //   top = cfg.rk["translate.y"] + (cfg.rk["bbox.w"]/2) - cfg.x;
    //   left = cfg.rk["translate.x"] + (cfg.rk["bbox.h"]/2) + cfg.y;
    // }

    let attr = cfg.attr || {fill:undefined};
    return {color:attr.fill, idx:cfg.idx, title:cfg.title, data:cfg.data};
  }

  /**
  * Sets up a popup color swatch
  *
  * @param string color
  * @return div element string
  */
  static getColorDiv(c) {
    let rv = '';
    if (c)
      rv = `<div class='popupColor' style="height:15; width:15; background-color:${c}; display:inline-block; margin-right:5px; border-radius:20%; vertical-align:middle;"></div>`;
    return rv;
  }

  /**
  * Sets popup content for all keys in d with color for each
  *
  * @param object data
  * @return popup content
  */
  static formatLong(d) {
    let rv = ''
    let keys = Object.keys(d.data);
    let title = d.title.length>0?d.title+'<br>':'';
    let cDiv = H.popup.getColorDiv(d.color);
    keys.forEach((item, i) => {
      rv += cDiv + `${item}: ${d.data[item]}${i==keys.length-1?'':'<br>'}`
    });
    return title + rv;
  }

  /**
  * Sets popup content for all keys in d with color in title
  *
  * @param object data
  * @return popup content
  */
  static formatLongTitleColor(d) {
    let rv = ''
    let keys = Object.keys(d.data);
    let title = d.title.length>0?d.title+'<br>':'';
    let cDiv = H.popup.getColorDiv(d.color);
    keys.forEach((item, i) => {
      rv += `${item}: ${d.data[item]}${i==keys.length-1?'':'<br>'}`
    });
    return cDiv + title + rv;
  }

  /**
  * Sets popup content for all keys in d of a specific title with color for each
  *
  * @param object data
  * @return popup content
  */
  static formatWide(d) {
    let rv = ''
    let dNest = d3.nest().key(k => k.title).object(d);
    let keys = Object.keys(dNest);
    keys.forEach((item, i) => {
      rv += item.length>0?item+'<br>':'';
      dNest[item].forEach((item, i) => {
        let cDiv = H.popup.getColorDiv(item.color);
        let line = Object.keys(item.data).map((d, i) => `${d}: ${item.data[d]}`).join(', ');
        rv += cDiv + line + ((i==d.length-1)?'':'<br>');
      });
    });

    return rv;
  }

  /**
  * Deals with messages from pubsub (usually mouse events which show a popup)
  *
  * @param object Element which triggered the message
  * @param object Event data
  * @return none
  */
  pubsubHandler(e, d) {
    let evData = d;
    let evNest = d3.nest().key(k=>k.ev.group).key(k=>k.idx).object(this.events);
    let popupData = [];
    let content = '';

    if (! evNest[e][d.e.idx]) return; // nothing to do

    evNest[e][d.e.idx].forEach((item, i) => {
      let vals = {};
      if (item.ev[evData.type] && item.ev[evData.type].popup && item.ev[evData.type].popup.vals){
        item.ev[evData.type].popup.vals.forEach(d => {vals[d] = item.data[item.idx][d]});
      } else
        vals = item.data[item.idx];
      popupData.push({title:item.title, color:item.color, data:vals});
    });

    let eCfg = d.e.ev[d.type]; // event config
    if (popupData.length == 1) {
      this.popup.obj.setProps({arrow: true});
      if (eCfg && eCfg.popup && eCfg.popup.handler)
        content = eCfg.popup.handler(popupData[0]);
      else
        content = H.popup.formatLong(popupData[0]);
    } else {
      this.popup.obj.setProps({arrow: false});
      if (eCfg && eCfg.popup && eCfg.popup.handler)
        content = eCfg.popup.handler(popupData);
      else
        content = H.popup.formatWide(popupData);
    }

    if (d.type != 'onMouseLeave') {

      let selected = evNest[e][d.e.idx];
      let objPos = this.rendererObj.getPosition(selected[0].groupId, selected[0].elId, true);

      // if multiple observations, set y to be avg
      let yArr = selected.map(d => this.rendererObj.getPosition(d.groupId, d.elId, true).top);
      let yAvg = d3.mean(d3.extent(yArr));

      this.PopupElement.style.top = yAvg;
      this.PopupElement.style.left = objPos.left;

      this.popup.obj.setContent(content);
      this.popup.obj.show();
    } else
      this.popup.obj.hide();

  }

}
