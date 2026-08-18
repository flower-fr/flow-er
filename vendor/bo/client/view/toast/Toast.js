import View from "../View.js"
import ToastForm from "./ToastForm.js"

export default class Toast extends View
{
    static #counter = 0

    /**
     * @param {Object} controller
     * @param {Object} options
     * @param {string} options.title - Toast header text.
     * @param {string} options.message - Toast body text.
     * @param {string} [options.type='info'] - Visual variant (success, danger, warning, info).
     * @param {number} [options.delay=3000] - Autohide delay in ms.
     * @param {boolean} [options.persistent=false] - If true, toast only closes on manual dismiss.
     * @param {Function} [options.onClose=null] - Callback function to execute when the toast is manually closed.
     */
    constructor({ controller, entity, view, properties, template, action, translations }, { title, message, type = "info", delay = 3000, persistent = false, onClose = null }) {
        super({ controller })
        this.entity = entity
        this.view = view
        this.template = template
        this.action = action
        this.title = title
        this.message = message
        this.type = type
        this.delay = delay
        this.persistent = persistent
        this.onClose = onClose
        this.id = `toast-${Toast.#counter++}`

        if (this.action) this.toastForm = new ToastForm({ controller, entity, view, properties, action, translations })
    }

    initialize = async () => {}

    render = () => {
        const html = []

        html.push(`
            <div 
                class="toast fade"
                id="${this.id}"
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                data-mdb-color="${this.type}"
                data-mdb-autohide="${!this.persistent}"
                data-mdb-delay="${this.delay}"
                data-mdb-position="top-right"
                data-mdb-append-to-body="true"
                data-mdb-stacking="true"
            >
                <div class="toast-header">
                    <strong class="me-auto">${this.title}</strong>
                    <button type="button" class="btn-close" data-mdb-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    <div id="toastBodyContent">
                        ${this.message}
                        <hr>`)

        if (this.toastForm) html.push(this.toastForm.render())

        html.push(`
                    </div>
                    ${ (this.action?.post.confirmMessage) ? `<div id="toastBodyConfirm">${ this.action.post.confirmMessage.join("<br>") }</div>` : "" }

                </div>
            </div>`)

        return html.join("\n")
    }

    trigger = () => {
        // Attach the toast to the body
        const wrapper = document.createElement("div")
        wrapper.innerHTML = this.render()
        const toastEl = wrapper.firstElementChild
        document.body.appendChild(toastEl)

        // Show the toast
        let instance = mdb.Toast.getOrCreateInstance(toastEl)
        instance.show()

        // Remove the toast element from the DOM after it is hidden
        toastEl.addEventListener("hidden.mdb.toast", () => {
            if (typeof this.onClose === "function") {
                this.onClose()
            }
            toastEl.remove()
        }, { once: true })

        if (this.toastForm) this.toastForm.trigger()
    }
}