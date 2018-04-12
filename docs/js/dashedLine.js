/*
 Draw dashed lines where
 (l = length of dashed line in px, g = gap in px)
 */
export default function (x1, y1, x2, y2, l, g) {
    const pc = this.dist(x1, y1, x2, y2) / 100;
    let pcCount = 1;
    let lPercent, gPercent = 0;
    let currentPos = 0;
    let xx1, yy1, xx2, yy2 = 0;

    while (this.int(pcCount * pc) < l) {
        pcCount++
    }
    lPercent = pcCount;
    pcCount = 1;
    while (this.int(pcCount * pc) < g) {
        pcCount++
    }
    gPercent = pcCount;

    lPercent = lPercent / 100;
    gPercent = gPercent / 100;
    while (currentPos < 1) {
        xx1 = this.lerp(x1, x2, currentPos);
        yy1 = this.lerp(y1, y2, currentPos);
        xx2 = this.lerp(x1, x2, currentPos + lPercent);
        yy2 = this.lerp(y1, y2, currentPos + lPercent);
        if (x1 > x2) {
            if (xx2 < x2) {
                xx2 = x2;
            }
        }
        if (x1 < x2) {
            if (xx2 > x2) {
                xx2 = x2;
            }
        }
        if (y1 > y2) {
            if (yy2 < y2) {
                yy2 = y2;
            }
        }
        if (y1 < y2) {
            if (yy2 > y2) {
                yy2 = y2;
            }
        }

        this.line(xx1, yy1, xx2, yy2);
        currentPos = currentPos + lPercent + gPercent;
    }
}
