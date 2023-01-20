if (window.localStorage.getItem("viewedPrompt") === null) document.getElementById("optionsmenu").classList.remove("unopen")

if (window.localStorage.getItem("theme") === null)
{
    document.getElementById("colourselector").value = "#FFFF00"
    window.localStorage.setItem("theme", document.getElementById("colourselector").value)
}
else document.getElementById("colourselector").value = window.localStorage.getItem("theme")

// credit to chatGPT
function getContrastingTextColor(hex) {
    var r = parseInt(hex.substr(1, 2), 16);
    var g = parseInt(hex.substr(3, 2), 16);
    var b = parseInt(hex.substr(5, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? "rgb(35, 35, 35)" : "rgb(234, 234, 234)";
}

var themestyler = document.createElement("style")
themestyler.innerText = `:root { --theme-color: ${document.getElementById("colourselector").value}; --text-color: ${getContrastingTextColor(document.getElementById("colourselector").value)};}`
document.head.appendChild(themestyler)

document.getElementById("colourselector").addEventListener("input", () => {
    window.localStorage.setItem("theme", document.getElementById("colourselector").value)
    themestyler.remove()
    themestyler = document.createElement("style")
    themestyler.innerText = `:root { --theme-color: ${document.getElementById("colourselector").value}; --text-color: ${getContrastingTextColor(document.getElementById("colourselector").value)};}`
    document.head.appendChild(themestyler)
})

document.getElementById("closebtn").addEventListener("click", () => {
    window.localStorage.setItem("viewedPrompt", "true")
    document.getElementById("optionsmenu").classList.add("unopen")
})

document.getElementById("h2ubtn").addEventListener("click", () => {
    document.getElementById("menuwrapper").click()
    document.getElementById("optionsmenu").classList.remove("unopen")
})

document.getElementById("menuwrapper").addEventListener("click", () => {
    if (document.getElementById("line1").classList.contains("open"))
    {
        document.getElementById("settingsmenu").classList.add("unopen")

        document.getElementById("line1").classList.remove("open")
        document.getElementById("line2").classList.remove("open")
        document.getElementById("line3").classList.remove("open")
    }
    else
    {
        document.getElementById("settingsmenu").classList.remove("unopen")

        document.getElementById("line1").classList.add("open")
        document.getElementById("line2").classList.add("open")
        document.getElementById("line3").classList.add("open")
    }
})

function openContextMenu(event, contexttype)
{    
    menus.forEach(menu => menu.style.display = "none")
    
    menus[contexttype].style.top = event.pageY + "px"
    menus[contexttype].style.left = event.pageX + "px"

    menus[contexttype].style.display = "flex"

    newgatex = event.pageX
    newgatey = event.pageY

    return false
}

function closeContextMenu(contexttype) { menus[contexttype].style.display = "none" }

document.getElementById("gates").addEventListener("contextmenu", event => {
    event.preventDefault()
    if (nodeselectstate.length !== 0)
    {
        nodeselectstate = []
        redraw()
    }
    else
    {
        if (event.target !== document.getElementById("gates")) return
        openContextMenu(event, 0)
    }

}, false)

document.addEventListener("click", event => {
    if (!event.composedPath().includes(contextmenu)) closeContextMenu(0)
})

document.addEventListener("keydown", event => {
    if (!event.repeat)
    {
        // case for every button combo
        if (event.code == "Escape")
        {
            closeContextMenu(0)
            if (nodeselectstate.length !== 0)
            {
                nodeselectstate = []
                redraw()
            }
        }
    }
})

Array.from(document.getElementsByClassName("menuitem")).forEach(item => {
    if (item.getAttribute("data-gate-type"))
    item.addEventListener("click", event => {
        new Gate(newgatex, newgatey, item.getAttribute("data-gate-type"))
        closeContextMenu(0)
    })
    else
    item.addEventListener("click", event => {
        clickedgate.delete()
        closeContextMenu(1)
    })
})

function redraw(nodeselect = false, event = null)
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    gates.forEach(gate => {
        try {
            if (gate.type !== "output")
            {
                ctx.strokeStyle = gate.outputs[0] ? "#f00" : "#000"
                for (var i = 0; i < gate.child.length; i++)
                {
                        ctx.beginPath()
                        ctx.moveTo(gate.outputnodepositions[0][0], gate.outputnodepositions[0][1])
                        ctx.lineTo(gate.child[i].inputnodepositions[gate.pid[i]][0], gate.child[i].inputnodepositions[gate.pid[i]][1])
                        ctx.stroke()
                        console.log("line %s drew", i)
                }
            }
            else console.log("gate is output!")
        }
        catch (e) { console.log("could not draw line!"); console.log(e) }
    })

    if (event !== null && nodeselect)
    {
        console.log("mousemove!")
        ctx.beginPath()
        ctx.strokeStyle = nodeselectstate[0].outputs[0] ? "#f00" : "#000"
        ctx.moveTo(nodeselectstate[1][0], nodeselectstate[1][1])
        ctx.lineTo(event.pageX, event.pageY)
        ctx.stroke()
    }
}

window.addEventListener("resize", redraw)

document.addEventListener("mousemove", event => {
    if (nodeselectstate.length !== 0) redraw(true, event)
})
