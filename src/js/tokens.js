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

    if (event.type == "mousedown")
        mouse_dragging = true

    addTokenToSelected(token)

    // Place token above everything else.
    // If Z level maximum is reached, reset z order of all tokens.
    if (z_layer == 900) {
        z_layer = 0
        Array.from(document.getElementsByClassName("token")).sort((a, b) => { return a.style.zIndex - b.style.zIndex }).forEach((x) => x.style.zIndex = z_layer++)
    }
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

function startSelect() {
    selected = []
    showSizeSlider()
    showRotateSlider()
}

function endSelect() {
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
    changeMode(modes.none)
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

// Moves sliders to match current token size
function updateSliders(token) {
    let size = token.style.transform.split(" ")[0].slice(6, -1)
    console.log(size)
    document.getElementById("sizeSlider").value = 130 * Math.pow(Math.E, (-(6 / 10) / size))

    if (token.style.transform)
        document.getElementById("rotateSlider").value = token.style.transform.split(" ")[1].slice(7, -4)
    else
        document.getElementById("rotateSlider").value = 0
}