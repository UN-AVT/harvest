/**
 *  Drawable element base class
 *  Integrates: configuration, Resize debouncing, import export for all renderers
 */

"use strict";

H.Element = class {
  #drawableObject;
  #eventDebounce;

  /**
  * Get defaults for the config frames section
  *
  * @param object The incomplete user specified cfg
  * @return a complete frames cfg
  */
  element(cfgNode) {

      this.eventDebounce = {resize:{delay:500}, scroll:{delay:500}}; //ms

      let drawableElement;
      // right now we just deal with canvas
      let element = document.querySelector(cfgNode.selector);
      element.style.position = 'relative';

      if (cfgNode.zoom) {// wheel handler
        element.addEventListener("wheel", function (event) {

          let ro = this.rendererObj.getSize(); // render obj w/h
          let delta = Math.sign(event.deltaY);

          this.viewBox[2] += delta * (ro.w * .1);
          this.viewBox[3] += delta * (ro.h * .1);
          // sanity check sizes
          if(this.viewBox[2]< ro.w*.1) this.viewBox[2] = ro.w*.1;
          if(this.viewBox[2]> ro.w) this.viewBox[2] = ro.w;
          if(this.viewBox[3]< ro.h*.1) this.viewBox[3] = ro.h*.1;
          if(this.viewBox[3]> ro.h) this.viewBox[3] = ro.h;

          this.pluginState.svg.setAttribute('viewBox', this.viewBox.join(' '));
          this.rendererObj.setViewBox(this.viewBox, this.pluginState.svg, this.events);

          event.preventDefault(); // don't scroll when in div
        }.bind(this), false);
      }

      if (cfgNode.drag){ // drag handler
        var dragHandler = d3.drag(event)
          .on("drag", function () {
            let ro = this.rendererObj.getSize();
            this.viewBox[0] -= d3.event.dx * (this.viewBox[2]/ro.w);
            this.viewBox[1] -= d3.event.dy * (this.viewBox[3]/ro.h);

            this.rendererObj.setViewBox(this.viewBox, this.pluginState.svg);
          }.bind(this));

        dragHandler(d3.select("#visualization"));
      }

      // style node
      if (cfgNode.style)
        Object.keys(cfgNode.style).forEach((item, i) => {
          element.style[item] = cfgNode.style[item];
        });

      // attrs node
      if (cfgNode.attrs)
        Object.keys(cfgNode.attrs).forEach((item, i) => {
          element[item] = cfgNode.attrs[item];
        });

      if (this.v.element.renderer.name == 'paperjs') {
        this.rendererObj = new H.renderer.paperjs(element, this.v.element);
      }

      if (this.v.element.renderer.name == 'svg') {
        this.drawableObject = element;
        this.rendererObj = new H.renderer.svg(element, this.v.element);
      }

      if (this.v.element.renderer.name == 'threesvg') {
        this.drawableObject = element;
        this.rendererObj = new H.renderer.threesvg(element, this.v.element);
      }

      if (this.v.element.renderer.name == 'three') {
        this.drawableObject = element;
        this.rendererObj = new H.renderer.three(element, this.v.element, this.v.onStateChange);
      }

      this.rendererObj.drawableElement._visualization = this; // save the instance for destroy

      // Do first render
      this.rendererObj.redraw(this.v.element);

      let eSize = this.rendererObj.getSize();
      this.viewBox = [0, 0, eSize.w, eSize.h];

      function resizeDebounce() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(this.rendererObj.redraw.bind(this.rendererObj), 40, this.v.element, this);
      }

      window.addEventListener('resize', resizeDebounce.bind(this), true);

  }

  /**
  * Get defaults for the config frames section
  *
  * @param object The incomplete user specified cfg
  * @return a complete frames cfg
  */
  resolveCfgElement(v) {
    let cfg = {
        selector:"#visualization",
        exportName:"visualization",
        renderer:{
          name:'paperjs',
          hidpi:false,
        },
        style: {},
        attrs: {},
        zoom:false,
        drag:false,
        sizing:{
          width: 800,
          height: 400,
          keepAspect: false,
        }
      };

    v = this.mergeDeep(cfg, v);
    return v;
  }

  /**
  * download a single svg
  *
  * @param object The svg element
  * @param string The svg name
  * @return a complete frames cfg
  */
  exportSvg(svgEl, name) {
    svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgEl.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = name;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  /**
  * Create a single svg for all objects in a container
  *
  * @return none
  */
  export() {
    let name = this.v.element.exportName?this.v.element.exportName:"vis"
    let composite;

    if (this.rendererObj.exportSVG) { // engine specific
      let svg = this.rendererObj.exportSVG(name);
      composite = d3.select(svg);
    } else { // generic output
      let content = [];
      d3.selectAll('#visualization > *').each(function(e){
        if (this._visualization)
          content.push(this._visualization.pluginState.svg)
      })

      composite = d3.create('svg').attr('viewBox', content[0].getAttribute('viewBox'));
      content.forEach((item, i) => {
        let nodes = d3.select(item).selectAll(':scope > clippath, :scope > g').clone(true).nodes(); // toplevel children
        nodes.forEach((e, i) => {
          composite.append(d=>e);
        });
      });
    }
    this.log('Export:', composite.node())
    // download it
    this.exportSvg(composite.node(), name + '.svg');
    //H.Output_Img.to_svg(composite.node(), name + '.svg')

  }
}
