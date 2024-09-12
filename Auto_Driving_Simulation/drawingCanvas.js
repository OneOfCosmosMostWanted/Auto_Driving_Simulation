// Get the canvas element
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth * 0.7;
canvas.height = window.innerHeight;
ctx.fillStyle = "gray";
ctx.fillRect(0, 0, canvas.width, canvas.height);

console.log(canvas.width);

// Set initial drawing properties
ctx.lineWidth = 3;
ctx.lineCap = 'round';
ctx.strokeStyle = '#000';

let isDrawing = false;
let lastX = 0;
let lastY = 0;

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
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
  isDrawing = false;
}