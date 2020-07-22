

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


class Bar {
    /**
     * Default constructor for Bar class
     * @param {Number} x scaled x-value 
     * @param {Number} y scaled y-value
     * @param {Number} width scaled width
     * @param {Number} height scaled height
     * @param {String} color valid CSS color
     * @param {String} label text label
     */
    constructor(x, y, width, height, color='black', label=null) {
        this.x = x;
        this.y = y;
        this.width = width,
        this.height = height
        this.color = color
        this.label = label || ''

        this.dpX = x / window.devicePixelRatio;
        this.dpY = y / window.devicePixelRatio;
        this.dpWidth = width / window.devicePixelRatio;
        this.dpHeight = height / window.devicePixelRatio;
    }

    /**
     * Helper method to tell if something is hovering Bar object
     * @param {Number} x x-coordinate
     * @param {Number} y y-coordinate
     */
    isHover(x,y){
        return x >= this.dpX && x <= this.dpX + this.dpWidth && y >= this.dpY + this.dpHeight
    }

    /**
     * Helper method to add shadow when hovering
     * @param {Object} ctx 2d context 
     * @param {Number} size size of shadow blur
     * @param {String} color valid CSS color of shadow blur
     */
    drawWithShadow(ctx, size=4, color='gray') {
        ctx.shadowBlur = size;
        ctx.shadowColor = color;
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    /**
     * Helper method to draw bar on chart
     * @param {Object} ctx 2d context 
     */
    draw(ctx) {
        ctx.shadowBlur=0
        ctx.shadowColor = 'transparent'
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.textAlign = 'center'
        drawLabel(ctx, this.label, this.x + (this.width / 2), this.y + 18)
    }
}


class SimpleBarChart {

    /**
     * SimpleBarChart default constructor 
     * @param {String} id id of canvas element to draw on
     * @param {Number[]} data list of numbers to display
     * @param {String[]} labels list of data labels
     * @param {String} backgroundColor valid CSS background color
     * @param {String} gridColor valid CSS color for grid lines
     * @param {String[]} colors list of valid CSS colors for bars
     */
    constructor (id, data, labels=null, backgroundColor='#fff', gridColor = '#000', colors=null) {
        this.data = data;
        this.labels = labels || [];
        this.element = document.querySelector(`#${id}`);
        this.ctx = this.element.getContext('2d')
        this.backgroundColor = backgroundColor;
        this.element.style.backgroundColor = this.backgroundColor;
        this.gridColor = gridColor;
        this.bars = [];
        this.active = null;
        this.colors = new ColorWheel(colors)
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
        const spacing = (this.element.height - (padding*2)) / gridLines;
        for(let x = 0; x < gridLines + 1; x ++) {
            drawLine(this.ctx, 0, x * spacing + padding, this.element.width, x * spacing + padding)
            drawLabel(this.ctx, (gridLines - x) * (scale), 1, x * spacing + padding - 12)
        }
    }

    /**
     * Helper method to draw the bars
     * @param {Number} maxHeight maximum height a bar can be
     * @param {Number} spacing Spacing desired between bars
     */
    drawBars(maxHeight, spacing) {
        const maxValue = Math.max(...this.data);//this gives the proportion for the height
        const barWidth = (this.element.width - (spacing * this.data.length)) / this.data.length;
        const spaceWidth = this.element.width / this.data.length
        

        if (this.bars.length) {
            for(let bar of this.bars) {
                bar.draw(this.ctx)
            }
            return;
        }

        for(let x = 0; x < this.data.length; x++) {
            const xStart = x * spaceWidth + (spacing / 2)
            const height = - (this.data[x]/maxValue) * maxHeight
            const bar = new Bar(xStart, this.element.height - 100, barWidth, height, this.colors.get(), this.labels[x] || null)
            bar.draw(this.ctx)
            this.bars.push(bar)
        }

    }

    /**
     * Method to perform operations when mouse hovers over a bar
     * @param {Object} e event object 
     */
    mouseDidMove (e) {
        const rect = this.element.getBoundingClientRect()
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (this.active && !this.bars[this.active].isHover(x,y)) {
            this.active = null;
            this.reset()
            console.log('reset')
        }
        for(let i = 0; i < this.bars.length; i++) {
            const bar = this.bars[i]
            if (bar.isHover(x,y)) {
                this.element.style.cursor = 'pointer';
                bar.drawWithShadow(this.ctx)
                this.active = i;
                break
            } else {
                this.element.style.cursor = '';
            }
        }
    }

    /**
     * Initial draw method
     */
    draw () {
        this.scaleCanvas();
        this.grid()
        this.drawBars(this.element.height - 200, 40)
        this.element.onmousemove = e => this.mouseDidMove(e);
    }
    
    /**
     * Method to clear canvas and redraw
     */
    reset() {
        this.ctx.clearRect(0,0,this.element.width, this.element.height)
        this.scaleCanvas()
        this.grid()
        this.drawBars(this.element.height - 200, 40)
    }
}


class ColorWheel {
    /**
     * Default constructor for color wheel class
     * @param {String[]} colors list of colors optional 
     */
    constructor(colors=null) {
        this.colors = colors || [
            '#05386B',
            '#379683',
            '#5CDB95',
            '#8EE4AF',
            '#EDF5E1'
        ]

        this.index = 0
    }

    /**
     * Helper method to get next color
     */
    get() {
        if (this.index == this.colors.length-1) {
            this.index = 0
        }
        return this.colors[this.index++]
    }

}