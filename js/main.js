if (window.localStorage.getItem("viewedPrompt") === null)
document.getElementById("intromenu").classList.remove("unopen")

if (window.localStorage.getItem("settings") === null)
{
    document.getElementById("colourselector").value = "#FFFF00"
    document.getElementById("colourselector2").value = "#FF0000"
    window.localStorage.setItem("settings", JSON.stringify(settings))
}
else
{
    settings = JSON.parse(window.localStorage.getItem("settings"))
    document.getElementById("colourselector").value = settings.themecol
    document.getElementById("colourselector2").value = settings.oncol
}
// credit to chatGPT
function getContrastingTextColor(hex) { return ((parseInt(hex.substr(1,2),16)*299)+(parseInt(hex.substr(3,2),16)*587)+(parseInt(hex.substr(5,2),16)*114))/1000>=128?"rgb(35, 35, 35)":"rgb(234, 234, 234)" }

var themestyler;

function updatecustomstylesheets()
{
    window.localStorage.setItem("settings", JSON.stringify(settings))

    try {themestyler.remove()} catch(_) {}
    themestyler = document.createElement("style")
    themestyler.innerText = `:root{--theme-color:${settings.themecol};--text-color:${getContrastingTextColor(settings.themecol)};--border-radius:${settings.rounding}px;--on-col:${settings.oncol};}`
    document.head.appendChild(themestyler)
}

updatecustomstylesheets()

document.getElementById("colourselector").addEventListener("input", () => {
    settings.themecol = document.getElementById("colourselector").value
    updatecustomstylesheets()
    redrawAll()
})

document.getElementById("colourselector2").addEventListener("input", () => {
    settings.oncol = document.getElementById("colourselector2").value
    updatecustomstylesheets()
    redrawAll()
})

document.getElementById("closebtn").addEventListener("click", () => {
    window.localStorage.setItem("viewedPrompt", "true")
    document.getElementById("intromenu").classList.add("unopen")
})

document.getElementById("closeoutdated").addEventListener("click", () => {
    document.getElementById("outdated").classList.add("unopen")
})

document.getElementById("h2ubtn").addEventListener("click", () => {
    document.getElementById("menuwrapper").click()
    document.getElementById("intromenu").classList.remove("unopen")
})

document.getElementById("clearbtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear localStorage?"))
    {
        window.localStorage.clear()
        window.location.reload()
    }
})

Array.from(document.getElementsByClassName("toggle")).forEach(toggle => {
    if (settings[toggle.getAttribute("data-setting")]) toggle.classList.add("right")
    toggle.addEventListener("click", () => {
        if (toggle.classList.contains("right"))
        {
            settings[toggle.getAttribute("data-setting")] = false
            updatecustomstylesheets()
            toggle.classList.remove("right")
        }
        else
        {
            settings[toggle.getAttribute("data-setting")] = true
            updatecustomstylesheets()
            toggle.classList.add("right")
        }
    })
})

document.getElementById("projectbtn").addEventListener("click", () => {
    window.open("https://undefined06855.github.io/projects/", "_blank")
})

document.getElementById("sourcebtn").addEventListener("click", () => {
    window.open("https://github.com/undefined06855/WebGates", "_blank")
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
    menus[contexttype].style.display = "flex"
    menus[contexttype].style.top = event.pageY + "px"
    menus[contexttype].style.left = event.pageX + "px"

    const rect = menus[contexttype].getBoundingClientRect()
    
    if (rect.bottom > window.innerHeight) newgatey = (event.pageY - rect.height)
    else newgatey = event.pageY
    if (rect.right > window.innerWidth) newgatex = (event.pageX - rect.width)
    else newgatex = event.pageX

    menus[contexttype].style.top = newgatey + "px"
    menus[contexttype].style.left = newgatex + "px"

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
    if (!event.composedPath().includes(contextmenu2)) closeContextMenu(1)
})

document.addEventListener("keydown", event => {
    if (!event.repeat)
    {
        // case for every button combo
        if (event.code == "Escape")
        {
            closeContextMenu(0)
            closeContextMenu(1)
            if (nodeselectstate.length !== 0)
            {
                nodeselectstate = []
                redraw()
            }
            else
            {
                document.getElementById("menuwrapper").click()
            }
        }
    }
})

Array.from(document.getElementsByClassName("menuitem")).forEach(item => {
    item.addEventListener("click", () => {
             if (item.getAttribute("data-action-type") == "delete") clickedgate.delete()
             if (item.getAttribute("data-action-type") == "clone") clickedgate.clone()
        else if (item.getAttribute("data-gate-type")) new Gate(newgatex, newgatey, item.getAttribute("data-gate-type"))

        closeContextMenu(0)
        closeContextMenu(1)
    })
})

CanvasRenderingContext2D.prototype._cross = (x, y) => {
    ctx.beginPath()
    ctx.moveTo(x - 5, y - 5)
    ctx.lineTo(x + 5, y + 5)
    ctx.stroke()

    ctx.beginPath()
    ctx.moveTo(x + 5, y - 5)
    ctx.lineTo(x - 5, y + 5)
    ctx.stroke()
}

CanvasRenderingContext2D.prototype._line = (x1, y1, x2, y2, verticalend = false) => {
    var handle1x, handle2x, handle1y, handle2y
    if (verticalend)
    {
        handle1x = (x1 + x2) / 2
        handle2x = x2
        handle1y = y1
        handle2y = (y1 + y2) / 2
    }
    else
    {
        handle1x = (x1 + x2) / 2
        handle2x = (x1 + x2) / 2
        handle1y = y1
        handle2y = y2
    }


    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.bezierCurveTo(
        handle1x, handle1y,
        handle2x, handle2y, x2, y2
    )
    ctx.stroke()

    if (settings.curveDebug)
    {
        ctx._cross(handle1x, handle1y)
        ctx._cross(handle2x, handle2y)
    }
}

function redraw()
{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    gates.forEach(gate => {
        try {
            if (gate.type !== "output")
            {
                ctx.strokeStyle = gate.outputs[0] ? settings.oncol : "#000"
                for (var i = 0; i < gate.child.length; i++)
                {
                    ctx._line(
                        gate.outputnodepositions[0][0],
                        gate.outputnodepositions[0][1],
                        gate.child[i].inputnodepositions[gate.pid[i]][0],
                        gate.child[i].inputnodepositions[gate.pid[i]][1],
                        gate.child[i].type == "7seg"
                    )
                    //console.log("line %s drew", i) <- makes performance terrible
                }
            }
            //else console.log("gate is output!") <- makes performance terrible
        }
        catch (_) { console.log("error drawing line!")}
    })

    if (nodeselectstate.length !== 0)
    {
        ctx.strokeStyle = nodeselectstate[0].outputs[0] ? settings.oncol : "#000"

        ctx.beginPath()
        ctx.moveTo(nodeselectstate[1][0], nodeselectstate[1][1])
        ctx.lineTo(mousex, mousey)
        ctx.stroke()
    }
}

window.addEventListener("resize", redraw)

document.addEventListener("mousemove", event => {
    mousex = event.pageX
    mousey = event.pageY

    if (nodeselectstate.length !== 0)
    {
        redraw()
    }
})

function redrawAll()
{
    gates.forEach(gate => {
        if (gate.type == "7seg") fillSegments(gate.ctx, gate.canvas, gate.inputs)
    })
    redraw()
}
