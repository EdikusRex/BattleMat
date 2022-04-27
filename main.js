const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

let prevX = null
let prevY = null
let drawing = false
let lines = [, ]

canvas.height = window.innerHeight
canvas.width = window.innerWidth
ctx.lineWidth = 5

// canvas.style.backgroundImage = "url('Assets/Maps/Black Peaks.jpg')"


// ---------- Button Init ---------- //
let clrs = document.querySelectorAll(".clr")
clrs = Array.from(clrs)
clrs.forEach(clr => {
    clr.addEventListener("click", () => {
        ctx.strokeStyle = clr.dataset.clr
    })
})

let clearBtn = document.querySelector(".clear")
clearBtn.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
});
// ---------- Button Init ---------- //

// ---------- Dropdown Init ---------- //
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
// ---------- Dropdown Init ---------- //


function drawstart(event) {
    ctx.beginPath()
    ctx.moveTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop)
    drawing = true
    lines[event.identifier] = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop
    }
}

function drawend(event) {
    if (!drawing) return;
    drawmove(event);
    drawing = false;
}

function drawmove(event) {
    if (!drawing) return;
    ctx.moveTo(lines[event.identifier].x, lines[event.identifier].y)
    ctx.lineTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
    ctx.stroke();
    lines[event.identifier] = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop
    }
}

function touchstart(event) { Array.from(event.touches).forEach(e => drawstart(e)) }

function touchend(event) { Array.from(event.changedTouches).forEach(e => drawend(e)) }

function touchmove(event) {
    event.preventDefault();
    Array.from(event.touches).forEach(e => drawmove(e));
}

canvas.addEventListener("touchstart", touchstart, false)
canvas.addEventListener("touchend", touchend, false)
canvas.addEventListener("touchmove", touchmove, false)

canvas.addEventListener("mousedown", drawstart)
canvas.addEventListener("mouseup", drawend)
canvas.addEventListener("mousemove", drawmove)