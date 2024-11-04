// This file has a dependency on `map.js` which should be imported into html before this file.
// Grid generator: https://hamhambone.github.io/hexgrid/

const gridCanvas = document.getElementById("grid")
const GRID_BACKGROUND_IMAGE = "url(\"../../Assets/Misc/grid.png\")"
const GRID_SCALAR = 5

let grid_token = null

function initGrid() {
    gridCanvas.style.backgroundImage = ""
    gridCanvas.height = window.innerHeight
    gridCanvas.width = window.innerWidth
}

function resetGrid() {
    resetCanvas(gridCanvas)
    grid_token.remove()
    grid_token = null
}

function startTgrid() {
    if (gridCanvas.style.backgroundImage != GRID_BACKGROUND_IMAGE) {
        gridCanvas.style.backgroundImage = GRID_BACKGROUND_IMAGE
    }
    grid_token = startTCanvas(gridCanvas, GRID_SCALAR)
    grid_token.style.opacity = 1.0
    gridCanvas.style.backgroundImage = ""
}

function endTgrid() {
    if (!grid_token) return
    endTCanvas(gridCanvas, grid_token, GRID_SCALAR)
}

function resizeGrid(slider) {
    resizeCanvasBg(gridCanvas, grid_token, slider, GRID_SCALAR)
}