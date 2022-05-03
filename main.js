const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let drawing = false;
let lines = [, ];
let selected = null;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
ctx.lineWidth = 5;


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
    if (selected)
        selected.remove();
});

document.getElementById("sizeSlider").oninput = function() {
    if (selected) {
        selected.height = this.value;
        selected.width = this.value;
    }
}
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
    }
    else if (acc.id == "maps") {
        var panel = acc.nextElementSibling;
        while (panel != null && panel.classList.contains("panel")) {
            panel.children[0].addEventListener("click", function() {
                if (canvas.style.backgroundImage == window.getComputedStyle(this).backgroundImage)
                    canvas.style.backgroundImage = 'none';
                else
                    canvas.style.backgroundImage = window.getComputedStyle(this).backgroundImage;
            });
            panel = panel.nextElementSibling;
        }
    }
});

function createToken() {
    var token = new Image(200, 200);
    token.src = window.getComputedStyle(this).backgroundImage.slice(5, -2);
    token.classList.add("token");

    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    document.body.appendChild(token);
    token.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        selected = token;
        document.getElementById("sizeSlider").value = token.width;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        token.style.top = (token.offsetTop - pos2) + "px";
        token.style.left = (token.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
// ---------- Dropdown Init ---------- //


// ---------- Canvas Init ---------- //
function drawstart(event) {
    ctx.beginPath();
    ctx.moveTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
    drawing = true;
    lines[event.identifier] = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop
    };
}

function drawend(event) {
    if (!drawing) return;
    drawmove(event);
    drawing = false;
}

function drawmove(event) {
    if (!drawing) return;
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