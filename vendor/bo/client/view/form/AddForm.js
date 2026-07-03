import View from "../View.js"
import Toast from "../toast/Toast.js"

export default class AddForm extends View
{
    constructor({ controller, entity, view, layout })
    {
        super({ controller })
        this.entity = entity
        this.view = view
        this.layout = layout
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/add/${ this.entity }?view=${ this.view }`)
        const { properties, posts, translations } = await response.json()
        this.properties = properties
        this.posts = posts
        this.translations = translations
    }

    render = () =>
    {
        const html = []
        html.push(`
            <div class="card" id="flAdd">
                <div class="card-body">
                    <form id="flAddForm">`)

        for (let [propertyId, property] of Object.entries(this.properties)) {
            if (property.type === "select") {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}">
                            <select class="form-select form-select-sm fl-modal-form-select" id="flAdd-${propertyId}" data-mdb-size="sm" ${ property.required ? "required" : "" } >
                                <option />`)

                for (let [modalityId, modality] of Object.entries(property.modalities)) {
                    html.push(`<option value="${modalityId}" ${ modality.archive ? "disabled" : "" }>${modality.label}</option>`)
                }

                html.push(`
                            </select>
                            <label class="form-label select-label">${property.label}</label>
                        </div>`)
            } else if (property.type === "date") {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}" data-mdb-datepicker-init data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flAdd-${propertyId}" ${ property.required ? "required" : "" } />
                            <label class="form-label select-label">${property.label}</label>
                        </div>`)
            } else if (property.type === "email"){
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}" data-mdb-input-init>
                            <input type="email" class="form-control form-control-sm fl-modal-form-input" id="flAdd-${propertyId}" ${ property.required ? "required" : "" } />
                            <label class="form-label select-label">${property.label}</label>
                        </div>`)
            } else {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}" data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flAdd-${propertyId}" ${ property.required ? "required" : "" } />
                            <label class="form-label select-label">${property.label}</label>
                        </div>`)
            }
        }

        for (const [postId, post] of Object.entries(this.posts)) {
            html.push(`
                <div class="form-outline mb-3">
                    <button 
                        name="flAdd-${postId}" 
                        class="btn btn-warning flAdd-tab-submit"
                        data-mdb-ripple-init
                        data-mdb-ripple-color="danger"
                        ${ (post.method) ? `data-fl-method="${post.method}"`: "" }
                        data-fl-controller="${post.controller}"
                        data-fl-action="${post.action}"
                        data-fl-entity="${post.entity}"
                        data-fl-transaction="${postId}">
                            ${post.label}
                    </button>
                </div>`)
        }

        html.push(`
                    </form>
                </div>
            </div>`)

        return html.join("\n")
    }

    trigger = async () =>
    {
        const {properties, posts, translations, controller, layout} = this
        const form = document.getElementById("flAddForm")

        // Initialize MDB components for each property
        for (const [propertyId, property] of Object.entries(properties)) {
            if (property.type === "select") {
                const el = document.getElementById(`flAdd-${ propertyId }`)
                new mdb.Select(el)
            } else if (property.type == "date") {
                const el = document.getElementById(`flAddOutline-${ propertyId }`)
                new mdb.Datepicker(el,{ inline: true })
            } else {
                const el = document.getElementById(`flAddOutline-${ propertyId }`)
                new mdb.Input(el)
            }
        }

        // Handle form submission
        form?.addEventListener("submit", async (event) => {
            event.preventDefault()

            if (!form.checkValidity()) {
                form.classList.add("was-validated")
                return
            }

            // Build the request body
            const body = { status: "new" }
            for (const [propertyId, property] of Object.entries(properties)) {
                const input = document.getElementById(`flAdd-${ propertyId }`)
                if (property.type === "date") {
                    const val = input.value
                    body[propertyId] = val ? val.substring(6, 10) + "-" + val.substring(3, 5) + "-" + val.substring(0, 2) : ""
                } else {
                    body[propertyId] = input.value
                }
            }

            // Submit the form data
            const submit = event.submitter, postId = submit.name.split("-").slice(1).join("-"), post = posts[postId]
            const response = await fetch(`/${ post.controller }/${ post.action }/${ post.entity }`, {
                method: post.method,
                headers: new Headers({"content-type": "application/json"}),
                body: JSON.stringify([body]),
            })

            // Handle the response
            if (response.ok) {
                layout.refreshList({})
                form.reset()
                const toast = new Toast({ controller: controller }, {
                    title: translations["Success"],
                    message: translations["Request registered"],
                    type: "success" })
                toast.trigger()
            } else {
                console.error("AddForm submit error:", response.status, response.statusText)
                const toast = new Toast({ controller: controller }, {
                    title: translations["Error"],
                    message: translations["Technical error, Please try again later"],
                    type: "danger",
                    persistent: true })
                toast.trigger()
            }
        })
    }
}
