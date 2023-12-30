// --------- Canvas -------- //
const ERASER_CURSOR = "url(\"../../Assets/Misc/square.png\")"

let mouse_drawing = false // This is necessary for when cursor leaves the canvas while drawing
let lines = [, ]

function initCanvas() {
    canvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE
    clearStrokeColor()

    // Init touch drawing
    canvas.addEventListener("touchstart", function(event) {
        Array.from(event.touches).forEach(e => lineStart(e))
    }, false)
    canvas.addEventListener("touchmove", function(event) {
        event.preventDefault()
        Array.from(event.touches).forEach(e => lineMove(e))
    }, false)
    canvas.addEventListener("touchend", function(event) {
        Array.from(event.changedTouches).forEach(e => lineEnd(e))
    }, false)

    // Init mouse drawing
    canvas.addEventListener("mousedown", lineStart)
    canvas.addEventListener("mousemove", lineMove)
    canvas.addEventListener("mouseup", lineEnd)
}

function lineStart(event) {
    if (event.type == "mousedown")
        mouse_drawing = true

    let x_pos = event.pageX - canvas.offsetLeft
    let y_pos = event.pageY - canvas.offsetTop

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

    let x_pos = event.pageX - canvas.offsetLeft
    let y_pos = event.pageY - canvas.offsetTop

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
    canvas.style.cursor = `${ERASER_CURSOR} 40 40, auto`
}

function endErase() {
    canvas.style.cursor = "auto"
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}
// --------- Canvas -------- //