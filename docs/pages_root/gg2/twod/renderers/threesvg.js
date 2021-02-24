"use strict";

import * as THREE from '../../libs/three.js/build/three.module.js';
import { SVGRenderer, SVGObject } from '../../libs/three.js/examples/jsm/renderers/SVGRenderer.js';
import { OrbitControls } from '../../libs/three.js/examples/jsm/controls/OrbitControls.js';
// import { TransformControls } from '../../libs/three.js/examples/jsm/controls/TransformControls.js';
// import { TrackballControls } from '../../libs/three.js/examples/jsm/controls/TrackballControls.js';

H.renderer.threesvg = class {

  /**
  * Sets up the container & renderer
  *
  * @param object The container element
  * @param object The element config
  * @return a complete draw cfg
  */
  constructor(element, cfg) {
    this.element = element;
    this.eCfg = cfg;
    this.drawableElement = {};

    this.w = cfg.sizing.width;
    this.h = cfg.sizing.height;
    this.initThree();
  }

  initThree() {
    this.camera = new THREE.PerspectiveCamera( 75, this.eCfg.sizing.width/this.eCfg.sizing.height, 1, 10000 );
    this.setProperties('camera');

		this.scene = new THREE.Scene();
    this.setProperties('scene');

    // lights don't affect the svg renderer
		// let ambient = new THREE.AmbientLight( 0x80ffff );
		// this.scene.add( ambient );
    //
		// var directional = new THREE.DirectionalLight( 0xffff00 );
		// directional.position.set( - 1, 0.5, 0 );
		// this.scene.add( directional );

		this.renderer = new SVGRenderer();
		this.renderer.setSize( this.eCfg.sizing.width, this.eCfg.sizing.height);
    this.setProperties('renderer');

    this.element.appendChild(this.renderer.domElement);

    // this.controls = new TransformControls( this.camera, this.renderer.domElement );
    // this.controls.dragToLook = true;
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
		this.setProperties('controls')
  }

  setProperties(key){
    if (this.eCfg.renderer[key]) {
      Object.keys(this.eCfg.renderer[key]).forEach((item, i) => {
        let root = this[key];
        let keys = item.split('.');
        let max = keys.length-1;
        keys.forEach((k, i) => {
          if (i != max)
            root = root[k]
        });
        root[keys[max]] = this.eCfg.renderer[key][item];
      });
    }
    if(this[key].update) this[key].update();
  }

  /**
  * Render a given svg with associated events
  *
  * @param object SVG to render
  * @param object Events list
  * @return The groups to subscribe to
  */
  render(svg, events) {
    // let prevSvg = document.querySelector(`${this.eCfg.selector} svg`);
    // if (prevSvg) prevSvg.remove();

    svg._visualization = this.drawableElement._visualization;
    this.drawableElement = svg;
    d3.select(svg).selectAll('path').attr('vector-effect', 'non-scaling-stroke'); // for zoom

    svg.style.top = '0px';
    svg.style.left = '0px';
    svg.style.position = 'absolute';

    // Parse/Add Objects
    var node = document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );

    node.appendChild(svg)
    this.object = new SVGObject(node);
    this.setProperties('object');

		this.scene.add(this.object);

    // this.controls.target = this.object.position
    // this.controls.update()

    // TransformControls
    // this.controls.attach( this.object );
    // this.scene.add( this.controls );
    this.threerender() // create the svg
    return this.attachEvents(svg, events);
  }

	animate() {
		requestAnimationFrame( this.animate.bind(this) );
		this.threerender();
	}

	threerender() {
    let zoom = 1000; // set limits
    if (this.camera.position.z < zoom/10) this.camera.position.z = zoom/10;
    if (this.camera.position.z > zoom*2) this.camera.position.z = zoom*2;

		this.renderer.render( this.scene, this.camera );

    let tf = this.object.node.getAttribute('transform') // make the node respond to orbit zoom
    let d = this.camera.position.distanceTo(this.object.position)
    this.object.node.setAttribute('transform', `${tf} scale(${(zoom*2)/d})`)
	}

  /**
  * Attach events to various elements
  *
  * @param object Group of Elements
  * @param object Events list
  * @return The groups to subscribe to
  */
  attachEvents(group, events) {
    let evTypes = ['onClick','onMouseEnter','onMouseLeave'];
    let eventSubscriptions = [];

    events.forEach((e, i) => {
      let item = d3.select(`${this.eCfg.selector} > svg  #${e.groupId} > #${e.elId}`);

      evTypes.forEach((evt, i) => {
        if (!(e.ev[evt])) return; // if the element event cfg does not include eventtype
        if (e.ev.group)
          eventSubscriptions.push(e.ev.group);

        let d3event = evt.substring(2).toLowerCase();
        item.on(d3event, () => {         // init handler
          if (e.ev.group)
            H.Emitter.PubSub.publish(e.ev.group, {type:evt, e:e});
          if (e.ev[evt].element)
            this.on(item, evt, e.ev[evt].element); // paperjs .getFillColor does not work, so provide it.
          if (e.ev[evt].handler)
            e.ev[evt].handler(item, evt);
        });
      });

      if (item.on('mouseenter') && !(item.on('mouseleave'))){  // if enter was set, do leave
        item.on('mouseleave', () => {
          this.on(item, 'onMouseLeave', {})
          H.Emitter.PubSub.publish(e.ev.group, {type:'onMouseLeave', e:e});
        });
      }
    });

    return eventSubscriptions;
  }

  /**
  * element event handler
  *
  * @param object The element
  * @param object Events cfg object
  * @param object Events data object
  * @return none
  */
  on(el, ev, evData) {

    if (ev == 'onClick'){
      el.attr('data-clicked', !el.attr('data-clicked'));

      if (evData.color){
        if (el.attr('data-clicked') == true) {
          el.style('fill', evData.color);
        } else {
          el.style('fill', '');
        }
      }

      if (evData.opacity){
        if (el.attr('data-clicked') == true) {
        el.style('opacity', evData.opacity);
        } else {
          el.style('opacity', '');
        }
      }

      if (evData.scale){
        if (el.attr('data-clicked') == true) {
          el.style('transform', el.style('transform') + ` scale(${evData.scale})`);
        } else {
          el.style('transform', '');
        }
      }
    }

    if (ev == 'onMouseLeave' || el.attr('data-mouseEnter')){
      if (el.attr('data-mouseEnter'))  {
        el.attr('data-mouseEnter', false);
        el.style('fill', '');
        el.style('opacity', '');
        el.style('transform', '');
      }
    }

    if (ev == 'onMouseEnter'){
      el.attr('data-mouseEnter', true);
      if (evData.color){
        el.style('fill', evData.color);  // paper can't handle rgb(x,y,z)
      }
      if (evData.opacity){
        el.style('opacity', evData.opacity);  // paper can't handle %
      }
      if (evData.scale){
        el.style('transform', el.style('transform') + ` scale(${evData.scale})`);
      }
    }
  }

  /**
  * set relative position of object by group and element id
  *
  * @param string The group id
  * @param string The element id
  * @param boolean Whether or not to find the alternative positions
  * @return the element location
  */
  getPosition(gid, eid, findAlt){
    let container = document.querySelector(`${this.eCfg.selector} > svg`).getBoundingClientRect();
    let e = document.querySelector(`${this.eCfg.selector} > svg  #${gid} > #${eid}`).getBoundingClientRect();
    if (findAlt){
      let eAlt = document.querySelector(`${this.eCfg.selector} > svg  #${gid} > #${eid}-alt`)
      if (eAlt) eAlt = eAlt.getBoundingClientRect();
      if (eAlt) e = eAlt;
    }
    return {left:(e.left-container.left)+(e.width/2), top:(e.top-container.top)+(e.height/2)};
  }

  /**
  * set viewbox for panning/zooming
  *
  * @param array Viewbox settings
  * @param object The element
  * @param boolean Whether or not to find the alternative positions
  * @return none
  */
  setViewBox(vb, svg){

    svg.setAttribute('viewBox', vb.join(' '));
  }

  /**
  * Gets length of rendered text
  *
  * @param string Text to use
  * @param string Font family name
  * @param number point size
  * @return Text length in px
  */
  getTextWidth(text, font, size)  {
    let e = d3.select(this.element)
      .append('svg').attr('id', 'textMeasureContainer')
      .append('text').attr('font-family', font).attr('font-size', size).text(text);
    let len = e.node().getComputedTextLength();
    d3.select(this.element).select('#textMeasureContainer').remove();

    return len;
  }

  /**
  * Gets current of drawable
  *
  * @return Drawable width / height
  */
  getSize(){
    return {w:this.w, h:this.h}
  }

  /**
  * Re-rendering function
  *
  * @param object The element cfg
  * @param object The Visualization object
  * @return none
  */
  redraw(cfg, vis) {
    let w = cfg.sizing.width;
    let h = cfg.sizing.height;

    if (cfg.sizing.keepAspect) {
      let parentBBox = this.element.getBoundingClientRect();
      // let parentBBox = this.drawableElement.parentElement.getBoundingClientRect();
      let calcW = parentBBox.height * (w/h);
      let calcH = parentBBox.width * (h/w);

      if (calcW > parentBBox.width) {
        w = parentBBox.width;
        h = calcH;
      } else {
        w = calcW
        h = parentBBox.height;
      }
    }

    this.w = w;
    this.h = h;

    if (vis && cfg.sizing.keepAspect) {
      vis.frames(vis.v.frames); // recalc frame sizes
      vis.draw(vis.v.draw);  // redraw
    }
  }
}
