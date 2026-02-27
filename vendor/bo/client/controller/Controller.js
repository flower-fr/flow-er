import { Modal } from "../view/Modal.js"

export default class Controller
{
    constructor()
    {
        this.modals = [
            new Modal({ controller: this, order: 1 }),
            new Modal({ controller: this, order: 2 })
        ]
        this.screenIndex = 0
    }

    render = (object) => 
    {
        const html = []
        if (this.screenIndex === 0) {
            html.push(object.render())
            html.push(this.modals[0].render())
            html.push(this.modals[1].render())
            $("body").html(html)
        } else {
            html.push(object.render())
            $(`#appleeModalBody${ this.screenIndex }`).html(html)
        }
        return html.join("\n")
    }

    trigger = (object) =>
    {
        object.trigger()
        if (this.screenIndex === 0) {
            this.modals[0].trigger()
            this.modals[1].trigger()
        }
    }

    stack = async (object, title) =>
    {
        await object.initialize()
        if (this.screenIndex === 0) {
            $("body").html(this.render(object))
            this.trigger(object)
        } else {
            const content = object.render()
            $(`#appleeModalBody${ this.screenIndex }`).html(content)
            $(`#appleeModalToggleLabel${ this.screenIndex }`).html(title)
            this.trigger(object)
            const element = document.getElementById(`appleeModalToggle${ this.screenIndex }`)
            const modal = mdb.Modal.getOrCreateInstance(element)
            modal.toggle()
        }
        this.screenIndex++
    }

    unstack = () => {
        const element = document.getElementById(`appleeModalToggle${ this.screenIndex - 1 }`)
        mdb.Modal.getInstance(element).hide()
    }
}
