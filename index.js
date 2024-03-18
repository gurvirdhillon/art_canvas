document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('drawingCanvas');
  const context = canvas.getContext('2d');
  let drawing = false;

  let currentColor = localStorage.getItem('currentColor') || '#000000';
  let currentThickness = localStorage.getItem('currentThickness') || 2;
  context.strokeStyle = currentColor;
  context.lineWidth = currentThickness;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colorPicker = document.querySelector('#colorPicker');
  const thicknessInput = document.querySelector('#strokeThickness');
  const rubberButton = document.querySelector('.rubber');

  colorPicker.addEventListener('input', updateColor);
  thicknessInput.addEventListener('input', updateThickness);
  rubberButton.addEventListener('click', useRubber);

  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  canvas.addEventListener('touchstart', startDrawing);
  canvas.addEventListener('touchmove', draw);
  canvas.addEventListener('touchend', stopDrawing);

  function startDrawing(e) {
    drawing = true;
    draw(e);
  }

  function draw(e) {
    if (!drawing) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.type === 'touchmove' || e.type === 'touchstart') {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
      e.preventDefault();
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  }

  function stopDrawing() {
    drawing = false;
    context.closePath();
    context.beginPath();
  }

  function updateColor() {
    currentColor = colorPicker.value;
    context.strokeStyle = currentColor;
    localStorage.setItem('currentColor', currentColor);

    if (rubberButton.classList.contains('rubber-active')) {
      context.globalCompositeOperation = 'source-over';
    }
  }

  function updateThickness() {
    currentThickness = thicknessInput.value;
    context.lineWidth = currentThickness;
    localStorage.setItem('currentThickness', currentThickness);
  }

  function useRubber() {
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = currentThickness * 2;
    rubberButton.classList.add('rubber-active');
  }

  rubberButton.addEventListener('mouseup', () => {
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = currentThickness;
  });

  window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});

function saveCanvas() {
  const canvas = document.querySelector('#drawingCanvas');
  const canvasDataUrl = canvas.toDataURL();
  localStorage.setItem('savedCanvas', canvasDataUrl);
}

function loadSavedCanvas() {
  const savedCanvas = localStorage.getItem('savedCanvas');
  if (savedCanvas) {
    const canvas = document.querySelector('#drawingCanvas');
    const context = canvas.getContext('2d');
    const savedImage = new Image();
    savedImage.onload = function () {
      context.drawImage(savedImage, 0, 0); // Draw saved image onto canvas
    };
    savedImage.src = savedCanvas;
  }
}

window.addEventListener('load', loadSavedCanvas);

const saveButton = document.querySelector('.save');
saveButton.addEventListener('click', saveCanvas);
