const contextmenu = document.getElementById("ctxmenu")
const contextmenu2 = document.getElementById("ctxmenu2")

const menus = [contextmenu, contextmenu2]

const types = ["input", "output", "or", "and", "xor", "not", "nor", "nand", "xnor"]

var nodeselectstate = []

const notes = {
    // width, height, inputs, outputs
    "input": [150, 150, 0, 1],
    "output": [150, 150, 1, 0],
    "or": [140, 150, 2, 1],
    "and": [140, 150, 2, 1],
    "xor": [140, 150, 2, 1],
    "not": [140, 70, 1, 1],
    "nor": [140, 150, 2, 1],
    "nand": [140, 150, 2, 1],
    "xnor": [140, 150, 2, 1]
}

var gates = []

var newgatex = 0
var newgatey = 0

const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

ctx.lineWidth = 10

var lines = []

var clickedgate = undefined

class Gate
{
    constructor(x, y, type)
    {
        
        this.x = x
        this.y = y
        this.width = notes[type][0]
        this.height = notes[type][1]
        this.type = type
        this.clicked = false
        this.moffx = 0
        this.moffy = 0
        this.id = Date.now()
        this.viewer = undefined
        this.child = []
        this.pid = [] // parent 0 or 1 of the child?
        this.inputnodepositions = []
        this.outputnodepositions = []

        this.inputnodeelements = []
        this.outputnodeelements = []

        if (this.type == "input")
        {
            this.inputs = []
            this.outputs = [false]
        }
        else if (this.type == "output")
        {
            this.inputs = [false]
            this.outputs = []
        }
        else if (this.type == "not")
        {
            this.inputs = [false]
            this.outputs = [false]
        }
        else
        {
            this.inputs = [false, false]
            this.outputs = [false]
        }

        this.element = document.createElement("div")
        this.element.classList.add("gate")

        this.element.style.top = this.y + "px"
        this.element.style.left = this.x + "px"
    
        this.element.style.width = this.width + "px"
        this.element.style.height = this.height + "px"

        if (this.type == "input" || this.type == "output")
        {
            const titlenode = document.createElement("div")
            titlenode.innerText = this.type
            titlenode.classList.add("title")
            this.element.appendChild(titlenode)

            this.viewer = document.createElement("button")
            this.element.appendChild(this.viewer)

            if (this.type == "input")
            {
                this.viewer.addEventListener("click", () => {
                    console.log("input node clicked")
                    this.outputs[0] = !this.outputs[0]

                    this.outputs[0]
                    ? this.viewer.setAttribute("data-button-set", "true")
                    : this.viewer.setAttribute("data-button-set", "false")

                    console.log("=> %s", this.outputs[0])

                    for (var i = 0; i < this.child.length; i++)
                    {
                        this.child[i].inputs[this.pid[i]] = this.outputs[0]
                        this.child[i].update()
                    }

                    redraw()
                })
            }
        }
        else
        {
            this.element.innerText = this.type
        }

        this.element.setAttribute("data-gate-type", this.type)

        this.inputnodes = document.createElement("div")
        this.inputnodes.classList.add("inputnodes")
        this.element.appendChild(this.inputnodes)

        this.outputnodes = document.createElement("div")
        this.outputnodes.classList.add("outputnodes")
        this.element.appendChild(this.outputnodes)

        document.getElementById("gates").appendChild(this.element)

        for (var i = 0; i < notes[this.type][2]; i++)
        {
            // append inputs
            const inputnode = document.createElement("div")
            inputnode.classList.add("input")
            inputnode.setAttribute("data-input-id", i)
            this.inputnodes.appendChild(inputnode)

            this.inputnodeelements.push(inputnode)

            inputnode.addEventListener("click", event => {
                if (nodeselectstate.length !== 0)
                {
                    if (nodeselectstate[0] !== this)
                    {
                        console.log("linking up...\npid=%s", inputnode.getAttribute("data-input-id"))
                        nodeselectstate[0].child.push(this)
                        nodeselectstate[0].pid.push(inputnode.getAttribute("data-input-id"))
    
                        nodeselectstate[0].update()
    
                        nodeselectstate = []
    
                        redraw()
                    }
                    else
                    {
                        console.log("cannot connect node to self!")
                    }
                }
                else
                {
                    console.log("output not clicked first!")
                }
            })
        }

        for (var i = 0; i < notes[this.type][3]; i++)
        {
            // append outputs
            const outputnode = document.createElement("div")
            outputnode.classList.add("input")
            this.outputnodes.appendChild(outputnode)

            this.outputnodeelements.push(outputnode)

            outputnode.addEventListener("click", event => {
                const rect = outputnode.getBoundingClientRect()
                nodeselectstate[0] = this
                nodeselectstate[1] = [
                    [(rect.left + rect.right) / 2],
                    [(rect.top + rect.bottom) / 2]
                ]
                console.log("clicked output node")
            })
        }

        this.recalcpositions()

        this.element.addEventListener("mousedown", event => {
            this.clicked = true
            this.moffx = event.clientX - this.x
            this.moffy = event.clientY - this.y
        })

        this.element.addEventListener("mouseup", () => this.clicked = false)
        this.element.addEventListener("mouseleave", () => this.clicked = false)
        this.element.addEventListener("mousemove", event => {
            if (this.clicked && nodeselectstate.length === 0)
            {
                var newy = event.clientY - this.moffy
                var newx = event.clientX - this.moffx

                if (newx < 0) newx = 1
                if (newx > window.innerWidth - this.width) newx = window.innerWidth - this.width - 1
                if (newy < 0) newy = 1
                if (newy > window.innerHeight - this.height) newy = window.innerHeight - this.height - 1

                this.x = newx
                this.y = newy

                this.element.style.left = newx + "px"
                this.element.style.top = newy + "px"

                this.recalcpositions()
                closeContextMenu(0)
                closeContextMenu(1)
                redraw()
            }
        })

        this.element.addEventListener("contextmenu", event => {
            clickedgate = this
            openContextMenu(event, 1)
        })

        window.addEventListener("resize", () => this.reposition()   )

        gates.push(this)
        this.reposition()
    }

    calculate()
    {
        switch(this.type)
        {
            case "output": this.viewer.setAttribute("data-button-set", this.inputs[0].toString()); return this.outputs[0]
            case "or": this.outputs[0] = this.inputs[0] || this.inputs[1]; return this.outputs[0]
            case "and": this.outputs[0] = this.inputs[0] && this.inputs[1]; return this.outputs[0]
            case "xor": this.outputs[0] = this.inputs[0] ? !this.inputs[1] : this.inputs[1]; return this.outputs[0]
            case "not": this.outputs[0] = !this.inputs[0]; break
            case "nor": this.outputs[0] = !(this.inputs[0] || this.inputs[1]); return this.outputs[0]
            case "nand": this.outputs[0] = !(this.inputs[0] && this.inputs[1]); return this.outputs[0]
            case "xnor": this.outputs[0] = !(this.inputs[0] ? !this.inputs[1] : this.inputs[1]); return this.outputs[0]
        }
    }

    update(inputs)
    {
        const out = this.calculate()
        if (this.type !== "output" && this.child !== undefined)
        {
            for (var i = 0; i < this.pid.length; i++)
            {
                console.log("updating...\nthis.type=%s\nthis.child.type=%s\noutput=%s", this.type, this.child[i].type, i)
                this.child[i].inputs[this.pid[i]] = this.outputs[0]
                this.child[i].update()
            }
        }
    }

    reposition()
    {
        if (this.x < 0) this.x = 1
        if (this.x > window.innerWidth - this.width) this.x = window.innerWidth - this.width - 1
        if (this.y < 0) this.y = 1
        if (this.y > window.innerHeight - this.height) this.y = window.innerHeight - this.height - 1

        this.element.style.left = this.x + "px"
        this.element.style.top = this.y + "px"

        this.recalcpositions()
    }

    recalcpositions()
    {
        this.inputnodepositions = []
        this.outputnodepositions = []

        this.inputnodeelements.forEach(node => {
            const rect = node.getBoundingClientRect()
            this.inputnodepositions.push([
                (rect.left + rect.right) / 2,
                (rect.top + rect.bottom) / 2
            ])
        })

        this.outputnodeelements.forEach(node => {
            const rect = node.getBoundingClientRect()
            this.outputnodepositions.push([
                (rect.left + rect.right) / 2,
                (rect.top + rect.bottom) / 2
            ])
        })
    }

    delete()
    {
        this.element.remove()
        gates.splice(gates.indexOf(this), 1)
        gates.forEach(gate => {
            const check = () => {
                var i = 0;
                gate.child.forEach(child => {
                    if (child === this)
                    {
                        gate.child.splice(i, 1)
                        check()
                    }
                    i++
                })
            }
            check()

        })
        for (var i = 0; i < this.child.length; i++)
        {
            this.child[i].inputs[this.pid[i]] = false
        }
        redraw()
    }
}
