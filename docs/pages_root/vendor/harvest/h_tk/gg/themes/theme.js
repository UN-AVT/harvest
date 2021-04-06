H.gg.prototype.theme = function (options = {}) {

    if (this.theme_settings == {} || this.theme_settings == null) this.theme_gray()

    this.theme_settings = H.Merge.deep(H.Clone.deep(this.theme_settings), options)

    let full_settings = H.Clone.deep(this.defaults.ggplot.theme)

    let theme_settings_fill = (obj, setting) => {
        for (let key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null && Object.keys(obj[key]).length > 0) {
                obj[key] = theme_settings_fill(obj[key], setting)
            } else {
                obj[key] = setting
            }
        }

        return obj
    }

    let theme_setting_traverse = (options, full) => {
        for (let key in options) {
            if (typeof options[key] === 'object' && options[key] !== null && Object.keys(options[key]).length > 0) {
                if (full.hasOwnProperty(key) && full[key] !== null) {
                    if (!Object.keys(full[key]).includes(Object.keys(options[key])[0])) {
                        full[key] = theme_settings_fill(full[key], options[key])
                    } else {
                        theme_setting_traverse(options[key], full[key])
                    }
                } else {
                    full[key] = options[key]
                }
            } else {
                if (typeof full[key] === 'object' && full[key] !== null && Object.keys(full[key]).length > 0) {
                    full[key] = theme_settings_fill(full[key], options[key])
                } else if (full[key] !== undefined) {
                    full[key] = options[key]
                }
            }
        }
    }

    theme_setting_traverse(this.theme_settings, full_settings)

    this.theme_settings = full_settings

    let l = this.current_theme = {
        name: 'theme',
        data: [],
        accessors: {},
        frames: [],
        draw: []
    }

    // background data
    l.data.push({ name: 'bg_data', content: [{ bgX: 0, bgY: 100 }, { bgX: 100, bgY: 100 }] })

    l.accessors.bgX = { domain: [0, 100], type: 'linear', range: 'width' },
        l.accessors.bgY = { domain: [0, 100], type: 'linear', range: '-height' }

    // if (options.aspect.ratio) this.element.sizing.height = this.element.sizing.width / options.aspect.ratio
    for (let frame in this._current_layer.frames) {
        if (this._current_layer.frames[frame].plot == true) {
            let axis = { name: 'axis', frame: this._current_layer.frames[frame].name, ticks: { font: {}, stroke: {} }, font: {}, dbar: { stroke: {}, rotate: null, textAnchor: null, textWrap: null } }

            //create flipped axis scales
            if (this._current_layer.options.rotate == 90) {
                this._current_layer.accessors[`${this._current_layer.name}-x-axis`] = H.Clone.deep(this._current_layer.accessors[`${this._current_layer.name}-y`])
                this._current_layer.accessors[`${this._current_layer.name}-y-axis`] = H.Clone.deep(this._current_layer.accessors[`${this._current_layer.name}-x`])
                this._current_layer.accessors[`${this._current_layer.name}-y-axis`].range = '-height'
                this._current_layer.accessors[`${this._current_layer.name}-x-axis`].range = 'width'
            }

            let bottom_axis = H.Clone.deep(axis)
            bottom_axis.orientation = 'bottom'
            bottom_axis.scale = this._current_layer.options.rotate != 90 ? `${this._current_layer.name}-x` : `${this._current_layer.name}-x-axis`

            let top_axis = H.Clone.deep(axis)
            top_axis.orientation = 'top'
            top_axis.scale = this._current_layer.options.rotate != 90 ? `${this._current_layer.name}-x` : `${this._current_layer.name}-x-axis`

            let left_axis = H.Clone.deep(axis)
            left_axis.orientation = 'left'
            left_axis.scale = this._current_layer.options.rotate != 90 ? `${this._current_layer.name}-y` : `${this._current_layer.name}-y-axis`

            let right_axis = H.Clone.deep(axis)
            right_axis.orientation = 'right'
            right_axis.scale = this._current_layer.options.rotate != 90 ? `${this._current_layer.name}-y` : `${this._current_layer.name}-y-axis`

            // axis padding
            if (this.theme_settings.panel.spacing.x !== null) {
                bottom_axis.padding = this.theme_settings.panel.spacing.x
                top_axis.padding = this.theme_settings.panel.spacing.x
            }
            if (this.theme_settings.panel.spacing.y != null) {
                left_axis.padding = this.theme_settings.panel.spacing.y
                right_axis.padding = this.theme_settings.panel.spacing.y
            }

            // axis styling (labels?)
            if (this.theme_settings.axis.text.x.top !== null) top_axis.ticks = this.element_text(this.theme_settings.axis.text.x.top, top_axis.ticks)
            if (this.theme_settings.axis.text.x.bottom !== null) bottom_axis.ticks = this.element_text(this.theme_settings.axis.text.x.bottom, bottom_axis.tick)
            if (this.theme_settings.axis.text.y.left !== null) left_axis.ticks = this.element_text(this.theme_settings.axis.text.y.left, left_axis.ticks)
            if (this.theme_settings.axis.text.y.right !== null) right_axis.ticks = this.element_text(this.theme_settings.axis.text.y.right, right_axis.ticks)

            // axis tick formatting
            if (this.theme_settings.axis.ticks.x.top !== null) top_axis.ticks = this.theme_settings.axis.ticks.x.top
            if (this.theme_settings.axis.ticks.x.bottom !== null) bottom_axis.ticks = this.theme_settings.axis.ticks.x.bottom
            if (this.theme_settings.axis.ticks.y.left !== null) left_axis.ticks = this.theme_settings.axis.ticks.y.left
            if (this.theme_settings.axis.ticks.y.right !== null) right_axis.ticks = this.theme_settings.axis.ticks.y.right

            // axis tick rotation
            if (this.theme_settings.axis.ticks.rotate.x.top !== null) top_axis.ticks.rotate = this.theme_settings.axis.ticks.rotate.x.top
            if (this.theme_settings.axis.ticks.rotate.x.bottom !== null) bottom_axis.ticks.rotate = this.theme_settings.axis.ticks.rotate.x.bottom
            if (this.theme_settings.axis.ticks.rotate.y.left !== null) left_axis.ticks.rotate = this.theme_settings.axis.ticks.rotate.y.left
            if (this.theme_settings.axis.ticks.rotate.y.right !== null) right_axis.ticks.rotate = this.theme_settings.axis.ticks.rotate.y.right

            // manipulation for if tick rotate is set
            if (top_axis.ticks.rotate) {
                top_axis.ticks.textAnchor = top_axis.ticks.rotate > 0 ? 'start' : 'end'
                top_axis.ticks.textWrap = 100
            }
            if (bottom_axis.ticks.rotate) {
                bottom_axis.ticks.textAnchor = bottom_axis.ticks.rotate > 0 ? 'start' : 'end'
                bottom_axis.ticks.textWrap = 100
            }
            if (left_axis.ticks.rotate) {
                left_axis.ticks.textAnchor = left_axis.ticks.rotate > 0 ? 'start' : 'end'
                left_axis.ticks.textWrap = 100
            }
            if (right_axis.ticks.rotate) {
                right_axis.ticks.textAnchor = right_axis.ticks.rotate > 0 ? 'start' : 'end'
                right_axis.ticks.textWrap = 100
            }

            // axis tick length formatting
            if (this.theme_settings.axis.ticks.length.x.top !== null) top_axis.ticks.stroke.width = this.theme_settings.axis.ticks.length.x.top
            if (this.theme_settings.axis.ticks.length.x.bottom !== null) bottom_axis.ticks.stroke.width = this.theme_settings.axis.ticks.length.x.bottom
            if (this.theme_settings.axis.ticks.length.y.left !== null) left_axis.ticks.stroke.width = this.theme_settings.axis.ticks.length.y.left
            if (this.theme_settings.axis.ticks.length.y.right !== null) right_axis.ticks.stroke.width = this.theme_settings.axis.ticks.length.y.right

            if (this.theme_settings.axis.ticks.color.x.top !== null) top_axis.ticks.stroke.color = this.theme_settings.axis.ticks.color.x.top
            if (this.theme_settings.axis.ticks.color.x.bottom !== null) bottom_axis.ticks.stroke.color = this.theme_settings.axis.ticks.color.x.bottom
            if (this.theme_settings.axis.ticks.color.y.left !== null) left_axis.ticks.stroke.color = this.theme_settings.axis.ticks.color.y.left
            if (this.theme_settings.axis.ticks.color.y.right !== null) right_axis.ticks.stroke.color = this.theme_settings.axis.ticks.color.y.right

            // axis line styling
            if (this.theme_settings.axis.line.x.top !== null) top_axis.dbar.stroke = this.theme_settings.axis.line.x.top
            if (this.theme_settings.axis.line.x.bottom !== null) bottom_axis.dbar.stroke = this.theme_settings.axis.line.x.bottom
            if (this.theme_settings.axis.line.y.left !== null) left_axis.dbar.stroke = this.theme_settings.axis.line.y.left
            if (this.theme_settings.axis.line.y.right !== null) right_axis.dbar.stroke = this.theme_settings.axis.line.y.top

            let background = { name: 'area', data: 'bg_data', frame: this._current_layer.frames[frame].name, stroke: { width: 0 }, color: "rgba(0,0,0,0)", x: 'bgX', y0: 'bgY', y1: 0 }
            if (this.theme_settings.panel.background !== null) background.color = this.theme_settings.panel.background
            if (this.theme_settings.panel.border !== null) {
                background.stroke.color = this.theme_settings.panel.border
                background.stroke.width = 4
            }

            // grid colours
            if (this.theme_settings.panel.grid.major.x !== null) {
                bottom_axis.gridColor = this.theme_settings.panel.grid.major.x
                top_axis.gridColor = this.theme_settings.panel.grid.major.x
            }

            if (this.theme_settings.panel.grid.major.y !== null) {
                left_axis.gridColor = this.theme_settings.panel.grid.major.y
                right_axis.gridColor = this.theme_settings.panel.grid.major.y
            }

            // if(panel.grid.minor.x)
            // if(panel.grid.minor.y)

            // if (panel.ontop)

            if (this._current_layer.cols || this._current_layer.rows) {

                // strip.background,
                // strip.background.x,
                // strip.background.y,
                // strip.placement,
                // strip.text,
                // strip.text.x,
                // strip.text.y,
                // strip.switch.pad.grid,
                // strip.switch.pad.wrap,

                let fsize = 7 // font size
                let height = fsize * 2;

                let label_background = { name: 'area', data: 'bg_data', id: 'bgColor', color: "#00000033", x: 'bgX', y0: 'bgY', y1: 0 }
                let label_text = { name: 'text', font: { size: fsize }, textAnchor: "middle", renderopts: "norotate nomirror" }

                //add labels
                if (this._current_layer.facet == 'grid') {
                    if (this._current_layer.cols && this._current_layer.frames[frame].col == this._current_layer.cols[this._current_layer.cols.length - 1]) {

                        let f = H.Clone.deep(this._current_layer.frames[frame]); // copy the frame
                        let bg = H.Clone.deep(label_background)
                        let txt = H.Clone.deep(label_text)

                        let ty = parseFloat(f.translate.y);
                        let bh = parseFloat(f.bbox.h)
                        f.translate.y = `calc(pcnt(${ty})+(pcnt(${bh})/2)+px(${height / 2})+px(1))`;
                        f.bbox.h = height;
                        f.name += '-labelT';

                        bg.frame = f.name
                        if (this.theme_settings.strip.background.x != null) bg.color = this.theme_settings.strip.background.x
                        if (this.theme_settings.strip.stroke.x != null) bg.stroke = { color: this.theme_settings.strip.stroke.x, width: 3 }

                        txt.frame = f.name
                        txt.content = `${this._current_layer.frames[frame].row}`
                        txt.pos = { x: '50%', y: `calc(pcnt(50)-px(${fsize / 2}))` }
                        if (this.theme_settings.strip.text.x != null) txt.font = { color: this.theme_settings.strip.text.x }

                        l.frames.push(f);
                        l.draw.push(bg)
                        l.draw.push(txt);
                    }

                    if (this._current_layer.rows && this._current_layer.frames[frame].row == this._current_layer.rows[this._current_layer.rows.length - 1]) {

                        let f = H.Clone.deep(this._current_layer.frames[frame]); // copy the frame
                        let bg = H.Clone.deep(label_background)
                        let txt = H.Clone.deep(label_text)

                        let tx = parseFloat(f.translate.x);
                        let bw = parseFloat(f.bbox.w)
                        f.translate.x = `calc(pcnt(${tx})+(pcnt(${bw})/2)+px(${height / 2})+px(1))`;
                        f.bbox.w = height;
                        f.name += '-labelR';

                        bg.frame = f.name
                        if (this.theme_settings.strip.background.x != null) bg.color = this.theme_settings.strip.background.y
                        if (this.theme_settings.strip.stroke.y != null) bg.stroke = { color: this.theme_settings.strip.stroke.y, width: 3 }

                        txt.frame = f.name
                        txt.content = `${this._current_layer.frames[frame].col}`
                        txt.pos = { x: `calc(pcnt(50)-px(${fsize / 2}))`, y: '50%' }
                        txt.rotate = 90
                        if (this.theme_settings.strip.text.y != null) txt.font = { color: this.theme_settings.strip.text.y }

                        l.frames.push(f);
                        l.draw.push(bg)
                        l.draw.push(txt);
                    }
                }

                if (this._current_layer.facet == 'wrap') {
                    let f = H.Clone.deep(this._current_layer.frames[frame]); // copy the frame
                    let bg = H.Clone.deep(label_background)
                    let txt = H.Clone.deep(label_text)

                    let labelScaler = .7
                    let height = (fsize*2)*labelScaler;

                    let ty = parseFloat(f.translate.y);
                    let bh = parseFloat(f.bbox.h)
                    f.translate.y = `calc(pcnt(${ty})+(pcnt(${bh})/2)+px(${height/2})+px(1))`;
                    f.bbox.h =  height;
                    f.name += '-labelT';

                    bg.frame = f.name
                    if (this.theme_settings.strip.background.x != null) bg.color = this.theme_settings.strip.background.y
                    if (this.theme_settings.strip.stroke.y != null) bg.stroke = { color: this.theme_settings.strip.stroke.y, width: 3 }

                    txt.frame = f.name
                    txt.content = `${f.facet_title}`
                    txt.pos = {x:'50%', y:`calc(pcnt(50)-px(${(fsize/2)*labelScaler}))`}
                    txt.font.size = 4
                    if (this.theme_settings.strip.text.y != null) txt.font.color = this.theme_settings.strip.text.y

                    l.frames.push(f);
                    l.draw.push(bg)
                    l.draw.push(txt);
                }

                //hide ticks & tick markers apart from outside plots on facets
                if (this._current_layer.rows && this._current_layer.frames[frame].row != this._current_layer.rows[0]) {
                    left_axis.ticks.font.color = 'rgba(0,0,0,0)'
                    left_axis.ticks.stroke.color = 'rgba(0,0,0,0)'
                }

                if (this._current_layer.cols && this._current_layer.frames[frame].col != this._current_layer.cols[0]) {
                    bottom_axis.ticks.font.color = 'rgba(0,0,0,0)'
                    bottom_axis.ticks.stroke.color = 'rgba(0,0,0,0)'
                }

            }

            //push!
            l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.area), background))
            l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.axis), bottom_axis))
            l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.axis), left_axis))
        }
    }

    if (this._layers.guide) {
        for (let frame in this._layers.guide.frames) {
            if (this._layers.guide.frames[frame].plot == true) {

                let background = { name: 'area', data: 'bg_data', frame: this._layers.guide.frames[frame].name, stroke: { width: 0 }, color: "rgba(0,0,0,0)", x: 'bgX', y0: 'bgY', y1: 0 }
                if (this.theme_settings.legend.background !== null) background.color = this.theme_settings.legend.background

                this._layers.guide.draw.unshift(H.Merge.deep(H.Clone.deep(this.defaults.vspec.area), background))

                // legend.background,
                // legend.margin,
                // legend.spacing,
                // legend.spacing.x,
                // legend.spacing.y,
                // legend.key,
                // legend.key.size,
                // legend.key.height,
                // legend.key.width,
                // legend.text,
                // legend.text.align,
                // legend.title,
                // legend.title.align,
                // legend.position,
                // legend.direction,
                // legend.justification,s
                // legend.box,
                // legend.box.just,
                // legend.box.margin,
                // legend.box.background,
                // legend.box.spacing,
            }
        }

        // guide background
        if (this.theme_settings.legend && this.theme_settings.legend.box){
            if (this.theme_settings.legend.box.background !== null){
                let guide_background = { name: 'area', data: 'bg_data', frame: 'guide', stroke: { width: 0 }, color: 'rgba(0,0,0,0)', x: 'bgX', y0: 'bgY', y1: 0 }
                guide_background.color = this.theme_settings.legend.box.background
                l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.area), guide_background))
            }
        }
    }

    /////////////////////////////////
    /////////// labels //////////////
    /////////////////////////////////

    // axis labels
    let plot_frame = H.Merge.deep(H.Clone.deep(this.defaults.vspec.frame), { name: 'plot_frame', bbox: { h: "100%", w: "100%" } })
    l.frames.push(plot_frame)

    //create flipped axis scales
    // if (this._current_layer.options.rotate == 90) {
    //     this._current_layer.accessors[`${this._current_layer.name}-x-axis`] = H.Clone.deep(this._current_layer.accessors[`${this._current_layer.name}-y`])
    //     this._current_layer.accessors[`${this._current_layer.name}-y-axis`] = H.Clone.deep(this._current_layer.accessors[`${this._current_layer.name}-x`])
    //     this._current_layer.accessors[`${this._current_layer.name}-y-axis`].range = '-height'
    //     this._current_layer.accessors[`${this._current_layer.name}-x-axis`].range = 'width'
    // }

    if (this._labels.xlab === null) this.xlab()
    if (this._labels.ylab === null) this.ylab()

    if (this._labels.xlab !== null) {

        let xlab = { name: 'text', content: this._labels.xlab, font: { size: 6 }, frame: plot_frame.name, pos: { x: '50%', y: 10 } }

        if (this.theme_settings.axis.title.x.bottom !== null) xlab = this.element_text(this.theme_settings.axis.title.x.bottom, xlab)

        l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.text), xlab))

    }

    // if (this.theme_settings.axis.title.x.top !== null) this.xlab(this.theme_settings.axis.title.x.top)
    if (this._labels.ylab !== null) {

        let ylab = { name: 'text', content: this._labels.ylab, font: { size: 6 }, frame: plot_frame.name, pos: { x: 10, y: '50%' }, rotate: -90 }

        if (this.theme_settings.axis.title.y.left !== null) ylab = this.element_text(this.theme_settings.axis.title.y.left, ylab)

        l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.text), ylab))

    }

    // if (this.theme_settings.axis.title.y.right !== null) this.ylab(this.theme_settings.axis.title.y.right)
    if (this.theme_settings.plot.background !== null) {
        let background = { name: 'area', data: 'bg_data', frame: plot_frame.name, stroke: { width: 0 }, color: 'rgba(0,0,0,0)', x: 'bgX', y0: 'bgY', y1: 0 }
        background = this.element_rect(this.theme_settings.plot.background, background)
        l.draw.unshift(H.Merge.deep(H.Clone.deep(this.defaults.vspec.area), background))
    }

    if (this._labels.title !== null) {
        let title = { name: 'text', font: { size: 18 }, frame: plot_frame.name, content: this._labels.title, pos: { x: '50%', y: `calc(pcnt(100)-px(${30}))` } }

        if (this.theme_settings.plot.title !== null) title = this.element_text(this.theme_settings.plot.title, title)

        if (this.theme_settings.plot.title !== null && this.theme_settings.plot.title.position) {
            // if (this.theme_settings.plot.title.position == 'panel') title.pos = ''
            // if (this.theme_settings.plot.title.position == 'plot') title.pos = ''
        }

        l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.text), title))

    }


    if (this._labels.subtitle !== null) {
        let subtitle = { name: 'text', content: this._labels.subtitle, font: { size: 7 }, frame: plot_frame.name, pos: { x: '50%', y: `calc(pcnt(100)-px(${50}))` } }

        if (this.theme_settings.plot.subtitle !== null) subtitle = this.element_text(this.theme_settings.plot.subtitle, subtitle)

        l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.text), subtitle))

    }

    if (this._labels.caption !== null) {
        let caption = { name: 'text', content: this._labels.caption, font: { size: 7 }, textAnchor: 'end', frame: plot_frame.name, pos: { x: `calc(pcnt(100)-px(${20}))`, y: 20 } }

        if (this.theme_settings.plot.caption !== null) caption = this.element_text(this.theme_settings.plot.caption, caption)

        if (this.theme_settings.plot.caption !== null && this.theme_settings.plot.caption.position) {
            // if (this.theme_settings.plot.caption.position == 'panel') caption.pos = ''
            // if (this.theme_settings.plot.caption.position == 'plot') caption.pos = ''
        }

        l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.text), caption))
    }
    // plot.caption.position,
    if (this._labels.tag !== null) {
        let tag = { name: 'text', content: this._labels.tag, font: { size: 7 }, textAnchor: 'start', frame: plot_frame.name, pos: { x: 20, y: `calc(pcnt(100)-px(${20}))` } }

        if (this.theme_settings.plot.tag !== null) tag = this.element_text(this.theme_settings.plot.tag, tag)

        if (this.theme_settings.plot.tag !== null && this.theme_settings.plot.tag.position) {

            if (typeof this.theme_settings.plot.tag.position == 'string') {

                // if (this.theme_settings.plot.tag.position == 'topleft') tag.pos = ''
                // if (this.theme_settings.plot.tag.position == 'top') tag.pos = ''
                // if (this.theme_settings.plot.tag.position == 'topright') tag.pos = ''
                // if (this.theme_settings.plot.tag.position == 'left') tag.pos = ''
                // if (this.theme_settings.plot.tag.position == 'right') tag.pos = ''
                // if (this.theme_settings.plot.tag.position == 'bottomleft') tag.pos = ''
                // if (this.theme_settings.plot.tag.position == 'bottom') tag.pos = ''
                // if (this.theme_settings.plot.tag.position == 'bottomright') tag.pos = ''

            } else if (Array.isArray(this.theme_settings.plot.tag.position)) {
                tag.pos = { x: `${this.theme_settings.plot.tag.position[0] * 100}%`, y: `${(1 - this.theme_settings.plot.tag.position[1]) * 100}%` }
            }

        }

        l.draw.push(H.Merge.deep(H.Clone.deep(this.defaults.vspec.text), tag))

    }
    // plot.tag.position,
    // plot.margin,

    this.current_theme = l

};