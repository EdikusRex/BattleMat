// ---------- Dropdowns ---------- //
function initDropdowns() {
    Array.from(document.getElementsByClassName("accordion")).forEach((acc) => {
        acc.addEventListener("click", toggleAccordion)
        assignAccordionBehavior(acc)
    })
}

// Toggle panels open or closed
function toggleAccordion() {
    Array.from(document.getElementsByClassName("accordion"))
        .filter((acc) => acc == this || acc.classList.contains("active"))
        .forEach((acc) => {
            var panelContainer = acc.nextElementSibling

            acc.classList.toggle("active")
            setMenuHeight(acc.classList.contains("active"))

            if (panelContainer.style.maxHeight)
                panelContainer.style.maxHeight = null
            else
                panelContainer.style.maxHeight = (panelContainer.parentElement.offsetHeight - 180) + "px"
        })
}

function assignAccordionBehavior(acc) {
    let panelBehavior = null

    if (acc.id == "creatures" || acc.id == "aoe")
        panelBehavior = createToken
    else if (acc.id == "maps")
        panelBehavior = setMap

    var panel = acc.nextElementSibling.children[0]
    while (panel != null && panel.classList.contains("panel")) {
        panel.children[0].addEventListener("click", panelBehavior)
        panel = panel.nextElementSibling
    }
}

function setMenuHeight(accordionActive) {
    let menus = document.querySelector(".menus")

    if (accordionActive) {
        menus.style.height = "95%"
        menus.style.overflowY = "hidden"
    } else {
        menus.style.height = 0
        menus.style.overflowY = "visible"
    }
}
// ---------- Dropdowns ---------- //