const mapCanvas = document.getElementById("map")
const DEFAULT_BACKGROUND_IMAGE = "url(\"../../Assets/Misc/blank.png\")"
const START_BACKGROUND_IMAGE = "url(\"../../Assets/Misc/bg_start.jpg\")"
const CANVAS_SCALAR = 3

let map_token = null

function initMap() {
    mapCanvas.style.backgroundImage = START_BACKGROUND_IMAGE
    mapCanvas.height = window.innerHeight
    mapCanvas.width = window.innerWidth
}

// If the active map is selected, reset background to default.
function setMap(event) {
    if (currentMode === modes.tmap) return

    let map = event.target
    if (mapCanvas.style.backgroundImage == window.getComputedStyle(map).backgroundImage)
        mapCanvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE
    else
        mapCanvas.style.backgroundImage = window.getComputedStyle(map).backgroundImage
}

function resetMap() {
    resetCanvas(mapCanvas)
    mapCanvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE
    map_token.remove()
    map_token = null
}

function startTmap() {
    if (mapCanvas.style.backgroundImage == DEFAULT_BACKGROUND_IMAGE) {
        changeMode(modes.none)
        return
    }
    map_token = startTCanvas(mapCanvas, CANVAS_SCALAR)
    mapCanvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE
}

function endTmap() {
    if (!map_token) return
    endTCanvas(mapCanvas, map_token, CANVAS_SCALAR)
}

function resizeMap(slider) {
    resizeCanvasBg(mapCanvas, map_token, slider, CANVAS_SCALAR)
}


// ------- Common Background Manipulation ------- //
function resizeCanvasBg(canvas, token, slider, scalar) {
    let size = slider.value * scalar
    canvas.style.backgroundSize = size + "%"
    token.height = canvas.height * size * 0.01
    token.width = canvas.width * size * 0.01
}

function startTCanvas(canvas, scalar) {
    token = createBackgroundToken(canvas)
    token.src = canvas.style.backgroundImage.slice(5, -2)

    showSizeSlider()
    if (canvas.style.backgroundSize)
        document.getElementById("sizeSlider").value = canvas.style.backgroundSize.split("%")[0] / scalar
    else
        document.getElementById("sizeSlider").value = 100

    return token
}

function endTCanvas(canvas, token, scalar) {
    canvas.style.backgroundImage = "url(" + token.src + ")"
    canvas.style.backgroundPosition = token.style.left + " " + token.style.top
    canvas.style.backgroundSize = (document.getElementById("sizeSlider").value * scalar) + "% " +
        (document.getElementById("sizeSlider").value * scalar) + "%"
    token.remove()
    token = null
}

function resetCanvas(canvas) {
    canvas.style.backgroundSize = "100% 100%"
    canvas.style.backgroundPosition = "0px 0px"
}

function createBackgroundToken(canvas) {
    bg_token = createToken(null)

    if (!canvas.style.backgroundSize)
        canvas.style.backgroundSize = "100% 100%"
    bg_token.width = canvas.width * canvas.style.backgroundSize.split("%")[0] * 0.01
    bg_token.height = canvas.height * canvas.style.backgroundSize.split("%")[1].slice(1) * 0.01
    bg_token.style.opacity = 0.4
    bg_token.style.zIndex = 940
    bg_token.classList.add("bg_token")

    if (canvas.style.backgroundPosition) {
        bg_token.style.left = canvas.style.backgroundPosition.split(" ")[0]
        bg_token.style.top = canvas.style.backgroundPosition.split(" ")[1]
    } else {
        bg_token.style.left = "0px"
        bg_token.style.top = "0px"
    }

    return bg_token
}