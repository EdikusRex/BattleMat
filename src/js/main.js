const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = 0;
let erasing = false;
let selecting = false;
let tmap = false;
let map_tok = null;
let mouse_dragging = false;
let lines = [, ];
let drags = [, ];
let selected = [];
let uid_counter = 0;
let z_counter = 0;

let scale_start = 80;


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
    if (!selecting)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
    else if (selected.length > 0) {
        selected[0].classList.remove("selected");
        selected.splice(0, 1);
    }
});

document.querySelector(".erase").addEventListener("click", () => {
    ctx.strokeStyle = "rgba(0,0,0,0)";
    canvas.style.cursor = "url(\"Assets/Misc/square.png\") 40 40, auto";
    erasing = true;
    endTmap();
    endSel();

    if (!document.querySelector(".erase").classList.contains("active"))
        document.querySelector(".erase").classList.add("active");
});

document.querySelector(".del").addEventListener("click", () => {
    while (selecting && selected.length > 0) {
        if (!selected[0])
            selected.splice(0, 1);
        else {
            selected[0].remove();
            selected.splice(0, 1);
        }
    }
    if (tmap) {
        canvas.style.backgroundSize = "100% 100%";
        canvas.style.backgroundPosition = "0px 0px";
        map_tok.remove();
        map_tok = null;
        endTmap();
    }
});

document.querySelector(".tmap").addEventListener("click", () => {
    if (!tmap && canvas.style.backgroundImage == "url(\"Assets/Misc/blank.png\")") return;

    canvas.style.cursor = "auto";
    if (tmap)
        endTmap();
    else {
        startTmap();
        createToken(null, true);
    }

    if (canvas.style.backgroundSize)
        document.getElementById("sizeSlider").value = canvas.style.backgroundSize.split("%")[0];
    else
        document.getElementById("sizeSlider").value = 100;
});

function endSel() {
    Array.from(selected).forEach((x) => x.classList.remove("selected"));
    selected = [];
    selecting = false;

    if (document.querySelector(".sel").classList.contains("active"))
        document.querySelector(".sel").classList.remove("active");

    if (!document.querySelector(".slidecontainer").classList.contains("hidden"))
        document.querySelector(".slidecontainer").classList.add("hidden");
    if (!document.querySelector(".rotateslider").classList.contains("hidden"))
        document.querySelector(".rotateslider").classList.add("hidden");
}

document.querySelector(".slidecontainer").classList.add("hidden");
document.querySelector(".rotateslider").classList.add("hidden");
document.querySelector(".sel").addEventListener("click", () => {
    if (selecting) {
        endSel();
    } else {
        if (tmap)
            endTmap();
        selecting = true;
        Array.from(selected).forEach((x) => x.classList.add("selected"));
        erasing = false;
        canvas.style.cursor = "auto";

        if (!document.querySelector(".sel").classList.contains("active"))
            document.querySelector(".sel").classList.add("active");

        if (document.querySelector(".slidecontainer").classList.contains("hidden"))
            document.querySelector(".slidecontainer").classList.remove("hidden");
        if (document.querySelector(".rotateslider").classList.contains("hidden"))
            document.querySelector(".rotateslider").classList.remove("hidden");

        if (document.querySelector(".erase").classList.contains("active"))
            document.querySelector(".erase").classList.remove("active");
    }
});

document.getElementById("sizeSlider").value = scale_start;
document.getElementById("sizeSlider").oninput = function() {
    if (tmap) {
        canvas.style.backgroundSize = this.value + "%";
        map_tok.height = canvas.height * this.value * 0.01;
        map_tok.width = canvas.width * this.value * 0.01;
    } else if (selected.length > 0) {
        Array.from(selected).forEach((x) => {
            var scale = this.value / scale_start;
            var maintain = x.style.transform.split(" ")[1];

            x.style.transform = "scale(" + scale + ")" + maintain;
        });
    }
};

document.getElementById("rotateSlider").oninput = function() {
    if (tmap || selected.length == 0) return;

    Array.from(selected).forEach((x) => {
        var maintain = x.style.transform.split(" ")[0];
        x.style.transform = maintain + "rotate(" + this.value + "deg)";
    });
};
// ---------- Button Init ---------- //


// ---------- Transform Map ---------- //
function startTmap() {
    tmap = true;
    erasing = false;
    endSel();

    if (document.querySelector(".slidecontainer").classList.contains("hidden"))
        document.querySelector(".slidecontainer").classList.remove("hidden");

    if (!document.querySelector(".tmap").classList.contains("active"))
        document.querySelector(".tmap").classList.add("active");

    if (document.querySelector(".erase").classList.contains("active"))
        document.querySelector(".erase").classList.remove("active");
}

function endTmap() {
    tmap = false;

    if (document.querySelector(".tmap").classList.contains("active"))
        document.querySelector(".tmap").classList.remove("active");

    if (selecting) return;

    if (!document.querySelector(".slidecontainer").classList.contains("hidden"))
        document.querySelector(".slidecontainer").classList.add("hidden");

    if (map_tok) {
        canvas.style.backgroundImage = "url(" + map_tok.src + ")";
        canvas.style.backgroundPosition = map_tok.style.left + " " + map_tok.style.top;
        canvas.style.backgroundSize = document.getElementById("sizeSlider").value + "% " +
            document.getElementById("sizeSlider").value + "%";
        map_tok.remove();
    }
}
// ---------- Transform Map ---------- //


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
    } else if (acc.id == "aoe") {
        var panel = acc.nextElementSibling;
        while (panel != null && panel.classList.contains("panel")) {
            panel.children[0].addEventListener("click", createToken);
            panel = panel.nextElementSibling;
        }
    }
});
// ---------- Dropdown Init ---------- //


// ---------- Token Init ---------- //
function createToken(event, map_create) {
    var token = new Image(scale_start, scale_start);
    var uid = uid_counter++;

    if (!map_create)
        endTmap();

    if (tmap) {
        if (!canvas.style.backgroundSize)
            canvas.style.backgroundSize = "100% 100%";
        token.width = canvas.width * canvas.style.backgroundSize.split("%")[0] * 0.01;
        token.height = canvas.height * canvas.style.backgroundSize.split("%")[1].slice(1) * 0.01;

        token.src = canvas.style.backgroundImage.slice(5, -2);

        if (canvas.style.backgroundPosition) {
            token.style.left = canvas.style.backgroundPosition.split(" ")[0];
            token.style.top = canvas.style.backgroundPosition.split(" ")[1];
        } else {
            token.style.left = "0px";
            token.style.top = "0px";
        }
        token.style.opacity = 0.4;
        token.style.zIndex = 998;
        token.classList.add("map_token");
        map_tok = token;

        canvas.style.backgroundImage = "url(Assets/Misc/blank.png)";
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
    token.style.transform = "scale(1) rotate(0)";

    token.classList.add("token");
    if (selecting) {
        token.classList.add("selected");
        selected.splice(0, 0, token);
    }
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

        if (token.classList.contains("map_token"))
            startTmap();

        drags[uid] = {
            dx: event.clientX - token.style.left.slice(0, -2),
            dy: event.clientY - token.style.top.slice(0, -2)
        };

        if (event.target === token) {
            if (selecting) {
                selected = selected.filter((x) => x != token);
                selected.splice(0, 0, token);
                if (!token.classList.contains("selected"))
                    token.classList.add("selected");
            }
            if (tmap)
                document.getElementById("sizeSlider").value = canvas.style.backgroundSize.split("%")[0];
            else {
                document.getElementById("sizeSlider").value = token.style.transform.split(" ")[0].slice(6, -1) * scale_start;

                if (token.style.transform)
                    document.getElementById("rotateSlider").value = token.style.transform.split(" ")[1].slice(7, -4);
                else
                    document.getElementById("rotateSlider").value = 0;
            }
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

    ctx.lineTo(event.pageX - canvas.offsetLeft - 5, event.pageY - canvas.offsetTop + 5);
    ctx.stroke();
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