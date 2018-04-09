// Tools
export default class Tools {

    constructor() {
        this.logPrevValue = null
        this.logCount = 0
    }

    de2ra(degree) {
        return degree*(Math.PI/180);
    }
    isOdd(num) { return num % 2}
    Log(value) {
        if (this.logPrevValue == null || this.logPrevValue.toString() !== value.toString() || (Math.round(this.logPrevValue * 1000) / 1000) !== (Math.round(value * 1000) / 1000)) {
            console.log(value);
        }
        this.logPrevValue = value
    }
};


