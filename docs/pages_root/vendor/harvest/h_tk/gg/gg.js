'use strict'

/**
*  @fileOverview ggplot base class & dependencies.
*
*  @author       UNITED NATIONS
*  @author       BTA-AVT
*
*  @requires     HARVEST
*
*  @description Javascript based implementation of ggplot2 
* 
*  @see https://github.com/tidyverse/ggplot2/tree/master/R
* 
*  @example 
*  g = new H.gg(data, aes)
*  g.geom_point()
*  // ...
*  g.print("view_element") 
*/

//preload files needed for ggplot class
async function preload(){
  let preLoadFiles = [
    // "../../layouts2/libs/popper.js",
    // "../../layouts2/libs/tippy.js",
    // "../../layouts2/twod/core.js",
    // "../../layouts2/twod/sgs.js",
    // "../../layouts2/twod/guide.js",
    "./config/config.js",
  ]
  

  console.log('loading files needed for ggplot')
  let promises = preLoadFiles.map(d => import(d));
  await Promise.all(promises);
  console.log('ggplot dependencies loaded')
}

preload()

/**
 *  @classdesc ggplot() initializes a ggplot class instance. This can be intialised with global data and aesthetic mapping. 
 *  The instance will hold all user added geoms, scales and layers added after initialization. 
 *  On {@link print} a Hive (the Harvest Visualization engine) configuration is generated and instance created.
 * 
 *  @namespace ggplot
 * 
 *  @param {Array} data Data Frame
 *  @param {Object} aes Global Aesthetics
 * 
 */

H.gg = class {

  /** variable names starting with _ are intended for internal access only. */
  constructor(data, aes) {
    /** internal data variable  - should not be accessed directly by the user. */
    this._data = data || {}
    /** internal aesthetic variable  - should not be accessed directly by the user. */
    this._aes = aes || {}

    /** Empty Hive configuration object. This is filled when {@link print} is called*/
    this.config = {
      logLevel: "warn",
      name: 'graph',
      element: {},
      accessors: {},
      frames: [],
      data: [],
      draw: []
    }

    /** Each geom added creates a layer. All layers are held here before being merged using {@link merge} when {@link print} is called*/
    this._layers = {};
    /** Holds a single layer and is replaced each time a new layer is added. This allows for updating scales and themes after the initial geom call*/
    this._current_layer = {};

    /** holds items for the guides.*/
    this._guide = {
      accessors: {},
      frames: [],
      data: [],
      draw: []
    }

    /** holds accessors for use with themes */
    this._plot_accessors = {}

    /** Creates a H.Config instance that contains both the defaults for Hive and all ggplot based defaults. */
    this.defaults = new H.Config();

    /** Holds guides specification. */
    this._guide_config = this.defaults.ggplot.guides

    /** Holds Labels */
    this._labels = {
      title: null,
      subtitle: null,
      caption: null,
      tag: null,
      xlab: null,
      ylab: null
    }

  }

  /** Hive element specification. This is merged with the selector or object that is passed by the user through {@link print} */
  element(v) {
    let cfg = {
      renderer: {
        name: 'svg'
      },
      selector: "#visualization",
      exportName: "visualization",
      style: {},
      attrs: {},
      sizing: {
        width: 400,
        height: 400,
        keepAspect: false,
      }
    };

    v = H.Merge.deep(cfg, v);
    return v;
  };


  /** final call to merge all layers and call Hive */
  print(el) {
    if (typeof (el) == 'string') {
      this.config.element = this.element({ selector: el });
    }
    if (typeof (el) == 'object') {
      this.config.element = this.element(el);
    }

    let guide_position = [[50], [70, 30], [80, 50, 20]]

    //remove empty guides
    for (let key in this._guide_config) {
      if (typeof this._guide_config[key] == 'string' && this._guide_config[key].toLowerCase() == 'none') delete this._guide_config[key]
    }

    console.log('adding guides')
    console.log(this._guide_config)

    let guide_keys = Object.keys(this._guide_config)
    //create guides
    for (let index in Object.entries(this._guide_config)) {
      let key = guide_keys[index]
      if (typeof this._guide_config[key] == 'string') {
        this[`guide_${this._guide_config[key]}`]({ aes: key, position: guide_position[guide_keys.length - 1][index] })
      } else {
        //apply user settings
        let guide_type = Object.keys(this._guide_config[key])[0]
        this[guide_type]({ ...{ aes: key, position: guide_position[guide_keys.length - 1][index] }, ...this._guide_config[key][guide_type] })
      }
    }

    this._layers.guide = this._guide

    //check if theme has been set or use default
    if (!this.theme_settings) this.theme_gray()
    if (Object.keys(this.theme_settings).length != 0) {
      this.theme();
      this.merge(this.current_theme)
    }

    for (let i in this._layers) {

      // merge defaults for each draw object
      for (let x in this._layers[i].draw) {
        this._layers[i].draw[x] = H.Merge.deep(H.Clone.deep(this.defaults.vspec[this._layers[i].draw[x].name]), this._layers[i].draw[x])
      }

      this.merge(this._layers[i])
    }
    console.log(this.config)
    // console.log(JSON.stringify(this.config)) // print full output in JSON format
    return new H.Visualization(this.config)
  }


  /** Internal function for merging all layers into a Hive spec */
  merge(layer) {
    let mergeObjs = ['accessors', 'frames', 'data', 'draw'];
    mergeObjs.forEach((o, i) => {
      if (!layer[o]) return;
      if (Array.isArray(this.config[o]))
        this.config[o] = [...this.config[o], ...layer[o]];
      else
        this.config[o] = { ...this.config[o], ...layer[o] };
    });
  }

}

async function load() {

  let filePaths = [
    "./libs/ac-colors.min.js",
    "./R.js",
    "./aesthetics/aesthetics.js",
    "./coordinate-systems/coordinate-systems.js",
    "./facetting/facet-labels.js",
    "./facetting/facet-layouts.js",
    "./guides/guides.js",
    "./guides/keys.js",
    "./layers/annotations/annotations.js",
    "./layers/geoms/geoms.js",
    "./layers/layers.js",
    "./layers/position-adjustment/position-adjustment.js",
    "./layers/stats/stats.js",
    "./scales/alpha.js",
    "./scales/binning.js",
    "./scales/colour-brewer.js",
    "./scales/colour.js",
    "./scales/date-time.js",
    "./scales/discrete.js",
    "./scales/gradient.js",
    "./scales/identity.js",
    "./scales/labels.js",
    "./scales/limits.js",
    "./scales/line-patterns.js",
    "./scales/manual.js",
    "./scales/position.js",
    "./scales/scales.js",
    "./scales/shape.js",
    "./scales/size.js",
    "./scales/steps.js",
    "./scales/viridis.js",
    "./themes/elements.js",
    "./themes/modify.js",
    "./themes/theme-bw.js",
    "./themes/theme-classic.js",
    "./themes/theme-dark.js",
    "./themes/theme-gray.js",
    "./themes/theme-light.js",
    "./themes/theme-linedraw.js",
    "./themes/theme-minimal.js",
    "./themes/theme-void.js",
    "./themes/theme-test.js",
    "./themes/theme.js"
  ]

  console.log('loading additional ggplot functions')
  let promises = filePaths.map(d => import(d));
  await Promise.all(promises);
  console.log('ggplot function loading complete')
}

  //load additional files
  load()