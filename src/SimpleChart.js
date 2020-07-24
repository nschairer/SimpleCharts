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

class ViewPort {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
}

class Pointer {
    constructor( x, y ) {
        this.x = x;
        this.y = y;
    }

    moveTo( x, y ) {
        this.x = x;
        this.y = y;
    }
}

class Scroller {
    constructor( x, y, w, h ) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h =h;
        this.mouseDown = false;
    }

    intersect = (x, y) => {
        return x >= this.x && x <= this.x + this.w
    }
}


class SimpleChart {
    constructor(props) {
        // Minimum required
        this.id = props.id;
        this.values = props.values;
        this.labels = props.labels;
        this.context = document.querySelector(`#${this.id}`).getContext('2d');
        this.scale()

        //Location management
        this.viewport = new ViewPort(0, 0, this.width, this.height);
        this.pointer = new Pointer(0,0);
        // this.scroller = new Scroller( 0, 0, 0, 100);

        // Style attributes
        this.backgroundColor = props.backgroundColor || 'lightcoral';
        
        //Grid / Y-Axis Style
        this.gridLineColor = props.gridLineColor || 'black';
        this.gridFontFamily = props.gridFontFamily || 'sans-serif';
        this.gridFontSize = props.gridFontSize || '18px';
        this.gridFontColor = props.gridFontColor || 'black';
        this.gridLabelInset = props.gridLabelInset || 2;
        this.showZero = props.showZero || false;
        
        //X-Axis Style -- might change this to dataStyle
        this.xAxisFontFamily = props.xAxisFontFamily || 'sans-serif';
        this.xAxisFontSize = props.xAxisFontSize || '18px';
        this.xAxisFontColor = props.xAxisFontColor || 'black';
        //End style attributes

        //Listeners
        this.context.canvas.addEventListener('mousemove', this.mouseDidMove);
        this.context.canvas.addEventListener('mouseout', this.mouseDidLeave);
    }

    scale() {
        const width = +getComputedStyle(this.context.canvas).getPropertyValue("width").slice(0, -2) * window.devicePixelRatio;
        const height = +getComputedStyle(this.context.canvas).getPropertyValue("height").slice(0, -2) * window.devicePixelRatio;
        this.width = width;
        this.height = height;
        this.context.canvas.setAttribute('width', width);
        this.context.canvas.setAttribute('height', height)
    }

    mouseDidMove = e => {
        const rect = this.context.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        this.pointer.moveTo(x * window.devicePixelRatio, y * window.devicePixelRatio)
    }

    mouseDidLeave = e => {
        this.pointer.moveTo(0,0)
    }

    mainLoop = fn => {
        this.context.clearRect(0,0,this.width, this.height)
        fn()
        requestAnimationFrame(() => this.mainLoop(fn))
    }

}

class SimpleBarChart extends SimpleChart {
    constructor(props) {
        super(props);

        // Bar Attributes
        //Note - want to be able to turn on fillEvenly and we ignore barwidth but apply spacing
        this.fillEvenly = props.fillEvenly || true
        this.barSpacing = props.barSpacing || 20;
        if (this.fillEvenly){
            //- (this.barSpacing*this.values.length*2)
            this.barWidth = ((this.width - parseInt(this.gridFontSize)) - (this.barSpacing*this.values.length*2)) / this.values.length
        } else {
            this.barWidth = props.barWidth || 20;
        }
        this.hover = props.hover || true;
        this.colors = props.colors || ['red','green','blue','yellow','orange']
        this.topSpacing = props.topSpacing || 50;
        this.shadowColor = props.shadowColor || 'darkblue';
        this.shadowSize = props.shadowSize || 4
        this.scale = props.scale || 5;

        //Calculations
        this._LABEL_INSET = parseInt(this.gridFontSize)
        this._BAR_WIDTH = this.barWidth//(this.width / this.barWidth)
        this._MAX_ARR = Math.max(...this.values);
        this._GRID_LINES = Math.ceil( this._MAX_ARR / this.scale )
        this._MAX = this._GRID_LINES * this.scale
        this._MAX_BAR_HEIGHT = this.height - this.topSpacing
        this._GRID_LINE_SPACE = this._MAX_BAR_HEIGHT / this._GRID_LINES
    }

    drawBars = () => {

        // Draw Axis
        drawLine(this.context, 0, this.height, 0, 0);
        drawLine(this.context, 0, this.height, this.width, this.height)


        // Draw Grid
        for(let x = 0; x < this._GRID_LINES + this.showZero; x ++) {
            let lineY = ((x * this.scale) / this._MAX ) * this._MAX_BAR_HEIGHT + this.topSpacing
            drawLine(this.context, 0, lineY,this.width, lineY,this.gridLineColor)
            drawLabel(this.context,(this._GRID_LINES - x) * this.scale, this.gridLabelInset, lineY - parseInt(this.gridFontSize),this.gridFontSize, this.gridFontFamily, this.gridFontColor)
        }

        // Draw Bars

        let maxX = 0;
        for(let i = 0; i < this.values.length; i++) {
            let x =(i * this._BAR_WIDTH) + (i * (this.barSpacing) * 2) + this.barSpacing + this._LABEL_INSET;
            let y = this.height;
            let barHeight = ( - this.values[i] / this._MAX ) * this._MAX_BAR_HEIGHT;
            if ( x + this._BAR_WIDTH > maxX) maxX = x + this._BAR_WIDTH;

            //Render what fits in viewport
            if (x < this.viewport.x + this.viewport.w || x + this._BAR_WIDTH > this.viewport.x) {
                if(this.pointer.x >= (x - this.viewport.x) && this.pointer.x <= (x - this.viewport.x) + this._BAR_WIDTH && this.pointer.y <= y && this.pointer.y >= y + barHeight) {
                    this.context.shadowBlur = this.shadowSize;
                    this.context.shadowColor = this.shadowColor;
                }
                this.context.beginPath()
                this.context.rect(x - this.viewport.x, y, this._BAR_WIDTH, barHeight)
                this.context.stroke()
                this.context.shadowBlur = 0
            }
        }
    }

    draw() {
        this.mainLoop(this.drawBars)
    }
}


