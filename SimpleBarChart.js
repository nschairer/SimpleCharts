

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
    ctx.moveTo(x1, y2);
    ctx.lineTo(x2, y2);
    ctx.stroke()
}


/**
 * Helper method to draw a label on a canvas
 * @param {Object} ctx 2d context
 * @param {String} text text to display
 * @param {Number} x x-location
 * @param {Number} y y-location
 * @param {String} size pixel size of text - must end in px
 * @param {String} font font style
 * @param {String} color valid CSS color
 */
function drawLabel(ctx, text, x, y, size='18px', font='sans-serif', color='black') {
    ctx.font = `${size} ${font}`
    ctx.fillStyle = color
    ctx.fillText(text, x, y)
}


class SimpleBarChart {

    /**
     * SimpleBarChart default constructor 
     * @param {String} id id of canvas element to draw on
     * @param {Number[]} data list of numbers to display
     * @param {String} backgroundColor valid CSS background color
     * @param {String} gridColor valid CSS color for grid lines
     */
    constructor (id, data, backgroundColor='#fafafa', gridColor = '#000') {
        this.data = data;
        this.element = document.querySelector(`#${id}`);
        this.ctx = this.element.getContext('2d')
        this.backgroundColor = backgroundColor;
        this.element.style.backgroundColor = this.backgroundColor;
        this.gridColor = gridColor;
    }

    /**
     * Helper method to scale canvas to correct device pixel ratio
     */
    scaleCanvas() {
        const dpi = window.devicePixelRatio;
        const height = +getComputedStyle(this.element).getPropertyValue("height").slice(0, -2);
        const width = +getComputedStyle(this.element).getPropertyValue("width").slice(0, -2);
        this.element.setAttribute('height', height * dpi)
        this.element.setAttribute('width', width * dpi)
    }

    /**
     * Helper method to draw grid
     * padding sets space from top of canvas, grid lines are spread evenly throughout
     * the remaining height after padding offset
     * @param {Number} scale Scale for grid lines
     */
    grid(scale=10) {
        const padding = 100
        const maxValue = Math.max(...this.data);
        const gridLines = Math.floor(maxValue / scale);
        const spacing = (this.element.height - padding) / gridLines;
        for(let x = 0; x < gridLines; x ++) {
            drawLine(this.ctx, 0, x * spacing + padding, this.element.width, x * spacing + padding)
            drawLabel(this.ctx, (gridLines - x) * (scale), 10, x * spacing + padding - 12)
        }
    }

    draw () {
        this.scaleCanvas();
        this.grid()
    }
}