import { Modal } from "../view/Modal.js"

export default class Controller
{
    constructor({ url })
    {
        this.url = url
        this.modal = new Modal({ controller: this, order: 1 })
    }

    render = (object) => 
    {
        const html = []
        html.push(`<div id="flScreen1" class="screen">${ object.render() }</div>`)
        html.push(`
            <div id="flScreen2" class="screen hidden">
                <button type="button" class="btn-close ripple-surface back-button" id="flScreen2BackButton" aria-label="Close"></button>
                <div id="flScreen2Content"></div>
            </div>`)
        html.push(this.modal.render())
        $("body").html(html)
        return html.join("\n")
    }

    trigger = (object) =>
    {
        object.trigger()
        this.modal.trigger()
    }

    stack = async (object) =>
    {
        await object.initialize()
        const content = object.render()
        // Hide screen 1 et show screen 2
        document.getElementById("flScreen2Content").innerHTML = content
        document.getElementById("flScreen1").classList.add("hidden")
        document.getElementById("flScreen1").classList.remove("visible")
        document.getElementById("flScreen2").classList.add("visible")
        document.getElementById("flScreen2").classList.remove("hidden")
        this.trigger(object)

        // Update URL et history
        history.pushState({ screen: "detail" }, "", this.url)

        document.getElementById("flScreen2BackButton").onclick = () => {
            this.unstack()
        }

        window.addEventListener("popstate", (event) => {
            if (event.state) {
                if (event.state.screen === "detail") {
                    this.stack(object)
                } else {
                    this.unstack()
                }
            } else {
                this.stack(object)
            }
        })

    }

    unstack = () => {
        document.getElementById("flScreen2").classList.add("hidden")
        document.getElementById("flScreen2").classList.remove("visible")
        document.getElementById("flScreen1").classList.add("visible")
        document.getElementById("flScreen1").classList.remove("hidden")

        history.pushState({ screen: "index" }, "", this.url)
    }

    showModal = async (object, title) =>
    {
        await object.initialize()
        const content = object.render()
        $("#flModalTabs").html(content)
        $("#flModalForm").hide()
        $("#flModalToggleLabel1").html(title)
        this.trigger(object)
        const element = document.getElementById("flModalToggle1")
        // try { // Try twice due to a mdbootstrap bug 
            const modal = mdb.Modal.getOrCreateInstance(element)
            modal.toggle()
        // } catch {
        //     const modal = mdb.Modal.getOrCreateInstance(element)
        //     modal.toggle()
        // }
    }

    hideModal = () => {
        const element = document.getElementById("flModalToggle1")
        mdb.Modal.getInstance(element).toggle()
    }
}
