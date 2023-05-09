const GRID_CONTAINER = document.getElementById('container');

const ROWS = Math.floor(window.innerHeight / 20);
const COLS = Math.floor(window.innerWidth / 20);

let GRID = new Array(ROWS);
let NEXT_GRID = new Array(ROWS);


let is_running = false;
let mouse_down = false;

let game_interval;
let interval_time = 100;

function init() {
    drawGrid();
    initGrids();
    resetGrids();
    setupControls();
}


// GRID FUNCTIONS 

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

// DRAW CELLS FUNCTIONS (MOUSE EVENTS)

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

    // MOUSE DOWN/UP (DRAWING CELLS)
    document.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mouseup', mouseUpHandler);

    // OVERLAY HIDE
    const HIDE_BTN = document.getElementById('hide-btn');
    const OVERLAY = document.getElementById('overlay');

    HIDE_BTN.addEventListener('click', () => OVERLAY.classList.toggle('hide'));
    document.addEventListener('keypress', (e) => {
        if (e.key.toLowerCase() === "o") {
            OVERLAY.classList.toggle('hide');
        }
    });
}

init();