class LiteChart {
  /**
   * Creates an instance of LiteChart.
   * @param {Object} options - Configuration options for the chart.
   * @param {Array<number>} options.data - The data points for the chart.
   * @param {string} [options.type="line"] - The type of chart ("line", "bar", "point", "pie").
   * @param {Array<string>} [options.colors=["#4e73df", "#1cc88a", "#36b9cc"]] - Array of colors for the chart.
   */
  constructor(options = {}) {
    this.data = options.data || [];
    this.type = options.type || "line";
    this.colors = options.colors || ["#4e73df", "#1cc88a", "#36b9cc"];
    this.padding = 40;
    this.axisColor = "#333";
    this.gridColor = "#ccc";
    this.pointRadius = 5;
    this.canvas = null;
    this.ctx = null;
  }

  /**
   * Initializes and renders the chart in the specified HTML element.
   * @param {string} elementId - The ID of the HTML element where the chart will be rendered.
   */
  spawn(elementId) {
    const element = document.getElementById(elementId);

    this.canvas = document.createElement("canvas");
    this.canvas.classList.add("chart");
    this.canvas.addEventListener("click", () => {
      setCanvasIntoFullScreen(this.canvas);
      toggleFullscreen(true);
    });
    element.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    if (this.type === "pie") {
      const size = Math.min(element.offsetWidth, element.offsetHeight);
      this.canvas.width = size;
      this.canvas.height = size;
    } else {
      this.canvas.width = element.offsetWidth;
      this.canvas.height = element.offsetHeight;
    }

    this.draw();
  }

  /**
   * Draws the chart based on the type specified.
   */
  draw() {
    this.clearCanvas();
    this.drawAxes();
    this.drawLabels();
    switch (this.type) {
      case "line":
        this.drawLineChart();
        break;
      case "bar":
        this.drawBarChart();
        break;
      case "point":
        this.drawPointChart();
        break;
      case "pie":
        this.drawPieChart();
        break;
      default:
        console.error("Unknown chart type");
    }
  }

  /**
   * Clears the canvas.
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Gets the maximum value from the data set.
   * @returns {number} The maximum value.
   */
  getMaxValue() {
    return Math.max(...this.data);
  }

  /**
   * Draws the axes and grid lines for the chart.
   */
  drawAxes() {
    if (this.type === "pie") return;

    this.ctx.strokeStyle = this.axisColor;
    this.ctx.lineWidth = 2;

    // Draw Y-axis
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding, 0);
    this.ctx.lineTo(this.padding, this.canvas.height - this.padding);
    this.ctx.stroke();

    // Draw X-axis
    this.ctx.beginPath();
    this.ctx.moveTo(this.padding, this.canvas.height - this.padding);
    this.ctx.lineTo(this.canvas.width, this.canvas.height - this.padding);
    this.ctx.stroke();

    // Draw grid lines
    this.ctx.strokeStyle = this.gridColor;
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([5, 5]);

    // Horizontal grid lines
    for (let i = 1; i < 5; i++) {
      const y = ((this.canvas.height - this.padding) / 5) * i;
      this.ctx.beginPath();
      this.ctx.moveTo(this.padding, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Vertical grid lines
    for (let i = 1; i < 5; i++) {
      const x = ((this.canvas.width - this.padding) / 5) * i + this.padding;
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height - this.padding);
      this.ctx.stroke();
    }

    this.ctx.setLineDash([]);
  }

  /**
   * Draws the labels for the chart axes.
   */
  drawLabels() {
    if (this.type === "pie") return;

    const maxValue = this.getMaxValue();
    const step = maxValue / 5;

    this.ctx.fillStyle = this.axisColor;
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "right";

    // Y-axis labels
    for (let i = 0; i <= 5; i++) {
      const value = step * i;
      const y =
        this.canvas.height -
        this.padding -
        (value / maxValue) * (this.canvas.height - this.padding * 2);
      if (i > 0) {
        this.ctx.fillText(value.toFixed(0), this.padding - 10, y + 3);
      }
    }

    const dataStep = this.data.length / 5;
    this.ctx.textAlign = "center";

    // X-axis labels
    for (let i = 0; i <= 5; i++) {
      const index = Math.round(dataStep * i);
      const x = this.getXPosition(index);
      if (i > 0) {
        this.ctx.fillText(index, x, this.canvas.height - this.padding + 20);
      }
    }
  }

  /**
   * Calculates the Y position for a given value.
   * @param {number} value - The data value.
   * @param {number} maxValue - The maximum value in the data set.
   * @returns {number} The Y position on the canvas.
   */
  getYPosition(value, maxValue) {
    return (
      this.canvas.height -
      this.padding -
      (value / maxValue) * (this.canvas.height - this.padding * 2)
    );
  }

  /**
   * Calculates the X position for a given index.
   * @param {number} index - The data index.
   * @returns {number} The X position on the canvas.
   */
  getXPosition(index) {
    return (
      this.padding +
      (index / (this.data.length - 1)) * (this.canvas.width - this.padding * 2)
    );
  }

  /**
   * Draws a line chart.
   */
  drawLineChart() {
    const maxValue = this.getMaxValue();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.colors[0];
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.getXPosition(0),
      this.getYPosition(this.data[0], maxValue)
    );

    for (let i = 1; i < this.data.length; i++) {
      const x = this.getXPosition(i);
      const y = this.getYPosition(this.data[i], maxValue);
      this.ctx.lineTo(x, y);
    }
    this.ctx.stroke();

    // Draw points on the line
    for (let i = 0; i < this.data.length; i++) {
      const x = this.getXPosition(i);
      const y = this.getYPosition(this.data[i], maxValue);
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.pointRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colors[1];
      this.ctx.fill();
    }
  }

  /**
   * Draws a bar chart.
   */
  drawBarChart() {
    const maxValue = this.getMaxValue();
    const barWidth = (this.canvas.width - this.padding * 2) / this.data.length;

    for (let i = 0; i < this.data.length; i++) {
      const x = this.padding + i * barWidth;
      const y = this.getYPosition(this.data[i], maxValue);
      this.ctx.fillStyle = this.colors[i % this.colors.length];
      this.ctx.fillRect(
        x,
        y,
        barWidth - 10,
        this.canvas.height - this.padding - y
      );
    }
  }

  /**
   * Draws a point chart.
   */
  drawPointChart() {
    const maxValue = this.getMaxValue();
    for (let i = 0; i < this.data.length; i++) {
      const x = this.getXPosition(i);
      const y = this.getYPosition(this.data[i], maxValue);
      this.ctx.beginPath();
      this.ctx.arc(x, y, this.pointRadius, 0, Math.PI * 2);
      this.ctx.fillStyle = this.colors[i % this.colors.length];
      this.ctx.fill();
    }
  }

  /**
   * Draws a pie chart.
   */
  drawPieChart() {
    const total = this.data.reduce((sum, value) => sum + value, 0);
    let startAngle = 0;

    for (let i = 0; i < this.data.length; i++) {
      const sliceAngle = (this.data[i] / total) * 2 * Math.PI;
      this.ctx.beginPath();
      this.ctx.moveTo(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.arc(
        this.canvas.width / 2,
        this.canvas.height / 2,
        Math.min(this.canvas.width / 2, this.canvas.height / 2) - this.padding,
        startAngle,
        startAngle + sliceAngle
      );
      this.ctx.closePath();
      this.ctx.fillStyle = this.colors[i % this.colors.length];
      this.ctx.fill();

      const middleAngle = startAngle + sliceAngle / 2;
      const labelX =
        this.canvas.width / 2 +
        Math.cos(middleAngle) *
          (Math.min(this.canvas.width / 2, this.canvas.height / 2) -
            this.padding / 2);
      const labelY =
        this.canvas.height / 2 +
        Math.sin(middleAngle) *
          (Math.min(this.canvas.width / 2, this.canvas.height / 2) -
            this.padding / 2);

      const percentage = ((this.data[i] / total) * 100).toFixed(1) + "%";
      this.ctx.fillStyle = "#000";
      this.ctx.fillText(percentage, labelX, labelY);

      startAngle += sliceAngle;
    }
  }
}

function toggleFullscreen(open = false) {
  const element = document.getElementById("fullScreenModal");
  element.style.display = open ? "flex" : "none";
}

function setLibStyles() {
  const styleText = `
    .chart-container {
      width: 100%;
      padding: 16px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
    }

    .chart {
      width: 100%;
      border: 1px solid #ccc;
      border-radius: 10px;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styleText;
  document.head.appendChild(styleSheet);
}

function createFullScreenModal() {
  const styleText = `
    #fullScreenModal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      display: none; /* Скрыт по умолчанию */
      justify-content: center;
      align-items: center;
      backdrop-filter: blur(10px);
      z-index: 9999;
      padding: 2vh 2vw;
    }
    #fullScreenModal canvas {
      background-color: rgb(255, 255, 255);
      width: auto;
      max-width: 96svw;
      max-height: 96svh;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styleText;
  document.head.appendChild(styleSheet);

  const modal = document.createElement("div");
  modal.classList.add("fullscreen-modal-graph");
  modal.id = "fullScreenModal";
  modal.addEventListener("click", toggleFullscreen);
  document.body.appendChild(modal);

  return modal;
}

function closeFullScreenModal() {
  const modal = document.getElementById("fullScreenModal");
  modal.style.display = "none";
  modal.removeEventListener("click", closeFullScreenModal);
}

function setCanvasIntoFullScreen(canvas) {
  const modal = document.getElementById("fullScreenModal");
  modal.innerHTML = "";
  modal.style.display = "flex";

  const modalCanvas = canvas.cloneNode(true);
  modal.appendChild(modalCanvas);

  modal.addEventListener("click", closeFullScreenModal);

  const ctx = canvas.getContext("2d");
  const modalCtx = modalCanvas.getContext("2d");

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  modalCanvas.width = canvas.width;
  modalCanvas.height = canvas.height;
  modalCtx.putImageData(imgData, 0, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = createFullScreenModal();
  setLibStyles();
  window.fullScreenModal = modal;
});
