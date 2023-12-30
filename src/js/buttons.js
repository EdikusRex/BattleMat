// ------------- Buttons ------------- //
// Each mode should have associated startMode and endMode functions.
const modes = {
    none: Symbol("none"),
    draw: Symbol("draw"),
    erase: Symbol("erase"),
    select: Symbol("select"),
    tmap: Symbol("tmap")
};
let currentMode = modes.none;

function initButtons() {
    initNav();
    initSliders();
}

// End current mode, then start new mode.
// Passing currentMode is the same as passing modes.none
function changeMode(newMode) {
    clearNavSecondary();
    switch (currentMode) {
        case modes.draw:
            document.querySelector(".draw").classList.remove("active");
            clearStrokeColor();
            break;
        case modes.erase:
            document.querySelector(".erase").classList.remove("active");
            endErase();
            break;
        case modes.select:
            document.querySelector(".sel").classList.remove("active");
            endSelect();
            break;
        case modes.tmap:
            document.querySelector(".tmap").classList.remove("active");
            endTmap();
            break;
    }

    if (newMode === currentMode) {
        currentMode = modes.none;
        return;
    }
    currentMode = newMode;

    populateNavSecondary(newMode);
    switch (newMode) {
        case modes.draw:
            document.querySelector(".draw").classList.add("active");
            changeStrokeColor(document.querySelector(".clr"));
            break;
        case modes.erase:
            document.querySelector(".erase").classList.add("active");
            startErase();
            break;
        case modes.select:
            document.querySelector(".sel").classList.add("active");
            startSelect();
            break;
        case modes.tmap:
            document.querySelector(".tmap").classList.add("active");
            startTmap();
            break;
    }
}

function initNav() {
    document.querySelector(".draw").addEventListener("click", () => {
        changeMode(modes.draw);
    })

    document.querySelector(".erase").addEventListener("click", () => {
        changeMode(modes.erase);
    });

    document.querySelector(".clear").addEventListener("click", () => {
        if (currentMode === modes.select)
            deleteSelected();
        else if (currentMode === modes.tmap)
            resetMap();
        else if (currentMode === modes.draw)
            clearCanvas();
    });

    document.querySelector(".tmap").addEventListener("click", () => {
        changeMode(modes.tmap);
    });

    document.querySelector(".sel").addEventListener("click", () => {
        changeMode(modes.select);
    });
}

function initSliders() {
    document.getElementById("sizeSlider").oninput = function() {
        if (currentMode === modes.tmap)
            resizeMap(this);
        else
            resizeSelected(this);
    };
    document.getElementById("rotateSlider").oninput = function() {
        rotateSelected(this);
    }

    hideSizeSlider();
    hideRotateSlider();
}

// Moves sliders to match current token size
function updateSliders(token) {
    document.getElementById("sizeSlider").value = token.style.transform.split(" ")[0].slice(6, -1) * SCALE_START;

    if (token.style.transform)
        document.getElementById("rotateSlider").value = token.style.transform.split(" ")[1].slice(7, -4);
    else
        document.getElementById("rotateSlider").value = 0;
}

function showSizeSlider() {
    if (document.querySelector(".slidecontainer").classList.contains("hidden"))
        document.querySelector(".slidecontainer").classList.remove("hidden");
}

function showRotateSlider() {
    if (document.querySelector(".rotateslider").classList.contains("hidden"))
        document.querySelector(".rotateslider").classList.remove("hidden");
}

function hideSizeSlider() {
    if (!document.querySelector(".slidecontainer").classList.contains("hidden"))
        document.querySelector(".slidecontainer").classList.add("hidden");
}

function hideRotateSlider() {
    if (!document.querySelector(".rotateslider").classList.contains("hidden"))
        document.querySelector(".rotateslider").classList.add("hidden");
}
// ------------- Buttons ------------- //


// ---------- Secondary Nav ---------- //
// nav-secondary children should be tag=button and have class=opt
function populateNavSecondary(mode) {
    switch (mode) {
        case modes.draw:
            addClrButtons();
            break;
        case modes.select:
        case modes.tmap:
            addResizeButtons();
            break;
    }
}

// Empties nav-secondary, allowing it to be filled with new buttons
function clearNavSecondary() {
    let nav = document.querySelector(".nav-secondary");
    while (nav.firstElementChild) {
        nav.firstElementChild.remove();
    }
}

function addClrButtons() {
    let colors = ["#000", "#d60b0b", "#2a11cf", "#24d102", "#fff"];
    let nav = document.querySelector(".nav-secondary");

    colors.forEach((color) => {
        let clr = document.createElement("div");
        clr.classList.add("clr")
        clr.style = `background-color: ${color}`
        clr.addEventListener("click", () => { changeStrokeColor(clr) })
        nav.appendChild(clr);
    });
}

function addResizeButtons() {
    let nav = document.querySelector(".nav-secondary");
    let slider = document.querySelector(".slider");

    let updateSize = (delta) => {
        slider.value = parseInt(slider.value) + delta;
        if (currentMode === modes.select)
            resizeSelected(slider);
        else if (currentMode === modes.tmap)
            resizeMap(slider);
    };

    let plus = document.createElement("button");
    plus.classList.add("opt", "plus");
    plus.textContent = "+";
    plus.addEventListener("click", () => { updateSize(10) });
    nav.appendChild(plus);

    let minus = document.createElement("button");
    minus.classList.add("opt", "minus");
    minus.textContent = "-";
    minus.addEventListener("click", () => { updateSize(-10) });
    nav.appendChild(minus);
}
// ---------- Secondary Nav ---------- //