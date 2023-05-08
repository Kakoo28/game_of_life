const GRID = document.getElementById('game-of-life');
const OVERLAY = document.getElementById('overlay');
const HIDE_BTN = document.getElementById('hide-btn');

const GRID_SIZE_X = 50;
const GRID_SIZE_Y = 50;

function drawGrid(cols, rows) {
  GRID.style.gridTemplateColumns = `repeat(${cols}, 20px)`;
  GRID.style.gridTemplateRows = `repeat(${rows}, 20px)`;

  const fragment = document.createDocumentFragment();

  for (let y = 1; y <= rows; y++) {
    for (let x = 1; x <= cols; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-x', x);
      cell.setAttribute('data-y', y);
      fragment.appendChild(cell);
    }
  }

  GRID.innerHTML = '';
  GRID.appendChild(fragment);

  // ECOUTEUR D'EVENEMENT ON HOVER
  document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('mouseover', () => {
    if (mouse_down) {
      cell.dataset.isAlive = cell.dataset.isAlive === "true" ? "false" : "true";
    }
  }));
}

// ZOOM IN / OUT

document.getElementById('zoom-in').addEventListener("click", () => {
  const currentScale = parseFloat(getComputedStyle(GRID).getPropertyValue('--scale'));

  if (currentScale < 2) {
    const newScale = currentScale + 0.1;
    GRID.style.setProperty('--scale', newScale);
  }
})

document.getElementById('zoom-out').addEventListener("click", () => {
  const currentScale = parseFloat(getComputedStyle(GRID).getPropertyValue('--scale'));

  if (currentScale > 0.5) {
    const newScale = currentScale - 0.1;
    GRID.style.setProperty('--scale', newScale);
  }
})


// EVENEMENTS SOURIS (POUR DESSINER LES CELLULES)

GRID.addEventListener("mousedown", e => {
  mouse_down = true;
  const target = e.target.closest(".cell");
  if (target) {
    target.dataset.isAlive = target.dataset.isAlive === "true" ? "false" : "true";
  }
});

document.addEventListener("mouseup", () => {
  mouse_down = false;
});


drawGrid(GRID_SIZE_X, GRID_SIZE_Y);