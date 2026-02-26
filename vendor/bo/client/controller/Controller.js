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
        html.push(object.render())
        html.push(this.modals[0].render())
        html.push(this.modals[1].render())
        return html.join("\n")
    }

    stack = async (object) =>
    {
        await object.initialize()
        if (this.screenIndex === 0) {
            $("body").html(this.render(object))
            this.trigger()
            object.trigger()
        } else {
            const content = object.render()
            $(`#appleeModalBody${ this.screenIndex }`).html(content)
            object.trigger()
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

    trigger = () =>
    {
        this.modals[0].trigger()
        this.modals[1].trigger()
    }
}
