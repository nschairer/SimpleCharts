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
![blankBar](./img/simpleBar.gif)