const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = 0;
let erasing = false;
let tmap = false;
let mouse_dragging = false;
let lines = [, ];
let drags = [, ];
let selected = [];
let uid_counter = 0;
let z_counter = 0;


// ---------- Window Init ---------- //
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
ctx.lineWidth = 5;
// ---------- Window Init ---------- //


// ---------- Button Init ---------- //
Array.from(document.querySelectorAll(".clr")).forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.style.backgroundColor;
        canvas.style.cursor = "auto";
        erasing = false;
        endTmap();

        if (document.querySelector(".erase").classList.contains("active"))
            document.querySelector(".erase").classList.remove("active");
    })
});

document.querySelector(".clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
});

document.querySelector(".erase").addEventListener("click", () => {
    ctx.strokeStyle = "rgba(0,0,0,0)";
    canvas.style.cursor = "url(\"Assets/Misc/square.png\") 40 40, auto";
    erasing = true;
    endTmap();

    if (!document.querySelector(".erase").classList.contains("active"))
        document.querySelector(".erase").classList.add("active");
});

document.querySelector(".del").addEventListener("click", () => {
    while (selected.length > 0) {
        if (!selected[0])
            selected.splice(0, 1);
        else {
            selected[0].remove();
            selected.splice(0, 1);
            if (selected[0])
                document.getElementById("sizeSlider").value = selected[0].height;
            break;
        }
    }
});

document.querySelector(".tmap").addEventListener("click", () => {
    erasing = false;
    canvas.style.cursor = "auto";
    startTmap();
    createToken(null, true);

    if (canvas.style.backgroundSize)
        document.getElementById("sizeSlider").value = canvas.style.backgroundSize.slice(0, -1);
    else
        document.getElementById("sizeSlider").value = 100;

    if (document.querySelector(".erase").classList.contains("active"))
        document.querySelector(".erase").classList.remove("active");
});

document.getElementById("sizeSlider").oninput = function() {
    if (tmap) {
        // canvas.style.backgroundSize = this.value + "%";
        selected[0].height = canvas.height * this.value * 0.01;
        selected[0].width = canvas.width * this.value * 0.01;

        // canvas.style.backgroundPosition = this.value + "px " + this.value + "px";
    } else if (selected.length > 0) {
        selected[0].height = this.value;
        selected[0].width = this.value;
    }
};

document.getElementById("aoe").onclick = function() {
    createToken(null);
};
// ---------- Button Init ---------- //


// ---------- Transform Map Init ---------- //
function startTmap() {
    tmap = true;

    if (!document.querySelector(".tmap").classList.contains("active"))
        document.querySelector(".tmap").classList.add("active");
}

function endTmap() {
    tmap = false;

    if (document.querySelector(".tmap").classList.contains("active"))
        document.querySelector(".tmap").classList.remove("active");
}
// ---------- Transform Map Init ---------- //


// ---------- Dropdown Init ---------- //
Array.from(document.getElementsByClassName("accordion")).forEach(acc => {
    acc.addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;

        while (panel != null && panel.classList.contains("panel")) {
            if (panel.style.maxHeight)
                panel.style.maxHeight = null;
            else
                panel.style.maxHeight = panel.scrollHeight + "px";

            panel = panel.nextElementSibling;
        }
    });

    if (acc.id == "creatures") {
        var panel = acc.nextElementSibling;
        while (panel != null && panel.classList.contains("panel")) {
            panel.children[0].addEventListener("click", createToken);
            panel = panel.nextElementSibling;
        }
    } else if (acc.id == "maps") {
        var panel = acc.nextElementSibling;
        while (panel != null && panel.classList.contains("panel")) {
            panel.children[0].addEventListener("click", function() {
                if (canvas.style.backgroundImage == window.getComputedStyle(this).backgroundImage)
                    canvas.style.backgroundImage = "url(Assets/Misc/blank.png)";
                else
                    canvas.style.backgroundImage = window.getComputedStyle(this).backgroundImage;
            });
            panel = panel.nextElementSibling;
        }
    }
});
// ---------- Dropdown Init ---------- //


// ---------- Token Init ---------- //
function createToken(event, map_create) {
    var token = new Image(200, 200);
    var uid = uid_counter++;

    if (!map_create)
        endTmap();

    if (tmap) {
        if (!canvas.style.backgroundSize)
            canvas.style.backgroundSize = "100%";
        token.width = canvas.width * canvas.style.backgroundSize.slice(0, -1) * 0.01;
        token.height = canvas.height * canvas.style.backgroundSize.slice(0, -1) * 0.01;
        token.src = canvas.style.backgroundImage.slice(5, -2);
        token.style.left = "0px";
        token.style.top = "0px";
        token.classList.add("map_token");
    } else if (event) {
        token.style.left = 300 + 'px';
        token.style.top = 200 + 'px';
        token.src = window.getComputedStyle(this).backgroundImage.slice(5, -2);
    } else {
        token.style.left = 400 + 'px';
        token.style.top = 300 + 'px';
        token.style.borderRadius = "50%";
        token.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
        token.src = "Assets/Misc/aoe.png";
    }

    token.classList.add("token");
    selected.splice(0, 0, token);
    document.getElementById("sizeSlider").value = token.height;
    document.body.appendChild(token);

    token.addEventListener("touchstart", tdragStart, false);
    token.addEventListener("touchmove", tdrag, false);

    token.addEventListener("mousedown", dragStart);
    token.addEventListener("mousemove", drag);
    token.addEventListener("mouseup", () => mouse_dragging = false);

    function tdragStart(event) { Array.from(event.touches).forEach(e => dragStart(e)) }

    function tdrag(event) {
        event.preventDefault();
        Array.from(event.touches).forEach(e => drag(e));
    }

    function dragStart(event) {
        if (!(event.target === token)) return;
        if (event.type == "mousedown")
            mouse_dragging = true;

        if (z_counter == 900) {
            z_counter = 0;
            Array.from(selected).reverse().forEach((x) => x.style.zIndex = z_counter++);
        }
        token.style.zIndex = z_counter++;

        if (!token.classList.contains("map_token"))
            endTmap();
        else
            startTmap();

        drags[uid] = {
            dx: event.clientX - token.style.left.slice(0, -2),
            dy: event.clientY - token.style.top.slice(0, -2)
        };

        if (event.target === token) {
            selected = selected.filter((x) => x != token);
            selected.splice(0, 0, token);
            if (tmap)
                document.getElementById("sizeSlider").value = Math.floor(token.height / canvas.height) * 100;
            else
                document.getElementById("sizeSlider").value = token.height;
        }
    }

    function drag(event) {
        if (!(uid in drags && event.target === token)) return;
        if (event.type == "mousemove") {
            if (!mouse_dragging) return;
            event.preventDefault();
        }

        var dx = event.clientX - drags[uid].dx;
        var dy = event.clientY - drags[uid].dy;

        token.style.left = dx + 'px';
        token.style.top = dy + 'px';
    }
}
// ---------- Token Init ---------- //


// ---------- Canvas Init ---------- //
canvas.style.backgroundImage = "url(Assets/Misc/blank.png)";

function drawstart(event) {
    if (event.type == "mousedown")
        mouse_dragging = true;
    ctx.beginPath();
    ctx.moveTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
    drawing++;

    lines[event.identifier] = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop
    };
}

function drawend(event) {
    if (drawing == 0) return;

    mouse_dragging = false;
    drawing--;
}

function drawmove(event) {
    if (drawing == 0) return;
    if (!(event.target === canvas)) return;
    if (event.type == "mousemove")
        if (!mouse_dragging) return;

    if (erasing)
        ctx.clearRect(event.pageX - 35, event.pageY - 35, 70, 70);

    ctx.moveTo(lines[event.identifier].x, lines[event.identifier].y);
    ctx.lineTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
    ctx.stroke();

    lines[event.identifier] = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop
    };
}

function touchstart(event) { Array.from(event.touches).forEach(e => drawstart(e)) }

function touchend(event) { Array.from(event.changedTouches).forEach(e => drawend(e)) }

function touchmove(event) {
    event.preventDefault();
    Array.from(event.touches).forEach(e => drawmove(e));
}

canvas.addEventListener("touchstart", touchstart, false);
canvas.addEventListener("touchend", touchend, false);
canvas.addEventListener("touchmove", touchmove, false);

canvas.addEventListener("mousedown", drawstart);
canvas.addEventListener("mouseup", drawend);
canvas.addEventListener("mousemove", drawmove);
// ---------- Canvas Init ---------- //