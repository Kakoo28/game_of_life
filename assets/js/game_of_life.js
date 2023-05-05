let cells;

while (!cells) {
    cells = document.querySelectorAll('.cell');
}

let mouse_down = false;

cells.forEach(cell => cell.addEventListener('mouseover', () => {
    if (mouse_down) {
        if (cell.dataset.isalive === "true") {
            cell.dataset.isalive = "false";
        } else {
            cell.dataset.isalive = "true";
        }
    }
}));

document.addEventListener('mousedown', () => mouse_down = true);
document.addEventListener('mouseup', () => mouse_down = false);