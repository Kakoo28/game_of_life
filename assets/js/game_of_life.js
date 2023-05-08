// ELEMENTS DOM

const RESET_BTN = document.getElementById('reset-btn');
const START_BTN = document.getElementById('start-pause-btn');
const RANDOM_BTN = document.getElementById('random-btn');
const FORWARD_BTN = document.getElementById('forward-btn');
const SPEED_RANGE = document.getElementById('speed-range');

// VARIABLES GLOBALS

let mouse_down = false;
let is_running = false;
let generation_count = 0;

// FONCTIONS

function getCell(x, y) { // RECUPERER UNE CELL AVEC SES COORDONNEES
    return document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
}

function reset() { // FONCTION RESET GRID ET VARIABLES GLOBALS
    document.querySelectorAll('.cell[data-is-alive="true"]').forEach(cell => cell.dataset.isAlive = "false");

    if (is_running) {
        START_BTN.querySelector('img').src = "./assets/icons/play-icon.svg";
        START_BTN.classList.remove('paused');
        is_running = false;
    }

    mouse_down = false;
}

function startButton() { // FONCTION BOUTON START_PAUSE CLIQUER
    const icon = START_BTN.querySelector('img');
    if (is_running) {
        icon.src = "./assets/icons/play-icon.svg";
        START_BTN.classList.remove('paused');
        is_running = false;
    } else {
        icon.src = "./assets/icons/pause-icon.svg";
        START_BTN.classList.add('paused');
        is_running = true;
    }
}

function randomGen() { // GENERATION RANDOM OPTIMISEE
    // CREATION D'UN TABLEAU GRID_SIZE_X * GRID_SIZE_Y (200x200) QUI CONTIENT POUR CHAQUE CELLULE TRUE OU FALSE GENERE GRACE A UN MATH.RANDOM() > 0.5
    const randomCells = Array.from({ length: GRID_SIZE_X * GRID_SIZE_Y }, () => Math.random() > 0.5);

    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, i) => {
        const isAlive = randomCells[i];
        cell.dataset.isAlive = isAlive ? "true" : "false";
    });
}

function getAdjacentCells(cell_x, cell_y) { // RECUPERER TOUTES LES CELLULES ADJACENTES
    const neighbors = [];
    for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
            if (x === 0 && y === 0) {
                continue;
            }
            const neighborX = parseInt(cell_x) + x;
            const neighborY = parseInt(cell_y) + y;

            if (neighborX < 1 || neighborY < 1 || neighborX > GRID_SIZE_X || neighborY > GRID_SIZE_Y) { // SI LE VOISIN EST HORS GRILLE
                continue;
            }

            neighbors.push([neighborX, neighborY]);
        }
    }
    return neighbors;
}

function updateCells() {
    const cells = document.querySelectorAll('.cell');
    const adjCells = {};
    const cellsToUpdate = [];

    for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const x = parseInt(cell.dataset.x, 10);
        const y = parseInt(cell.dataset.y, 10);

        if (!adjCells[x]) {
            adjCells[x] = {};
        }
        if (!adjCells[x][y]) {
            adjCells[x][y] = getAdjacentCells(x, y).map(coords => {
                return {
                    x: coords[0],
                    y: coords[1],
                    cell: getCell(coords[0], coords[1])
                };
            });
        }

        const adjCount = adjCells[x][y].reduce((count, adjCell) => {
            return count + (adjCell.cell.dataset.isAlive === "true" ? 1 : 0);
        }, 0);

        const isAlive = cell.dataset.isAlive === "true";
        if (isAlive) {
            if (adjCount > 3 || adjCount < 2) {
                cellsToUpdate.push(cell);
            }
        } else if (adjCount === 3) {
            cellsToUpdate.push(cell);
        }
    }

    for (let i = 0; i < cellsToUpdate.length; i++) {
        cellsToUpdate[i].dataset.isAlive = cellsToUpdate[i].dataset.isAlive === "true" ? "false" : "true";
    }

    generation_count++;
}




// GAME INTERVAL | SPEED UPDATE

let gameInterval;

function updateInterval() {
    clearInterval(gameInterval);
    const v = (100 - parseInt(SPEED_RANGE.value)) * 7.5;

    gameInterval = setInterval(() => {
        if (is_running) {
            updateCells();
        }
    }, v);
}

updateInterval();

SPEED_RANGE.addEventListener('input', updateInterval);

// BUTTONS EVENT LISTENER

RESET_BTN.addEventListener('click', reset);
START_BTN.addEventListener('click', startButton);
RANDOM_BTN.addEventListener('click', randomGen);
FORWARD_BTN.addEventListener('click', updateCells);