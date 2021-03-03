"use strict";

H.axis = class {

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

    g.setAttribute('data-renderopts', cfg.renderopts)

    let sa = vis.getScaledAccessors(relKeys, ['scale'], cfg, null);
    let bw = sa.scale().bandwidth?sa.scale().bandwidth()/2:0;  // scaled are offset for some reason
    let pad = cfg.padding;
    let cvt = {
      top:    {name:'axisTop', rev:'axisBottom', pad:`translate(${-bw},${-pad})` , xlate:`translate(0, ${-relKeys['bbox.h']})`, gLen:relKeys['bbox.h']},
      bottom: {name:'axisBottom', rev:'axisTop', pad:`translate(${-bw},${pad})`, xlate:`translate(0, 0)`, gLen:relKeys['bbox.h']},
      left:   {name:'axisLeft', rev:'axisRight', pad:`translate(${-pad},${-bw})`, xlate:`translate(0, 0)`, gLen:relKeys['bbox.w']},
      right:  {name:'axisRight', rev:'axisLeft', pad:`translate(${pad},${-bw})`, xlate:`translate(${relKeys['bbox.w']}, 0)`, gLen:relKeys['bbox.w']},
    }
    let info = cvt[cfg.orientation];

    let axisGen = d3[info.name]().scale(sa.scale());
    axisGen.tickPadding(cfg.ticks.padding);

    if (typeof(cfg.contentHandler) == 'function')
      axisGen.tickFormat(cfg.contentHandler);

    if (cfg.ticks.qty)
      axisGen.ticks(cfg.ticks.qty);

    let font = cfg.ticks.font;
    d3.select(g).call(axisGen)
      .selectAll('text')
      .attr('fill', font.color)
      .attr('font-size', font.size)
      .attr('font-family', font.family)
      .attr('font-weight', font.weight)
      .attr('font-style', font.style)
      .attr('transform',`rotate(${cfg.ticks.rotate})`);

    d3.select(g).selectAll('*').each(function (d,i){
      let id = `${g.id}-${cfg.id}-${i}`;
      let e = d3.select(this).attr('id', id);
    });

    d3.select(g).selectAll('.domain')
      .attr('stroke', cfg.dbar.stroke.color)
      .attr('stroke-width', cfg.dbar.stroke.width);

    d3.select(g).selectAll('.tick > line')
      .attr('stroke', cfg.ticks.stroke.color)
      .attr('stroke-width', cfg.ticks.stroke.width);

    d3.select(g).selectAll('.tick > text').attr('stroke-width', '0')
    if (cfg.ticks.textAnchor)
      d3.select(g).selectAll('.tick > text').attr('text-anchor', cfg.ticks.textAnchor)

    if (!(vis.generated.axis)) vis.generated.axis={}
    if (!(vis.generated.axis[cfg.orientation])) vis.generated.axis[cfg.orientation]={}
    vis.generated.axis[cfg.orientation].bandwidth = sa.scale().bandwidth?sa.scale().bandwidth():0

    // wrap text
    let ttw = cfg.ticks.textWrap;
    if (sa.scale().bandwidth && ttw) {
      ttw = ttw=='auto'?(sa.scale().bandwidth())*.9:ttw;
      d3.select(g).selectAll(".tick text")
        .call(vis.wrap.bind(vis), ttw, font.family, font.size, cfg.orientation); //sa.scale().bandwidth() .rangeBand() ??
    }

    // add padding
    d3.select(g).selectAll('g, path')
      .attr('transform', (d,i,e)=>{
        let x = e[i].getAttribute('transform');
        return (x?(x + " "):"") + info.xlate + ' ' + info.pad;
      });

    // add grid
    let gridg = vis.createElement({id:'grid'}, 'g', g);
    if(cfg.gridColor) {
      let gridGen = d3[info.rev]().scale(sa.scale());//cfg.orientation
      gridGen.ticks(cfg.ticks.qty);
      gridGen.tickFormat('');
      gridGen.tickSize(info.gLen)

      d3.select(gridg).call(gridGen)
        .selectAll('#grid > .tick > line')
        .attr('stroke', cfg.gridColor);
      d3.select(gridg).selectAll('path').remove();
      d3.select(gridg).selectAll('g')
        .attr('transform', (d,i,e)=>{
        let x = e[i].getAttribute('transform');
        return (x?(x + " "):"") + info.xlate;
      });
    }
  }

  // static wrap(text, width, fFamily, fSize, wFcn) {
  //   text.each(function() {
  //     let texts = [];
  //     var text = d3.select(this),
  //         words = text.text().split(/\s+/).reverse(),
  //         word,
  //         line = [],
  //         lineNumber = 0,
  //         lineHeight = 1.1,
  //         y = text.attr("y"),
  //         dy = parseFloat(text.attr("dy"))
  //     let subText = text.text(null).clone();
  //     texts.push(subText);
  //     let idx = 1;
  //     while (word = words.pop()) {
  //       line.push(word);
  //       let delta = subText.attr('font-size')// dy;
  //       subText.text(line.join(" "));
  //       // if (subText.node().innerText.length > width && line.length > 1) { // .getComputedTextLength()
  //       if (wFcn(subText.node().innerText, fFamily, fSize) > width && line.length > 1) { // .getComputedTextLength()
  //         line.pop();
  //         subText.text(line.join(" "));
  //         line = [word];
  //         subText = subText.clone().text(word).attr('dy', (a,b,c) => `${delta*idx}`); // .attr("dy", ++lineNumber * lineHeight + dy + "em")
  //         texts.push(subText);
  //         idx++;
  //       }
  //     }
  //     // move the text
  //     texts.forEach((item, i) => {
  //       item.attr('transform', (d,e,f) => {
  //         let tf = f[0].getAttribute('transform');
  //         tf = tf==null?'':(tf+' ');
  //         return `${tf}translate(0 ${-fSize*(idx-1)})`;
  //       });
  //     });
  //   });
  // }
  //
  // // this is how it should be done.
  // // Save it for when paperjs fixes:  "<tspan> ignored on SVG import. #1864"
  // static CORRECTwrap(text, width) {
  // text.each(function() {
  //   var text = d3.select(this),
  //       words = text.text().split(/\s+/).reverse(),
  //       word,
  //       line = [],
  //       lineNumber = 0,
  //       lineHeight = 1.1,
  //       y = text.attr("y"),
  //       dy = parseFloat(text.attr("dy")),
  //       tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
  //   while (word = words.pop()) {
  //     line.push(word);
  //     tspan.text(line.join(" "));
  //     if (tspan.node().innerText.length > width) { // .getComputedTextLength()
  //       line.pop();
  //       tspan.text(line.join(" "));
  //       line = [word];
  //       tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
  //     }
  //   }
  //   });
  // }

  /**
  * Gets the defaults for this plugin
  *
  * @return An object with the defaults
  */
  static getDefaults() {
    return {
            padding:8, frame:'frame-0', orientation:'bottom',
            ticks:{font:{color:'#333', family:"Roboto", size:10, style:"normal"}, stroke:{width:1, color:"rgb(0,0,0)"}, rotate:0, padding:8, textWrap:'auto'},
            dbar:{stroke:{width:1, color:"rgb(0,0,0)"}}, renderopts:"norotate nomirror"
          }
  }

}
