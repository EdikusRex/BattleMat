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
                    canvas.style.backgroundImage = "url(Assets/blank_gray.png)";
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
    document.body.appendChild(token);

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    token.addEventListener("touchstart", tdragStart, false);
    token.addEventListener("touchend", tdragEnd, false);
    token.addEventListener("touchmove", tdrag, false);

    token.addEventListener("mousedown", dragStart, false);
    token.addEventListener("mouseup", dragEnd, false);
    token.addEventListener("mousemove", drag, false);

    function tdragStart(event) {
        Array.from(event.touches).forEach(e => dragStart(e));
    }

    function tdragEnd(event) {
        Array.from(event.touches).forEach(e => dragEnd(e));
    }

    function tdrag(event) {
        event.preventDefault();
        Array.from(event.touches).forEach(e => drag(e));
    }

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === token) {
            active = true;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;

        active = false;
    }

    function drag(e) {
        if (active) {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, token);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
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