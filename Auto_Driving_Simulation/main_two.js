// Get the canvas element
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight * 0.7;
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvas.width, canvas.height);

console.log(canvas.width);

const car = new Car(100, 300, 10, 30, "KEYS", 2)

let lines = null;


function animate(time) {
  
  if (lines === null) {
    car.update([], [], []);
  } else {
    car.update([], [], lines);
  }

  canvas.width = window.innerWidth * 0.7;
  canvas.height = window.innerHeight * 0.9;
  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#000';

  car.draw(ctx, "blue", true);
  replayDrawingLines()
  lines = formatDrawings();


  ctx.restore();

  requestAnimationFrame(animate);
}

// Set initial drawing properties
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.strokeStyle = '#000';

let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Array to store all the lines drawn
let drawingLines = [];

// Event listeners for mouse movement
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

function startDrawing(e) {
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!isDrawing) return;
  const [x, y] = [e.offsetX, e.offsetY];
  drawingLines.push({ startX: lastX, startY: lastY, endX: x, endY: y });
  drawLineOnCanvas(ctx, lastX, lastY, x, y);
  [lastX, lastY] = [x, y];
}

function stopDrawing() {
  isDrawing = false;
  // When the user stops drawing, push a null object to indicate the end of the line segment
  drawingLines.push(null);
}

// Function to draw a line on the canvas
function drawLineOnCanvas(ctx, startX, startY, endX, endY) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
}

// Function to replay all the lines on the other canvas
function replayDrawingLines() {
  //ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear other canvas
  let currentLineStart = { x: 0, y: 0 }; // Store the starting point of the current line segment
  drawingLines.forEach(line => {
    if (line === null) {
      // If the line segment is null, it indicates the end of the current line
      currentLineStart = { x: 0, y: 0 };
    } else {
      // If the line segment is not null, draw the line from the starting point to the end point
      if (currentLineStart.x !== 0 || currentLineStart.y !== 0) {
        drawLineOnCanvas(ctx, currentLineStart.x, currentLineStart.y, line.startX, line.startY);
      }
      drawLineOnCanvas(ctx, line.startX, line.startY, line.endX, line.endY);
      currentLineStart = { x: line.endX, y: line.endY }; // Update the starting point for the next line segment
    }
  });
}

function formatDrawings() {
  let arrayDrawings = [];
  let polygon = [];
  drawingLines.forEach(line => {
    if (line === null) {
      arrayDrawings.push(polygon);
      polygon = [];
    } else {
      polygon.push({ x: line.startX, y: line.startY });
      polygon.push({ x: line.endX, y: line.endY });
    }
  });
  return arrayDrawings;
}

animate();