
/**
 * Helper method to draw a line on a canvas
 * @param {Object} ctx 2d context
 * @param {Number} x1 Starting x-coordinate
 * @param {Number} y1 Starting y-coordinate
 * @param {Number} x2 Ending x-coordinate
 * @param {Number} y2 Ending y-coordinate
 * @param {String} color Valid CSS color
 */
function drawLine(ctx, x1, y1, x2, y2, color='black') {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke()
}


class BarChart {
    constructor() {

    }


    setConstants(left, top, right, bottom) {
        this.chartWidth = this.width - left - right;
        this.chartHeight = this.height - top - bottom;
        this.xStart = left;
        this.yStart = top;
    }

    drawAxis = () => {
        this.drawX ? drawLine(this.context, this.xStart, this.yStart, this.xStart, this.chartHeight) : null;
        this.drawY ? drawLine(this.context, this.xStart, this.chartHeight, this.chartWidth, this.chartHeight) : null;
    }

    drawGrid = () => {
        const maxValue = Math.max(...this.values);//some sort of did change so we don't recalc this
        const gridlines = Math.ceil( maxValue / this.scale );
        this.maxGridLine = gridlines * this.scale;

        for( let x = 0; x < gridlines; x++) {
            let lineY = ((x * this.scale) / this.maxGridLine) * this.chartHeight
            drawLine(this.context, this.xStart, lineY, this.chartWidth, lineY);
        }
    }

    drawBars = () => {
        const N = this.chartWidth / this.values.length;
        const barWidth = this.chartWidth - (this.barSpacing * this.values.length) / this.values.length;
        for ( let i = 0; i < this.values.length; i++ ) {
            const barXStart = (N * i) + (0.5 * this.barSpacing);
            const barXEnd = this.xStart + barWidth;
            const barYStart = this.chartHeight;
            const barYEnd = (- this.values[i] / this.maxGridLine) * this.chartHeight;
            roundedRect(this.context, barXStart, barYStart, barWidth, barYEnd, 0, 'black');
        }
    }
}