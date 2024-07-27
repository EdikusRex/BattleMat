const DEFAULT_SIZE = 80

let selected = []
let drags = [, ]
let uid_counter = 0
let z_layer = 0
let mouse_dragging = false // Prevents token drag when mouse isn't clicked

// Pass null to allow caller to handle style.src
function createToken(event) {
    var token = new Image(DEFAULT_SIZE, DEFAULT_SIZE)

    token.id = uid_counter++
        token.style.left = 300 + 'px'
    token.style.top = 200 + 'px'
    token.style.transform = "scale(1) rotate(0)"
    if (z_layer == 900) resetZLayer()
    token.style.zIndex = z_layer++
        token.classList.add("token")

    // event is null when invoked by createMapToken. src will be set by createMapToken
    if (event)
        token.src = window.getComputedStyle(event.target).backgroundImage.slice(5, -2)

    addTokenToSelected(token)

    // Add touch event listeners
    token.addEventListener("touchstart", function(event) {
        Array.from(event.touches).forEach(e => dragStart(e))
    }, false)
    token.addEventListener("touchmove", function(event) {
        event.preventDefault()
        Array.from(event.touches).forEach(e => drag(e))
    }, false)
    token.addEventListener("touchend", function(event) {
        Array.from(event.touches).forEach(e => dragEnd(e))
    }, false)

    // Add mouse event listeners
    token.addEventListener("mousedown", dragStart)
    token.addEventListener("mousemove", drag)
    token.addEventListener("mouseup", dragEnd)

    document.body.appendChild(token)

    return token
}

function dragStart(event) {
    let token = event.target

    if (!token.classList.contains("token")) return

    if (event.type == "mousedown") {
        mouse_dragging = true
        event.preventDefault()
    }

    addTokenToSelected(token)

    // Place token above everything else.
    // If Z level maximum is reached, reset z order of all tokens.
    if (z_layer == 900) resetZLayer()
    token.style.zIndex = z_layer++
        // This accounts for the offset between where user clicks and top left corner of the token.
        drags[token.id] = {
            dx: event.clientX - token.style.left.slice(0, -2),
            dy: event.clientY - token.style.top.slice(0, -2)
        }
}

function drag(event) {
    let token = event.target

    if (!(token.id in drags)) return
    if (event.type == "mousemove") {
        if (!mouse_dragging) return
        event.preventDefault()
    }

    token.style.left = event.clientX - drags[token.id].dx + 'px'
    token.style.top = event.clientY - drags[token.id].dy + 'px'
}

function dragEnd(event) {
    if (event.type == "mouseup")
        mouse_dragging = false
}

function resetZLayer() {
    z_layer = 0
    Array.from(document.getElementsByClassName("token")).sort((a, b) => { return a.style.zIndex - b.style.zIndex }).forEach((x) => x.style.zIndex = z_layer++)
}

function startSelect() {
    selected = []
    enableDragSelect()
    showSizeSlider()
    showRotateSlider()
}

function endSelect() {
    clearSelected()
    disableDragSelect()
}

function clearSelected() {
    selected.forEach((x) => { x.classList.remove("selected") })
    selected = []
}

function addTokenToSelected(token) {
    if (currentMode !== modes.select) return

    selected = selected.filter((x) => x != token) // Clear out existing references to same token
    selected.splice(0, 0, token)

    if (!token.classList.contains("selected"))
        token.classList.add("selected")

    updateSliders(token)
}

function deleteSelected() {
    selected.filter((x) => { return x != null }).forEach((x) => { x.remove() })
    selected = []
}

function resizeSelected(slider) {
    selected.forEach((x) => {
        var scale = 6 / (10 * Math.log(130 / slider.value))
        var maintain_rotation = x.style.transform.split(" ")[1]
        x.style.transform = "scale(" + scale + ")" + maintain_rotation
    })
}

function rotateSelected(slider) {
    selected.forEach((x) => {
        var maintain_size = x.style.transform.split(" ")[0]
        x.style.transform = maintain_size + "rotate(" + slider.value + "deg)"
    })
}

function sendSelectedToBottom() {
    selected.forEach((x) => {
        x.style.zIndex = -1
    })
    resetZLayer()
}


// Moves sliders to match current token size
function updateSliders(token) {
    let size = token.style.transform.split(" ")[0].slice(6, -1)
    document.getElementById("sizeSlider").value = 130 * Math.pow(Math.E, (-(6 / 10) / size))

    if (token.style.transform)
        document.getElementById("rotateSlider").value = token.style.transform.split(" ")[1].slice(7, -4)
    else
        document.getElementById("rotateSlider").value = 0
}


// -------------- Drag Select -------------- //
const SELECT_SRC = "../../Assets/Misc/square.png"

var mouse_selecting = false
var selCanvas = null
var selCtx = null
var selStartX = 0
var selStartY = 0

function enableDragSelect() {
    // Init sel canvas
    selCanvas = document.createElement('canvas')
    selCtx = selCanvas.getContext("2d")
    selCanvas.classList.add("sel-canvas")
    selCanvas.height = window.innerHeight
    selCanvas.width = window.innerWidth
    document.body.appendChild(selCanvas)

    // Init touch selecting
    selCanvas.addEventListener("touchstart", function(event) {
        Array.from(event.touches).forEach(e => selStart(e))
    }, false)
    selCanvas.addEventListener("touchmove", function(event) {
        event.preventDefault()
        Array.from(event.touches).forEach(e => selMove(e))
    }, false)
    selCanvas.addEventListener("touchend", function(event) {
        Array.from(event.changedTouches).forEach(e => selEnd(e))
    }, false)

    // Init mouse selecting
    selCanvas.addEventListener("mousedown", selStart)
    selCanvas.addEventListener("mousemove", selMove)
    selCanvas.addEventListener("mouseup", selEnd)
}

function disableDragSelect() {
    selCanvas.remove()
}

function selStart(event) {
    if (event.type == "mousedown")
        mouse_selecting = true
    selStartX = event.pageX - selCanvas.offsetLeft
    selStartY = event.pageY - selCanvas.offsetTop
    selCanvas.style.zIndex = 999
    clearSelected()
}

function selMove(event) {
    if (event.type == "mousemove" && !mouse_selecting) return

    let event_x = event.pageX - selCanvas.offsetLeft
    let event_y = event.pageY - selCanvas.offsetTop
    let selX = [Math.min(selStartX, event_x), Math.max(selStartX, event_x)]
    let selY = [Math.min(selStartY, event_y), Math.max(selStartY, event_y)]

    clearSelCanvas()
    selCtx.beginPath();
    selCtx.rect(selX[0], selY[0], selX[1] - selX[0], selY[1] - selY[0]);
    selCtx.stroke();

    clearSelected()
    let tokens = document.querySelectorAll(".token")
    tokens.forEach((token) => {
        let tokenX = parseInt(token.style.left.slice(0, -2)) +
            parseInt((token.style.transform.split(" ")[0].slice(6, -1) * DEFAULT_SIZE / 2))
        let tokenY = parseInt(token.style.top.slice(0, -2)) +
            parseInt((token.style.transform.split(" ")[0].slice(6, -1) * DEFAULT_SIZE / 2))

        if (tokenX >= selX[0] && tokenX <= selX[1] &&
            tokenY >= selY[0] && tokenY <= selY[1])
            addTokenToSelected(token)
    })
}

function selEnd(event) {
    if (event.type == "mouseup")
        mouse_selecting = false
    clearSelCanvas()
    selCanvas.style.zIndex = -4
}

function clearSelCanvas() {
    selCtx.clearRect(0, 0, selCanvas.width, selCanvas.height)
}