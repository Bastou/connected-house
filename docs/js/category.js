/**
 * Created by Bastou on 06/04/2018.
 */

export default class Category {
    constructor(props) {
        // p5
        this.p = props.p;

        // Props
        this.id = props.id;
        this.color = props.color;
        this.pColor = null;
        this.posY = props.posY;
        this.pos = props.pos;

        this._r = 16;
        this.x;
        this.y;
        this.bbox = {};

        this.textFont;

        this.isHovered = false;

        this.isClicked = false;
    }

    init() {
        this.setPcolor(this.color);
        this.setPos(this.pos);
        this.setBbox();
    }

    show() {
        this.p.noStroke();
        this.p.fill(this.pColor);
        this.p.push();
        this.p.ellipse(this.x, this.y, this._r);
        this.p.pop();

        this.p.fill('white');
        this.p.textSize(20);
        this.p.textAlign(this.p.LEFT);
        this.p.push();
        this.p.text(this.id, this.x + 25, this.y + this._r/3);
        this.p.pop();
    }

    hovered(px, py) {
        if(this.pointerInCategory(px,py)) {
            this.p.cursor(this.p.HAND);
            this.isHovered = true;
        } else {
            this.isHovered = false;
        }
    }

    clicked(px, py) {
        if(this.pointerInCategory(px,py)) {
            this.isClicked = true;
        }
    }

    pointerInCategory(px,py) {
        if ( px >= this.bbox.x && px <= this.bbox.x + this.bbox.w &&
            py >= this.bbox.y && py <= this.bbox.y + this.bbox.h) {
            return true;
        } else {
            return false;
        }
    }

    setPcolor(color) {
        this.pColor = this.p.color(color);
    }

    setPos(pos) {
        this.x = this.p.windowWidth/2 - 540 + (200 * pos-1);
        this.y = this.p.windowHeight - this.p.windowHeight/4 + 40;
    }

    setBbox() {
        this.bbox = {
            x: this.x - this._r/2,
            y: this.y - this._r/2,
            w: 150,
            h: this._r
        }
    }

    // TODO: Add hover circles
}