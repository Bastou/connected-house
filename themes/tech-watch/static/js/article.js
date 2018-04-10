/**
 * Created by Bastou on 06/04/2018.
 */

export default class Article {
    constructor(props) {
        props = props || {}; //this is default value for param.

        // P5
        this.p = props.p;

        // Article metas
        this.id = props.id;
        this.category = props.category;
        this.title = props.title;
        this.date = props.date;
        this.url = props.url;
        this.html = props.html;

        // Article canvas shape
        this.x = props.x;
        this.y = props.y;
        this.color = props.color;
        this.pColor;
        this.darkened = false;

        // Article line if connected to another article
        this.hasLine = false;
        this.lineTo = {x:0,y:0}

        // private
        this._r = 10;

        // Around circles

        // TODO: put that stuff in an object fuck off
        this.aroundCirclesNb = 4;
        this.aroundCircleROff = 0;
        this.aroundCircles = new Array(this.aroundCirclesNb).fill(0).map(c => ({x:this.x, y:this.y,r:0}));

        // title in View
        this.uiTitleAlpha = {a:0}; // must  be an object for Tween
        this.uiTitleP = {
            'alpha': {x:0, y:0},
            'alphaTarget': {a:255},
            'tween': new TWEEN.Tween(this.uiTitleAlpha)
                .to({a: 255}, 500)
                .easing(TWEEN.Easing.Quadratic.In)
                .onUpdate(() => {
                    //console.log(this.uiTitleAlpha.a);
                }),
            'started': false
        };

    }

    init () {
        this.setPcolor(this.color);
    }

    clicked(px, py) {
        if(this.pointerInArticle(px,py)) {
            console.log('clicked on article' + '"' + this.title + '"');
        }
    }

    hovered(px, py) {
        if(this.pointerInArticle(px,py)) {
            // title in
            this.drawTitle();

            // circles in
            this.drawCirclesAround()

            this.p.cursor(this.p.HAND);
        } else {
            // title out
            this.drawTitle(true);

            // circles out
            this.drawCirclesAround(true);
        }
    }

    pointerInArticle(px,py) {
        let d = this.p.dist(px, py, this.x, this.y);
        if(d < this._r) {
            return true;
        } else {
            return false;
        }
    }

    show() {
        this.p.noStroke();
        if(this.darkened) {
            this.pColor.setAlpha(40);
        }
        this.p.fill(this.pColor);
        this.p.push();
        this.p.ellipse(this.x, this.y, this._r);
        this.p.pop();

        if(this.hasLine) {
            this.p.stroke(this.pColor);
            this.p.strokeWeight(4);
            this.p.push();
            this.p.line(this.x, this.y, this.lineTo.x, this.lineTo.y);
            this.p.pop();
        }
    }

    drawCirclesAround(out = false) {
        if(out && this.aroundCircles.r === 0) return;
        this.p.noStroke();
        this.pColor.setAlpha(40);
        this.p.fill(this.pColor);
        this.p.push();
        this.aroundCircles.forEach((c, i) => {
            // ease radius size
            if(out) {
                c.r  += (0 - c.r ) * 0.13;
            }   else {
                this.aroundCircleROff += 0.007;
                let n = this.p.noise(this.aroundCircleROff)*1.5;
                c.r  += ( (this._r + n + (i * 12 * n) ) - c.r ) * 0.1;
            }
            this.p.ellipse(c.x, c.y, c.r)
        });
        this.p.pop();
        this.pColor.setAlpha(255);
    }

    drawTitle(out = false) {
        if(out) {
            this.uiTitleP.tween.stop();
            this.uiTitleP.started = false;
            this.uiTitleAlpha.a = 0;
        }
        if(!this.uiTitleP.started && !out) {
            this.uiTitleP.tween.start();
            this.uiTitleP.started = true;
        }
        if(out) return;
        this.pColor.setAlpha(this.uiTitleAlpha.a);
        this.p.noStroke();
        this.p.fill(this.pColor);
        this.p.textAlign(this.p.CENTER);
        this.p.textSize(14);
        this.p.push();
        this.p.text(this.title, this.x, this.y - 30);
        this.p.pop();
        this.pColor.setAlpha(255);
    }

    setPcolor(color) {
        this.pColor = this.p.color(color);
    }
}