// ---------- Map ---------- //
const DEFAULT_BACKGROUND_IMAGE = "url(\"../../Assets/Misc/blank.png\")"

let map_token = null

// If the active map is selected, reset background to default.
function setMap(event) {
    if (currentMode === modes.tmap) return

    let map = event.target
    if (canvas.style.backgroundImage == window.getComputedStyle(map).backgroundImage)
        canvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE
    else
        canvas.style.backgroundImage = window.getComputedStyle(map).backgroundImage
}

function resetMap() {
    if (currentMode === modes.tmap)
        changeMode(modes.none)

    canvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE
    canvas.style.backgroundSize = "100% 100%"
    canvas.style.backgroundPosition = "0px 0px"
}

function startTmap() {
    if (canvas.style.backgroundImage == DEFAULT_BACKGROUND_IMAGE) {
        changeMode(modes.none)
        return
    }

    createMapToken()

    showSizeSlider()
    if (canvas.style.backgroundSize)
        document.getElementById("sizeSlider").value = canvas.style.backgroundSize.split("%")[0]
    else
        document.getElementById("sizeSlider").value = 100
}

function endTmap() {
    if (!map_token) return

    canvas.style.backgroundImage = "url(" + map_token.src + ")"
    canvas.style.backgroundPosition = map_token.style.left + " " + map_token.style.top
    canvas.style.backgroundSize = document.getElementById("sizeSlider").value + "% " +
        document.getElementById("sizeSlider").value + "%"
    map_token.remove()
    map_token = null
}

function resizeMap(slider) {
    canvas.style.backgroundSize = slider.value + "%"
    map_token.height = canvas.height * slider.value * 0.01
    map_token.width = canvas.width * slider.value * 0.01
}

function createMapToken() {
    map_token = createToken(null)

    if (!canvas.style.backgroundSize)
        canvas.style.backgroundSize = "100% 100%"
    map_token.src = canvas.style.backgroundImage.slice(5, -2)
    map_token.width = canvas.width * canvas.style.backgroundSize.split("%")[0] * 0.01
    map_token.height = canvas.height * canvas.style.backgroundSize.split("%")[1].slice(1) * 0.01
    map_token.style.opacity = 0.4
    map_token.style.zIndex = 998
    map_token.classList.add("map_token")

    if (canvas.style.backgroundPosition) {
        map_token.style.left = canvas.style.backgroundPosition.split(" ")[0]
        map_token.style.top = canvas.style.backgroundPosition.split(" ")[1]
    } else {
        map_token.style.left = "0px"
        map_token.style.top = "0px"
    }
    canvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE
}
// ---------- Map ---------- //