import View from "../View.js"
import ToastForm from "./ToastForm.js"
import Layout from "../layout/Layout.js"

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
     * @param {Function} [options.onValidate=null] - Callback function to execute when the toast is validated.
     */
    constructor({ controller, entity, view, properties, template, action, stack, layout, translations }, { title, message, type = "info", delay = 3000, persistent = false, onValidate = null }) {
        super({ controller })
        this.entity = entity
        this.view = view
        this.stack = stack
        this.layout = layout
        this.template = template
        this.action = action
        this.title = title
        this.message = message
        this.type = type
        this.delay = delay
        this.persistent = persistent
        this.onValidate = onValidate
        this.id = `toast-${Toast.#counter++}`

        if (this.action) this.toastForm = new ToastForm({ controller, entity, view, properties, action, translations })
    }

    initialize = async () => {}

    render = () => {
        const html = []

        html.push(`
            <div 
                class="toast fade"
                id="toast-${this.id}"
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

        if (this.stack) {
            html.push(`
                <button type="button" class="btn btn-sm btn-primary" id="${ this.id }-stack-button">
                    ${ this.stack.buttonLabel ?? "" }
                </button>
            `)
        }

        if (this.onValidate) {
            html.push(`
                <button type="button" class="btn btn-sm btn-success" id="${ this.id }-validate-button">
                    ${ this.validateButtonLabel ?? "Validate" }
                </button>
            `)
        }

        html.push(`
                    </div>
                    ${ (this.action?.post.confirmMessage) ? `<div id="toastBodyConfirm">${ this.action.post.confirmMessage.join("<br>") }</div>` : "" }

                </div>
            </div>`)

        return html.join("\n")
    }

    trigger = () => {
        const { controller, layout } = this
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
            // if (typeof this.onClose === "function") {
            //     this.onClose()
            // }
            toastEl.remove()
        }, { once: true })

        // Trigger the toast form if it exists
        if (this.toastForm) this.toastForm.trigger()

        // Handle stack button click if stack is defined
        if (this.stack) {
            document.getElementById(`${ this.id }-stack-button`).onclick = () => {
                const stackLayout = new Layout({
                    controller,
                    application: layout.application,
                    tab: layout.tab,
                    entity: this.stack.entity,
                    view: this.stack.view,
                    locale: layout.locale,
                    theme: layout.theme,
                    profile_id: layout.profile_id,
                    stackView: true,
                })
                this.controller.stack(stackLayout, { title: this.stack.title, description: this.stack.description })
            }
        }

        if (this.onValidate) {
            document.getElementById(`${ this.id }-validate-button`).onclick = () => {
                this.onValidate()
                instance.hide()
            }
        }
    }
}