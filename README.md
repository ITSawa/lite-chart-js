# LiteChart

LiteChart is a JavaScript library for creating various types of charts, including line, bar, point, and pie charts. It allows for easy configuration and rendering of charts in web applications.

## Features

- **Multiple chart types:** line, bar, point, and pie.
- **Customizable chart colors.**
- **Auto-scaling and grid lines** for line, bar, and point charts.
- **Responsive pie charts** that adapt to the container size.
- **Interactive and responsive charts.**

## Installation

To install LiteChart, you can use **npm** or include it directly in your HTML file.

### Using npm

Install LiteChart via npm with the following command:

```bash
npm install lite-chart-js
Tip: To copy the command, simply click on the box above.

Including in HTML
Alternatively, include LiteChart directly in your HTML file by referencing the script:

html

<script src="path/to/charts.js"></script>
Usage
Creating a LiteChart
To create a LiteChart, instantiate the class with the desired options:

javascript

const chart = new LiteChart({
  data: [10, 20, 30, 40, 50],
  type: 'line', // Possible values: 'line', 'bar', 'point', 'pie'
  colors: ['#4e73df', '#1cc88a', '#36b9cc']
});
Rendering the Chart
Render the chart in a specified HTML element by calling the spawn method with the element's ID:

javascript

chart.spawn('chartContainer');
Full Example
Here's a full HTML example to use LiteChart in your project:

html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LiteChart Example</title>
  <script src="path/to/LiteChart.js"></script>
</head>
<body>
  <div class="chart-container" id="chartContainer"></div>

  <script>
    const chart = new LiteChart({
      data: [10, 20, 30, 40, 50],
      type: 'line', // You can change this to 'bar', 'point', or 'pie'
      colors: ['#4e73df', '#1cc88a', '#36b9cc']
    });
    chart.spawn('chartContainer');
  </script>
</body>
</html>
API
Constructor: new LiteChart(options)
Create a new LiteChart instance with the provided options.

options: An object containing the configuration for the chart.
data: An array of numbers representing the data points for the chart.
type: A string representing the type of chart ('line', 'bar', 'point', 'pie'). Default is 'line'.
colors: An array of strings representing the colors for the chart. Default is ['#4e73df', '#1cc88a', '#36b9cc'].
Methods
spawn(elementId)
Initializes and renders the chart in the specified HTML element.

elementId: The ID of the HTML element where the chart will be rendered.
draw()
Draws the chart based on the type specified in the constructor.

clearCanvas()
Clears the canvas.

getMaxValue()
Returns the maximum value from the data set.

drawAxes()
Draws the axes and grid lines for the chart.

drawLabels()
Draws the labels for the chart axes.

getYPosition(value, maxValue)
Calculates the Y position for a given value.

value: The data value.
maxValue: The maximum value in the data set.
getXPosition(index)
Calculates the X position for a given index.

index: The data index.
drawLineChart()
Draws a line chart.

drawBarChart()
Draws a bar chart.

drawPointChart()
Draws a point chart.

drawPieChart()
Draws a pie chart.

License
LiteChart is licensed under the MIT License. See the LICENSE file for more information.
