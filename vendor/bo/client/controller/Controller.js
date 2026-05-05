import { Modal } from "../view/Modal.js"

export default class Controller
{
    constructor()
    {
        this.modals = [
            new Modal({ controller: this, order: 1 }),
            // new Modal({ controller: this, order: 2 })
        ]
        this.screenIndex = 0
        this.stackView = []
    }

    render = (object) => 
    {
        const html = []
        if (this.screenIndex === 0) {
            html.push(`<div id='flScreen1'>${ object.render() }</div>`)
            html.push("<div id='flScreen2'></div>")
            html.push(this.modals[0].render())
            // html.push(this.modals[1].render())
            $("body").html(html)
        } else {
            html.push(object.render())
            $("#flModalTabs").html(html)
        }
        return html.join("\n")
    }

    trigger = (object) =>
    {
        object.trigger()
        if (this.screenIndex === 0) {
            this.modals[0].trigger()
            // this.modals[1].trigger()
        }
    }

    stack = async (object, title, modal = false) =>
    {
        await object.initialize()
        this.stackView.push(object)
        if (this.screenIndex === 0) {
            $("body").html(this.render(object))
            this.trigger(object)
        } else if (this.screenIndex === 1) {
            if (modal) {
                const content = object.render()
                $("#flModalTabs").html(content)
                $("#flModalForm").hide()
                $(`#flModalToggleLabel${ this.screenIndex }`).html(title)
                this.trigger(object)
                const element = document.getElementById(`flModalToggle${ this.screenIndex }`)
                try { // A mdbootstrap bug leading to try twice 
                    const modal = mdb.Modal.getOrCreateInstance(element)
                    modal.toggle()
                } catch {
                    const modal = mdb.Modal.getOrCreateInstance(element)
                    modal.toggle()
                }
            }
            else {
                const content = object.render()
                document.getElementById("flScreen2").innerHTML = content
                document.getElementById("flScreen1").style.display = "none"
                document.getElementById("flScreen2").style.display = "block"
                this.trigger(object)
            }
        }
        else {
            const content = object.render()
            $("#flModalTabs").hide()
            $("#flModalForm").show()
            $("#flModalForm").html(content)
            this.trigger(object)
        }
        this.screenIndex++
    }

    unstack = (modal = false) => {
        if (modal) {
            const element = document.getElementById(`flModalToggle${ this.screenIndex - 1 }`)
            mdb.Modal.getInstance(element).hide()
        } else {
            this.screenIndex--
            document.getElementById("flScreen2").style.display = "none"
            document.getElementById("flScreen1").style.display = "block"
        }
        this.stackView.pop()
    }
}
