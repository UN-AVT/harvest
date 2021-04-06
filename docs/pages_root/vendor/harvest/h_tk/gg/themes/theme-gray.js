H.gg.prototype.theme_gray = function (options={}) {

    this.theme_settings = {
        panel:{
            background : 'lightgrey',
            grid:'white',
            spacing:0
        },
        legend:{
            background: "lightgrey"
        },
        axis:{
            line:'rgba(0,0,0,0)',
            ticks:{
                color:'black'
            },
            title:{}
        }
    }
}

H.gg.prototype.theme_grey = function () {
    this.theme_gray()
}
