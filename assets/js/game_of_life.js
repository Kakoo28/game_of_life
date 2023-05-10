// RECUPERATION DES ELEMENTS PRINCIPAUX DU DOM
const GRID_CONTAINER = document.getElementById('container');
const GENERATION_COUNT = document.getElementById('generation-count');
const START_BTN = document.getElementById('start-btn');

// VARIABLES GLOBALES

const ROWS = Math.floor(window.innerHeight / 20);
const COLS = Math.floor(window.innerWidth / 20);

let GRID = new Array(ROWS);
let NEXT_GRID = new Array(ROWS);

let is_running = false;
let mouse_down = false;

let generation = 0;

let game_interval;
let interval_time = 100;

// FONCTION LERP (UTILE POUR LA BARRE DE VITESSE)
function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}

// FONCTION INIT
function init() {
    drawGrid();
    initGrids();
    resetGrids();
    setupControls();
}

// FONCTIONS DU JEU

function play() {
    gotoNextGeneration();

    if (is_running) {
        game_interval = setTimeout(() => {
            requestAnimationFrame(play);
        }, interval_time);
    }
}
function gotoNextGeneration() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            applyRules(row, col);
        }
    }

    copyAndResetGrid();
    updateGrid();
    generation++;
    GENERATION_COUNT.innerText = `GENERATION : ${generation}`;
}

function applyRules(row, col) {
    const neighborCount = countAliveNeighbors(row, col);
    if (GRID[row][col] === 1 && (neighborCount > 3 || neighborCount < 2)) {
        NEXT_GRID[row][col] = 0;
    } else if (GRID[row][col] === 0 && neighborCount === 3) {
        NEXT_GRID[row][col] = 1;
    } else {
        NEXT_GRID[row][col] = GRID[row][col];
    }
}

function countAliveNeighbors(c_row, c_col) {
    let count = 0;
    for (let row = -1; row <= 1; row++) {
        for (let col = -1; col <= 1; col++) {
            if (row === 0 && col === 0) continue;

            const neighborRow = c_row + row;
            const neighborCol = c_col + col;

            if (neighborRow < 0 || neighborCol < 0 || neighborRow >= ROWS || neighborCol >= COLS) continue;
            if (GRID[neighborRow][neighborCol] === 1) count++;
        }
    }
    return count;
}

// FONCTIONS POUR LA GRILLE

function drawGrid() {
    const table = document.createElement("table");
    table.id = "game-of-life";

    for (let row = 0; row < ROWS; row++) {
        const tr = document.createElement("tr");
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("td");
            cell.classList.add('cell');
            cell.setAttribute("id", row + "_" + col);
            cell.setAttribute("status", "dead");

            cell.addEventListener('mouseover', cellMouseHoverHandler);
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    GRID_CONTAINER.appendChild(table);
}

function initGrids() {
    for (let row = 0; row < ROWS; row++) {
        GRID[row] = new Array(COLS);
        NEXT_GRID[row] = new Array(COLS);
    }
}

function resetGrids() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            GRID[row][col] = 0;
            NEXT_GRID[row][col] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            GRID[row][col] = NEXT_GRID[row][col];
            NEXT_GRID[row][col] = 0;
        }
    }
}

function updateGrid() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.getElementById(row + "_" + col);
            if (GRID[row][col] === 0) {
                cell.setAttribute("status", "dead");
            } else {
                cell.setAttribute("status", "alive");
            }
        }
    }
}

// GESTION DES BOUTONS

function startButtonHandler() {
    const pause_icon = "./assets/icons/pause-icon.svg";
    const play_icon = "./assets/icons/play-icon.svg";
    if (is_running) {
        is_running = false;
        this.children[0].src = play_icon;
        this.classList.remove('pause');
        clearTimeout(game_interval);
    } else {
        is_running = true;
        this.children[0].src = pause_icon;
        this.classList.add('pause');
        play();
    }
}

function resetButtonHandler() {
    is_running = false;
    generation = 0;

    GENERATION_COUNT.innerText = `GENERATION : 0`;

    START_BTN.children[0].src = "./assets/icons/play-icon.svg";
    START_BTN.classList.remove('pause');
    clearTimeout(game_interval);

    const aliveCells = document.querySelectorAll('.cell[status="alive"]');

    for (let i = 0; i < aliveCells.length; i++) {
        aliveCells[i].setAttribute("status", "dead");
    }
    resetGrids();
}

function randomButtonHandler() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const isAlive = Math.random() > 0.5;
            const cell = document.getElementById(row + "_" + col);
            if (isAlive) {
                cell.setAttribute("status", "alive");
                GRID[row][col] = 1;
            } else {
                cell.setAttribute("status", "dead");
                GRID[row][col] = 0;
            }
        }
    }

}

// FONCTIONS PERMETTANT DE DESSINER SUR LA GRILLE

function cellMouseHoverHandler() {
    if (mouse_down) {
        const [row, col] = this.id.split('_');
        const isAlive = this.getAttribute("status") === "alive";

        GRID[row][col] = isAlive ? 0 : 1;
        this.setAttribute("status", isAlive ? "dead" : "alive");
    }
}

function mouseDownHandler(e) {
    const target = e.target.closest(".cell");
    if (target) {
        const [row, col] = target.id.split('_');
        const isAlive = target.getAttribute("status") === "alive";

        GRID[row][col] = isAlive ? 0 : 1;
        target.setAttribute("status", isAlive ? "dead" : "alive");
    }

    mouse_down = true;
}

function mouseUpHandler() {
    if (mouse_down) mouse_down = false;
}

// SETUP CONTROLS / BUTTONS, ADDEVENTLISTENERS

function setupControls() {
    // BUTTONS
    START_BTN.addEventListener('click', startButtonHandler);

    const FORWARD_BTN = document.getElementById('forward-btn');
    FORWARD_BTN.addEventListener('click', () => {
        if (is_running) {
            START_BTN.click();
        }
        play();
    });

    const RESET_BTN = document.getElementById('reset-btn');
    RESET_BTN.addEventListener('click', resetButtonHandler);

    const RANDOM_BTN = document.getElementById('random-btn');
    RANDOM_BTN.addEventListener('click', randomButtonHandler);

    // SPEED RANGE
    const SPEED_RANGE = document.getElementById('speed-range');
    interval_time = lerp(300, 40, SPEED_RANGE.value / 100);
    SPEED_RANGE.addEventListener('input', () => {
        interval_time = lerp(300, 0, SPEED_RANGE.value / 100);
    });

    // MOUSE DOWN/UP (DRAWING CELLS)
    document.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mouseup', mouseUpHandler);


    // OVERLAY HIDE
    const HIDE_BTN = document.getElementById('hide-btn');
    const OVERLAY = document.getElementById('overlay');
    HIDE_BTN.addEventListener('click', () => OVERLAY.classList.toggle('hide'));

    // KEY PRESS
    document.addEventListener('keypress', (e) => {
        if (e.code === "KeyO") {
            HIDE_BTN.click();
        }
        if (e.code === "Space") {
            startButtonHandler()
        }
    });
}

init();