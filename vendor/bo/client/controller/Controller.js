import { Modal } from "../view/Modal.js"

export default class Controller
{
    constructor({ url })
    {
        this.url = url
        this.modal = new Modal({ controller: this, order: 1 })
        this.screenIndex = 0
    }

    render = (object) => 
    {
        const html = []
        html.push(`
            <style>
                .screen {
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    position: absolute;
                    width: 100%;
                    padding: 20px;
                }

                .screen.hidden {
                opacity: 0;
                    transform: translateX(20px);
                    pointer-events: none;
                }

                .screen.visible {
                    opacity: 1;
                    transform: translateX(0);
                }

                /* Style pour le bouton Retour */
                .back-button {
                    border: none;
                    cursor: pointer;
                    padding: 0;
                    margin-bottom: 20px;
                }
            </style>`)

        html.push(`<div id="flScreen1" class="screen">${ object.render() }</div>`)
        html.push(`
            <div id="flScreen2" class="screen hidden">
                <button type="button" class="btn-close ripple-surface back-button" id="flScreen2BackButton" aria-label="Close"></button>
                <div id="flScreen2Header" class="mb-3">
                    <h4 id="flScreen2Title"></h4>
                    <p id="flScreen2Description" class="text-muted"></p>
                    <hr>
                </div>
                <div id="flScreen2Content"></div>
            </div>`)
        html.push(this.modal.render())
        return html.join("\n")
    }

    trigger = (object) =>
    {
        object.trigger()
        this.modal.trigger()
    }

    stack = async (object, { title, description }) =>
    {
        console.log("in stack")
        await object.initialize()
        const content = object.render()

        // Update screen 2 title and description
        document.getElementById("flScreen2Title").textContent = title
        document.getElementById("flScreen2Description").textContent = description
        document.getElementById("flScreen2Header").style.display = (title || description) ? "block" : "none"

        // Hide screen 1 et show screen 2
        document.getElementById("flScreen2Content").innerHTML = content
        document.getElementById("flScreen1").classList.add("hidden")
        document.getElementById("flScreen1").classList.remove("visible")
        document.getElementById("flScreen2").classList.add("visible")
        document.getElementById("flScreen2").classList.remove("hidden")
        this.trigger(object)

        // Update URL et history
        // history.pushState({ screen: "detail" }, "", this.url)

        document.getElementById("flScreen2BackButton").onclick = () => {
            this.unstack()
        }

        // window.addEventListener("popstate", (event) => {
        //     if (event.state) {
        //         if (event.state.screen === "detail") {
        //             this.stack(object)
        //         } else {
        //             this.unstack()
        //         }
        //     } else {
        //         this.stack(object)
        //     }
        // })

    }

    unstack = () => {
        console.log("in unstack")
        document.getElementById("flScreen2").classList.add("hidden")
        document.getElementById("flScreen2").classList.remove("visible")
        document.getElementById("flScreen1").classList.add("visible")
        document.getElementById("flScreen1").classList.remove("hidden")

        history.pushState({ screen: "index" }, "", this.url)
    }

    nextScreenIndex = () => {
        this.screenIndex++
        return this.screenIndex
    }

    showModal = async (object, title) =>
    {
        console.log("in showModal")
        await object.initialize()
        const content = object.render()
        $("#flModalTabs").html(content)
        $("#flModalForm").hide()
        $("#flModalToggleLabel1").html(title)
        this.trigger(object)
        const element = document.getElementById("flModalToggle1")
        const modal = mdb.Modal.getOrCreateInstance(element)
        modal.show()
    }

    // hideModal = () => {
    //     console.log("in hideModal")
    //     const element = document.getElementById("flModalToggle1")
    //     mdb.Modal.getInstance(element).toggle()
    // }
}
