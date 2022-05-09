const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = 0;
let mouse_dragging = false;
let lines = [, ];
let drags = [, ];
let selected = [];
let uid_counter = 0;


// ---------- Window Init ---------- //
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
ctx.lineWidth = 5;
// ---------- Window Init ---------- //


// ---------- Button Init ---------- //
Array.from(document.querySelectorAll(".clr")).forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr
    })
});

document.querySelector(".clear").addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
});

document.querySelector(".del").addEventListener("click", () => {
    while (selected.length > 0) {
        if (!selected[0])
            selected.splice(0, 1);
        else {
            selected[0].remove();
            selected.splice(0, 1);
            break;
        }
    }
});

document.getElementById("sizeSlider").oninput = function() {
    if (selected.length > 0) {
        selected[0].height = this.value;
        selected[0].width = this.value;
    }
};

document.getElementById("aoe").onclick = function() {
    createToken(null);
};
// ---------- Button Init ---------- //


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
                    canvas.style.backgroundImage = "url(Assets/blank.png)";
                else
                    canvas.style.backgroundImage = window.getComputedStyle(this).backgroundImage;
            });
            panel = panel.nextElementSibling;
        }
    }
});
// ---------- Dropdown Init ---------- //


// ---------- Token Init ---------- //
function createToken(event) {
    var token = new Image(200, 200);
    var uid = uid_counter++;

    if (event) {
        token.style.left = 300 + 'px';
        token.style.top = 200 + 'px';
        token.src = window.getComputedStyle(this).backgroundImage.slice(5, -2);
    } else {
        token.style.left = 400 + 'px';
        token.style.top = 300 + 'px';
        token.src = "Assets/aoe.png";
    }

    token.classList.add("token");
    document.body.appendChild(token);
    selected.splice(0, 0, token);

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

        drags[uid] = {
            dx: event.clientX - token.style.left.slice(0, -2),
            dy: event.clientY - token.style.top.slice(0, -2)
        };

        if (event.target === token) {
            selected.splice(0, 0, token);
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
canvas.style.backgroundImage = "url(Assets/blank.png)";

function drawstart(event) {
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

    drawing--;
}

function drawmove(event) {
    if (drawing == 0) return;
    if (!(event.target === canvas)) return;

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