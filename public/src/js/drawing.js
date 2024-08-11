const drawCanvas = document.getElementById("draw-canvas")
const ctx = drawCanvas.getContext("2d")
const ERASER_CURSOR = "url(\"../../Assets/Misc/square.png\")"

// This is necessary for when cursor leaves the canvas while drawing.
// Only used within event handlers (current client actions).
let mouse_drawing = false 
let lines = [, ]

function initCanvas() {
    drawCanvas.height = window.innerHeight
    drawCanvas.width = window.innerWidth
    ctx.lineWidth = 5
    clearStrokeColor()

    // Init touch drawing
    drawCanvas.addEventListener("touchstart", function(event) {
        Array.from(event.touches).forEach(e => drawLineStartEventHandler(e))
    }, false)
    drawCanvas.addEventListener("touchmove", function(event) {
        event.preventDefault()
        Array.from(event.touches).forEach(e => drawLineMoveEventHandler(e))
    }, false)
    drawCanvas.addEventListener("touchend", function(event) {
        Array.from(event.changedTouches).forEach(e => drawLineEndEventHandler(e))
    }, false)

    // Init mouse drawing
    drawCanvas.addEventListener("mousedown", drawLineStartEventHandler)
    drawCanvas.addEventListener("mousemove", drawLineMoveEventHandler)
    drawCanvas.addEventListener("mouseup", drawLineEndEventHandler)
    drawCanvas.addEventListener("mouseout", drawLineEndEventHandler)

    drawCanvas.addEventListener("mousedown", eraseStartEventHandler)
    drawCanvas.addEventListener("mousemove", eraseMoveEventHandler)
    drawCanvas.addEventListener("mouseup", eraseEndEventHandler)
    drawCanvas.addEventListener("mouseout", eraseEndEventHandler)
}

function drawLineStartEventHandler(event) {
    if (!event.target.classList.contains("draw-canvas")) return
    if (currentMode != modes.draw) return
    mouse_drawing = true
    let x_pos = event.pageX - drawCanvas.offsetLeft
    let y_pos = event.pageY - drawCanvas.offsetTop
    drawLineStart(x_pos, y_pos, event.identifier)
    sendDrawLineStart(x_pos, y_pos, event.identifier)
}

function drawLineMoveEventHandler(event) {
    if (!event.target.classList.contains("draw-canvas")) return
    if (!mouse_drawing) return
    if (currentMode != modes.draw) return

    let x_pos = event.pageX - drawCanvas.offsetLeft
    let y_pos = event.pageY - drawCanvas.offsetTop

    drawLineMove(x_pos, y_pos, event.identifier)
    sendDrawLineMove(x_pos, y_pos, event.identifier)
}

function drawLineEndEventHandler(event) {
    mouse_drawing = false
    drawLineEnd()
    sendDrawLineEnd()
}

function eraseStartEventHandler(event) {
    if (!event.target.classList.contains("draw-canvas")) return
    if (currentMode != modes.erase) return
    mouse_drawing = true
    let x_pos = event.pageX - drawCanvas.offsetLeft
    let y_pos = event.pageY - drawCanvas.offsetTop
    eraseStart(x_pos, y_pos, event.identifier)
    sendEraseStart(x_pos, y_pos, event.identifier)
}

function eraseMoveEventHandler(event) {
    if (mouse_drawing == false) return
    if (currentMode != modes.erase) return
    eraseMove(event.pageX - 35, event.pageY - 35)
    sendEraseMove(event.pageX - 35, event.pageY - 35)
}

function eraseEndEventHandler(event) {
    if (currentMode != modes.erase) return
    mouse_drawing = false
    eraseEnd()
    sendEraseEnd()
}

function drawLineStart(x_pos, y_pos, line_id) {
    ctx.beginPath()

    // This allows a single touch to draw a small dot
    ctx.moveTo(x_pos, y_pos)
    ctx.lineTo(x_pos - 5, y_pos + 5)
    ctx.stroke()

    lines[line_id] = {
        x: x_pos,
        y: y_pos
    }

}

function drawLineMove(x_pos, y_pos, line_id) {
    ctx.moveTo(lines[line_id].x, lines[line_id].y)
    ctx.lineTo(x_pos, y_pos)
    ctx.stroke()

    lines[line_id] = {
        x: x_pos,
        y: y_pos
    }
}

function drawLineEnd() {
    drawCanvas.style.zIndex = -5
}

function eraseStart(x_pos, y_pos) {
    ctx.clearRect(x_pos, y_pos, 70, 70)
}

function eraseMove(x_pos, y_pos) {
    ctx.clearRect(x_pos, y_pos, 70, 70)
}

function eraseEnd() {
    drawCanvas.style.zIndex = -5
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