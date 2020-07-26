/**
     * Method to draw bars
     */
    drawBars = () => {
        let maxX = 0;
        for(let i = 0; i < this.values.length; i++) {
            let x =(i * this._BAR_WIDTH) + (i * (this.barSpacing) * 2) + this.barSpacing + this._LABEL_INSET;
            let y = this._BAR_BOTTOM;
            let barHeight = ( - this.values[i] / this._MAX ) * this._MAX_BAR_HEIGHT;
            if ( x + this._BAR_WIDTH > maxX) maxX = x + this._BAR_WIDTH;

            //Render what fits in viewport
            if (x < this.viewport.x + this.viewport.w || x + this._BAR_WIDTH > this.viewport.x) {
                if(this.hover && this.pointer.x >= (x - this.viewport.x) && this.pointer.x <= (x - this.viewport.x) + this._BAR_WIDTH && this.pointer.y <= y && this.pointer.y >= y + barHeight) {
                    drawLabel(this.context, formatNumber(this.values[i]), x + (this._BAR_WIDTH / 2), y + barHeight - 18, this.barHoverFontSize, this.barHoverFontFamily, this.barHoverFontColor, 'center')
                    this.context.shadowBlur = this.shadowSize;
                    this.context.shadowColor = this.shadowColor;
                }
                this.colorMap[i] = this.colorMap[i] || this.colorWheel.get()
                this.context.beginPath()
                this.context.fillStyle = this.colorMap[i]
                roundedRect(this.context, x - this.viewport.x, y, this._BAR_WIDTH, barHeight, this.cornerRadius, this.colorMap[i])
                // this.context.fillRect(x - this.viewport.x, y, this._BAR_WIDTH, barHeight)
                this.context.stroke()
                this.context.shadowBlur = 0
                drawLabel(this.context, this.labels[i] || '', x + (this._BAR_WIDTH / 2), this.height - (this.labelSpace / 4), this.xAxisFontSize, this.xAxisFontFamily, this.xAxisFontColor, 'center')
            }
        }
    }