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

    }

    show() {
        console.log('show');
    }
}