/**
 * Created by Bastou on 06/04/2018.
 */

class Bubble {
    constructor(x,y,r, p) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.r = r;
        this.brightness = 0;
    }

    clicked(px, py) {
        let d = this.p.dist(px, py, this.x, this.y);
        if(d < this.r) {
            console.log('clicked on bubble');
            this.brightness = 255;
        }
    }

    move() {
        this.x = this.x + this.p.random(-5, 5);
        this.y = this.y + this.p.random(-5, 5);
    }

    show() {
        this.p.stroke(255);
        this.p.strokeWeight(4);
        this.p.noFill();
        this.p.ellipse(this.x, this.y, this.r*2);
    }
}

export default Bubble;