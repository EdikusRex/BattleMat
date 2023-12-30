const drawCanvas = document.getElementById("draw-canvas")
const ctx = drawCanvas.getContext("2d")
const ERASER_CURSOR = "url(\"../../Assets/Misc/square.png\")"

let mouse_drawing = false // This is necessary for when cursor leaves the canvas while drawing
let lines = [, ]

function initCanvas() {
    drawCanvas.height = window.innerHeight
    drawCanvas.width = window.innerWidth
    ctx.lineWidth = 5
    clearStrokeColor()

    // Init touch drawing
    drawCanvas.addEventListener("touchstart", function(event) {
        Array.from(event.touches).forEach(e => lineStart(e))
    }, false)
    drawCanvas.addEventListener("touchmove", function(event) {
        event.preventDefault()
        Array.from(event.touches).forEach(e => lineMove(e))
    }, false)
    drawCanvas.addEventListener("touchend", function(event) {
        Array.from(event.changedTouches).forEach(e => lineEnd(e))
    }, false)

    // Init mouse drawing
    drawCanvas.addEventListener("mousedown", lineStart)
    drawCanvas.addEventListener("mousemove", lineMove)
    drawCanvas.addEventListener("mouseup", lineEnd)
}

function lineStart(event) {
    if (event.type == "mousedown")
        mouse_drawing = true

    let x_pos = event.pageX - drawCanvas.offsetLeft
    let y_pos = event.pageY - drawCanvas.offsetTop

    ctx.beginPath()

    // This allows a single touch to draw a small dot
    ctx.moveTo(x_pos, y_pos)
    ctx.lineTo(x_pos - 5, y_pos + 5)
    ctx.stroke()

    lines[event.identifier] = {
        x: x_pos,
        y: y_pos
    }
}

function lineMove(event) {
    if (event.type == "mousemove" && !mouse_drawing) return

    if (currentMode === modes.erase) {
        ctx.clearRect(event.pageX - 35, event.pageY - 35, 70, 70)
        return
    }

    let x_pos = event.pageX - drawCanvas.offsetLeft
    let y_pos = event.pageY - drawCanvas.offsetTop

    ctx.moveTo(lines[event.identifier].x, lines[event.identifier].y)
    ctx.lineTo(x_pos, y_pos)
    ctx.stroke()

    lines[event.identifier] = {
        x: x_pos,
        y: y_pos
    }
}

function lineEnd(event) {
    if (event.type == "mouseup")
        mouse_drawing = false
}

function changeStrokeColor(clr) {
    ctx.strokeStyle = clr.style.backgroundColor
}

function clearStrokeColor() {
    ctx.strokeStyle = "rgba(0,0,0,0)"
}

function startErase() {
    clearStrokeColor()
    drawCanvas.style.cursor = `${ERASER_CURSOR} 40 40, auto`
}

function endErase() {
    drawCanvas.style.cursor = "auto"
}

function clearCanvas() {
    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height)
}