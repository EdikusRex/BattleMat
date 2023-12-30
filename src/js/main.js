const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function initWindow() {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    ctx.lineWidth = 5;
}

// Init all js objects. The app runs purely off event listeners after that.
function main() {
    initWindow();
    initCanvas();
    initButtons();
    initDropdowns();
}

// Start the program
main();