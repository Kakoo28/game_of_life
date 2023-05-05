const GRID = document.getElementById('game-of-life');

for (let y = 1; y <= 50; y++) {
    for (let x = 1; x <= 95; x++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.x = x;
        cell.dataset.y = y;
        GRID.append(cell);
    }
}