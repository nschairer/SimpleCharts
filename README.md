# SimpleCharts
Simple charting library in Vanilla js <br><br>

## Usage
For now download SimpleBarChart.js and place it in your project directory
```JavaScript
const bars = new SimpleBarChart({
    id: 'bar',
    values: [11.2,28,3,39,15,36,17],
    labels: ['Bar 1', 'Bar 2', 'Bar 3', 'Bar 4', 'Bar 5', 'Bar 6', 'Bar 7']
})

bars.draw()
```
<br>

![simpleBar](./img/simpleBar.gif)

# Properties
## Minimal:
* <b>id</b> - Element id referring to the canvas element to draw the chart on
* <b>values</b> - List of values to display
* <b>labels</b> - List of labels associated with list of values
## Styles:
* <b>backgroundColor</b> - Valid CSS color for chart background - default is lightcoral
* <b>Y-Axis</b>
  * <b>gridLineColor</b> - Valid CSS color for grid lines - default is black
  * <b>gridFontFamily</b> - Font for y-axis labels - default is sans-serif
  * <b>gridFontColor</b> - Font color for y-axis labels - default is black
  * <b>gridFontSize</b> - Font size for y-axis labels - default is 18px
  * <b>gridLabelInset</b> - Inset of y-axis labels from edge of canvas - default is 2
  * <b>showZero</b> - Show or hide 0 on y-axis, boolean
* <b>X-Axis</b>
  * <b>xAxisFontFamily</b> - Font for x-axis labels - default is sans-serif
  * <b>xAxisFontSize</b> - Font size for x-axis - default is 18px
  * <b>xAxisFontColor</b> - Font color for x - axis labels - default is black
  * <b>labelSpace</b> - Space between x-axis labels and bottom of canvas - default is 30

# SimpleBarChart
## Properties
* <b>fillEvenly</b> - Fill space evenly with bars or let them expand beyond with horizontal scrolling (Note: Horizontal scrolling in progress)
* <b>barSpacing</b> - Space between bars
* <b>barWidth</b> - Width of bars
* <b>barHoverFontFamily</b> - Font of hover labels on bars - default is sans-serif
* <b>barHoverFontSize</b> - Font size of hover labels on bars - default is 24px
* <b>barHoverFontColor</b> - Font color of hover labels on bars - default is black
* <b>hover</b> - Highlight bar if mouse hovers - boolean (Not finished)
* <b>colors</b> - List of CSS colors for bars
* <b>topSpacing</b> - Spacing from top of chart to top of canvas - default is 50
* <b>shadowColor</b> - Box shadow color around highlighted bar when hovering - default is black
* <b>shadowSize</b> - Size of box shadow around highlighted bar - default is 4
* <b>scale</b> - Scale for y-axis - default is 5