const canvas = document.getElementById("canvas")
canvas.height = window.innerHeight
canvas.width = window.innerWidth

const ctx = canvas.getContext("2d")

let prevX = null
let prevY = null
let drawing = false
let lines = [, ]
ctx.lineWidth = 5

// canvas.style.backgroundImage = "url('Assets/Maps/Black Peaks.jpg')"

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
})

function drawstart(event) {
    ctx.beginPath()
    ctx.moveTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop)
    drawing = false
    lines[event.identifier] = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop
    }
}

function drawend(event) {
    if (drawing) return;
    drawmove(event);
    drawing = true;
}

function drawmove(event) {
    if (drawing) return;
    ctx.moveTo(lines[event.identifier].x, lines[event.identifier].y)
    ctx.lineTo(event.pageX - canvas.offsetLeft, event.pageY - canvas.offsetTop);
    ctx.stroke();
    lines[event.identifier] = {
        x: event.pageX - canvas.offsetLeft,
        y: event.pageY - canvas.offsetTop
    }
}

function preventDrag(event) {
    event.preventDefault();
    Array.from(event.touches).forEach(e => drawmove(e));
}

canvas.addEventListener("touchstart", (event) => Array.from(event.touches).forEach(e => drawstart(e)), false)
canvas.addEventListener("touchend", (event) => Array.from(event.changedTouches).forEach(e => drawend(e)), false)
canvas.addEventListener("touchmove", preventDrag, false)