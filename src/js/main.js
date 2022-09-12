const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Each mode should have associated startMode and endMode functions.
const modes = {
    none: Symbol("none"),
    erase: Symbol("erase"),
    select: Symbol("select"),
    tmap: Symbol("transform_map")
};
let currentMode = modes.none;


// Init all js objects. The app runs purely off event listeners after that.
function main() {
    initWindow();
    initCanvas();
    initButtons();
    initDropdowns();
}

// End current mode, then start new mode.
// Passing currentMode is the same as passing modes.none
function changeMode(newMode) {
    switch (currentMode) {
        case modes.erase:
            endErase();
            break;
        case modes.select:
            endSelect();
            break;
        case modes.tmap:
            endTmap();
            break;
    }

    if (newMode === currentMode) {
        currentMode = modes.none;
        return;
    }
    currentMode = newMode;

    switch (newMode) {
        case modes.erase:
            startErase();
            break;
        case modes.select:
            startSelect();
            break;
        case modes.tmap:
            startTmap();
            break;
    }
}


// ---------- Window Init ---------- //
function initWindow() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    ctx.lineWidth = 5;
}
// ---------- Window Init ---------- //


// ---------- Canvas ---------- //
const ERASER_CURSOR = "url(\"../../Assets/Misc/square.png\")";

let mouse_drawing = false; // This is necessary for when cursor leaves the canvas while drawing
let lines = [, ];

function initCanvas() {
    canvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE;

    // Init touch drawing
    canvas.addEventListener("touchstart", function(event) {
        Array.from(event.touches).forEach(e => drawStart(e));
    }, false);
    canvas.addEventListener("touchmove", function(event) {
        event.preventDefault();
        Array.from(event.touches).forEach(e => drawMove(e));
    }, false);
    canvas.addEventListener("touchend", function(event) {
        Array.from(event.changedTouches).forEach(e => drawEnd(e));
    }, false);

    // Init mouse drawing
    canvas.addEventListener("mousedown", drawStart);
    canvas.addEventListener("mousemove", drawMove);
    canvas.addEventListener("mouseup", drawEnd);
}

function drawStart(event) {
    if (event.type == "mousedown")
        mouse_drawing = true;

    let x_pos = event.pageX - canvas.offsetLeft;
    let y_pos = event.pageY - canvas.offsetTop;

    ctx.beginPath();

    // This allows a single touch to draw a small dot
    ctx.moveTo(x_pos, y_pos);
    ctx.lineTo(x_pos - 5, y_pos + 5);
    ctx.stroke();

    lines[event.identifier] = {
        x: x_pos,
        y: y_pos
    };
}

function drawMove(event) {
    if (event.type == "mousemove" && !mouse_drawing) return;

    if (currentMode === modes.erase)
        ctx.clearRect(event.pageX - 35, event.pageY - 35, 70, 70);
    else {
        let x_pos = event.pageX - canvas.offsetLeft;
        let y_pos = event.pageY - canvas.offsetTop;

        ctx.moveTo(lines[event.identifier].x, lines[event.identifier].y);
        ctx.lineTo(x_pos, y_pos);
        ctx.stroke();

        lines[event.identifier] = {
            x: x_pos,
            y: y_pos
        };
    }
}

function drawEnd(event) {
    if (event.type == "mouseup")
        mouse_drawing = false;
}

function changeStrokeColor(clr) {
    ctx.strokeStyle = clr.style.backgroundColor;
}

function startErase() {
    ctx.strokeStyle = "rgba(0,0,0,0)";
    canvas.style.cursor = `${ERASER_CURSOR} 40 40, auto`;

    if (!document.querySelector(".erase").classList.contains("active"))
        document.querySelector(".erase").classList.add("active");
}

function endErase() {
    canvas.style.cursor = "auto";

    if (document.querySelector(".erase").classList.contains("active"))
        document.querySelector(".erase").classList.remove("active");
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
// ---------- Canvas ---------- //


// ---------- Buttons ---------- //
function initButtons() {
    // Init color selection buttons
    Array.from(document.querySelectorAll(".clr")).forEach(clr => {
        clr.addEventListener("click", () => {
            changeStrokeColor(clr);
            if (currentMode === modes.erase) // Changing color should only end erase mode
                changeMode(modes.none);
        })
    });

    document.querySelector(".erase").addEventListener("click", () => {
        changeMode(modes.erase);
    });

    document.querySelector(".clear").addEventListener("click", () => {
        if (currentMode === modes.select)
            clearLastSelection();
        else
            clearCanvas();
    });

    document.querySelector(".del").addEventListener("click", () => {
        if (currentMode === modes.select)
            deleteSelected();
        else if (currentMode === modes.tmap)
            resetMap();
    })

    document.querySelector(".tmap").addEventListener("click", () => {
        changeMode(modes.tmap);
    });

    document.querySelector(".sel").addEventListener("click", () => {
        changeMode(modes.select);
    });

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
// ---------- Buttons ---------- //


// ---------- Dropdowns ---------- //
function initDropdowns() {
    Array.from(document.getElementsByClassName("accordion")).forEach((acc) => {
        acc.addEventListener("click", toggleAccordion);
        assignAccordionBehavior(acc);
    });
}

// Toggle panels open or closed
function toggleAccordion() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;

    while (panel != null && panel.classList.contains("panel")) {
        if (panel.style.maxHeight)
            panel.style.maxHeight = null;
        else
            panel.style.maxHeight = panel.scrollHeight + "px";

        panel = panel.nextElementSibling;
    }
}

function assignAccordionBehavior(acc) {
    let panelBehavior = null;

    if (acc.id == "creatures" || acc.id == "aoe")
        panelBehavior = createToken;
    else if (acc.id == "maps")
        panelBehavior = openMap;

    var panel = acc.nextElementSibling;
    while (panel != null && panel.classList.contains("panel")) {
        panel.children[0].addEventListener("click", panelBehavior);
        panel = panel.nextElementSibling;
    }
}
// ---------- Dropdowns ---------- //


// ---------- Map ---------- //
const DEFAULT_BACKGROUND_IMAGE = "url(\"../../Assets/Misc/blank.png\")";

let map_token = null;

function openMap(event) {
    let map = event.target;

    if (currentMode === modes.tmap) return;

    if (canvas.style.backgroundImage == window.getComputedStyle(map).backgroundImage)
        canvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE;
    else
        canvas.style.backgroundImage = window.getComputedStyle(map).backgroundImage;
}

function resetMap() {
    if (currentMode === modes.tmap)
        changeMode(modes.none);

    canvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE;
    canvas.style.backgroundSize = "100% 100%";
    canvas.style.backgroundPosition = "0px 0px";
}

function startTmap() {
    if (canvas.style.backgroundImage == DEFAULT_BACKGROUND_IMAGE) {
        changeMode(modes.none);
        return;
    }

    createMapToken(); // Must run before setting background image to default
    showSizeSlider();
    canvas.style.backgroundImage = DEFAULT_BACKGROUND_IMAGE;

    if (canvas.style.backgroundSize)
        document.getElementById("sizeSlider").value = canvas.style.backgroundSize.split("%")[0];
    else
        document.getElementById("sizeSlider").value = 100;

    if (!document.querySelector(".tmap").classList.contains("active"))
        document.querySelector(".tmap").classList.add("active");
}

function endTmap() {
    if (map_token) {
        canvas.style.backgroundImage = "url(" + map_token.src + ")";
        canvas.style.backgroundPosition = map_token.style.left + " " + map_token.style.top;
        canvas.style.backgroundSize = document.getElementById("sizeSlider").value + "% " +
            document.getElementById("sizeSlider").value + "%";
        map_token.remove();
        map_token = null;
    }

    hideSizeSlider();

    if (document.querySelector(".tmap").classList.contains("active"))
        document.querySelector(".tmap").classList.remove("active");
}

function resizeMap(slider) {
    canvas.style.backgroundSize = slider.value + "%";
    map_token.height = canvas.height * slider.value * 0.01;
    map_token.width = canvas.width * slider.value * 0.01;
}

function createMapToken() {
    map_token = createToken(null);

    if (!canvas.style.backgroundSize)
        canvas.style.backgroundSize = "100% 100%";
    map_token.src = canvas.style.backgroundImage.slice(5, -2);
    map_token.width = canvas.width * canvas.style.backgroundSize.split("%")[0] * 0.01;
    map_token.height = canvas.height * canvas.style.backgroundSize.split("%")[1].slice(1) * 0.01;
    map_token.style.opacity = 0.4;
    map_token.style.zIndex = 998;
    map_token.classList.add("map_token");

    if (canvas.style.backgroundPosition) {
        map_token.style.left = canvas.style.backgroundPosition.split(" ")[0];
        map_token.style.top = canvas.style.backgroundPosition.split(" ")[1];
    } else {
        map_token.style.left = "0px";
        map_token.style.top = "0px";
    }
}
// ---------- Map ---------- //


// ---------- Tokens ---------- //
const SCALE_START = 80;

let selected = [];
let drags = [, ];
let uid_counter = 0;
let z_layer = 0;
let mouse_dragging = false; // Prevents token drag when mouse isn't clicked

// Pass null to allow caller to handle style.src
function createToken(event) {
    var token = new Image(SCALE_START, SCALE_START);

    token.id = uid_counter++;
    token.style.left = 300 + 'px';
    token.style.top = 200 + 'px';
    token.style.transform = "scale(1) rotate(0)";
    token.classList.add("token");
    if (event) // event is null when invoked by createMapToken. src will be set by createMapToken
        token.src = window.getComputedStyle(event.target).backgroundImage.slice(5, -2);

    if (currentMode === modes.select) {
        token.classList.add("selected");
        selected.splice(0, 0, token);
    }

    // Add touch event listeners
    token.addEventListener("touchstart", function(event) {
        Array.from(event.touches).forEach(e => dragStart(e));
    }, false);
    token.addEventListener("touchmove", function(event) {
        event.preventDefault();
        Array.from(event.touches).forEach(e => drag(e));
    }, false);
    token.addEventListener("touchend", function(event) {
        Array.from(event.touches).forEach(e => dragEnd(e));
    }, false);

    // Add mouse event listeners
    token.addEventListener("mousedown", function(event) {
        dragStart(event);
    });
    token.addEventListener("mousemove", drag);
    token.addEventListener("mouseup", dragEnd);

    document.body.appendChild(token);

    return token;
}

function dragStart(event) {
    let token = event.target;

    if (event.type == "mousedown")
        mouse_dragging = true;

    if (currentMode === modes.select) {
        selected = selected.filter((x) => x != token);
        selected.splice(0, 0, token);
        if (!token.classList.contains("selected"))
            token.classList.add("selected");
        updateSliders(token);
    }

    // Place token above everything else.
    // If Z level maximum is reached, reset z order of all tokens.
    if (z_layer == 900) {
        z_layer = 0;
        Array.from(document.getElementsByClassName("token")).sort((a, b) => { return a - b }).forEach((x) => x.style.zIndex = z_layer++);
    }
    token.style.zIndex = z_layer++;

    // This accounts for the offset between where user clicks and top left corner of the token.
    drags[token.id] = {
        dx: event.clientX - token.style.left.slice(0, -2),
        dy: event.clientY - token.style.top.slice(0, -2)
    };
}

function drag(event) {
    let token = event.target;

    if (!(token.id in drags)) return;
    if (event.type == "mousemove") {
        if (!mouse_dragging) return;
        event.preventDefault();
    }

    token.style.left = event.clientX - drags[token.id].dx + 'px';
    token.style.top = event.clientY - drags[token.id].dy + 'px';
}

function dragEnd(event) {
    if (event.type == "mouseup")
        mouse_dragging = false;
}

function startSelect() {
    showSizeSlider();
    showRotateSlider();

    if (selected.length > 0)
        document.getElementById("sizeSlider").value = token.height;

    if (!document.querySelector(".sel").classList.contains("active"))
        document.querySelector(".sel").classList.add("active");
}

function endSelect() {
    selected.forEach((x) => { x.classList.remove("selected") });
    selected = [];

    hideSizeSlider();
    hideRotateSlider();

    if (document.querySelector(".sel").classList.contains("active"))
        document.querySelector(".sel").classList.remove("active");
}

function clearLastSelection() {
    selected[0].classList.remove("selected");
    selected.splice(0, 1);
}

function deleteSelected() {
    selected.filter((x) => { return x != null }).forEach((x) => { x.remove() });
    selected = [];
}

function resizeSelected(slider) {
    selected.forEach((x) => {
        var scale = slider.value / SCALE_START;
        var maintain_rotation = x.style.transform.split(" ")[1];

        x.style.transform = "scale(" + scale + ")" + maintain_rotation;
    });
}

function rotateSelected(slider) {
    selected.forEach((x) => {
        var maintain_size = x.style.transform.split(" ")[0];
        x.style.transform = maintain_size + "rotate(" + slider.value + "deg)";
    });
}
// ---------- Tokens ---------- //


// Start the program
main();