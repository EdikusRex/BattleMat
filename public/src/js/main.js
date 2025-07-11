// Init all js objects. The app runs purely off event listeners after that.
function main() {
    initCanvas()
    initMap()
    initGrid()
    initButtons()
    initDropdowns()
    document.addEventListener('contextmenu', event => event.preventDefault());
}

// Start the program
main()