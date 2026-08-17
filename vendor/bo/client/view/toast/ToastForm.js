import View from "../View.js"

export default class ToastForm extends View
{
    constructor({ controller, entity, view, properties, action, translations })
    {
        super({ controller })
        this.entity = entity
        this.view = view
        this.properties = properties
        this.action = action
        this.translations = translations
        this.checkedRows = []
    }

    initialize = async () => {}

    render = () =>
    {
        const { translations, action, properties } = this
        const html = []

        html.push(`
            <form>`)

        for (const propertyId of action.properties) {
            const property = properties[propertyId]
            if (["select", "vector"].includes(property.type)) {
                html.push(`
                            <div class="form-outline mb-3" id="flToastFormOutline-${propertyId}">
                                <select class="form-select form-select-sm fl-modal-form-select" id="flToastForm-${propertyId}" data-mdb-size="sm">
                                    <option />`)

                for (let [modalityId, modality] of Object.entries(property.modalities)) {
                    html.push(`<option value="${modalityId}" ${ modality.archive ? "disabled" : "" }>${modality.label}</option>`)
                }

                html.push(`
                                </select>
                                <label class="form-label select-label">${property.label}</label>
                            </div>`)
                    
                if (property.text) {
                    html.push(`
                            <div class="form-outline mb-3" id="flToastFormTextOutline-${ propertyId }" data-mdb-input-init>
                                <textarea id="flToastFormText-${ propertyId }" class="form-control" rows="4"></textarea>
                                    <label class="form-label">${ this.translations["Text"] }</label>
                            </div>`) 
                }

            } else if (property.type === "date") {
                html.push(`
                            <div class="form-outline mb-3" id="flToastFormOutline-${ propertyId }" data-mdb-datepicker-init data-mdb-input-init>
                                <input class="form-control form-control-sm" id="flToastForm-${ propertyId }" />
                                <label class="form-label select-label">${property.label}</label>
                            </div>`)

            } else if (["time", "duration"].includes(property.type)) {
                html.push(`
                            <div class="form-outline mb-3" id="flToastFormOutline-${propertyId}" data-mdb-timepicker-init data-mdb-input-init>
                                <input class="form-control form-control-sm" id="flToastForm-${propertyId}" />
                                <label class="form-label select-label">${property.label}</label>
                            </div>`)

            } else {
                html.push(`
                            <div class="form-outline mb-3" id="flToastFormOutline-${ propertyId }" data-mdb-input-init>
                                <input class="form-control form-control-sm" id="flToastForm-${ propertyId }" />
                                <label class="form-label" for="flToastForm-${propertyId}">${property.label}</label>
                            </div>`)
            }
        }

        html.push(`
                            <div class="form-outline mb-3">
                                <button class="btn btn-sm ${ (action.class === "danger") ? "btn-danger" : "btn-warning" }">${ action.post.label } <span class="fl-group-btn-count" id="flToastFormBtnCount"></span></button>
                            </div>
                        </form>
                        <hr>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const { action, properties } = this
        for (const propertyId of action.properties) {
            const property = properties[propertyId]
            if (["select", "vector"].includes(property.type)) {
                const el = document.getElementById(`flToastForm-${ propertyId }`)
                new mdb.Select(el)
                if (property.text) {
                    new mdb.Input(document.getElementById(`flToastFormTextOutline-${ propertyId }`)).init()
                    el.addEventListener("change", () => {
                        const modalityId = el.value
                        document.getElementById(`flToastFormText-${ propertyId }`).innerHTML = property.rows[modalityId][property.text]
                        new mdb.Input(document.getElementById(`flToastFormTextOutline-${ propertyId }`)).init()
                    })
                }

            } else if (property.type === "autocomplete") {
                const data = Object.values(property.modalities).map(x => x.label)
                const el = document.getElementById(`flToastFormOutline-${ propertyId }`)
                const dataFilter = (value) => {
                    return data.filter((item) => {
                        return item.toLowerCase().includes(value.toLowerCase())
                    })
                }
                new mdb.Autocomplete(el, {
                    filter: dataFilter,
                    noResults: property.noResults,
                })

            } else if (property.type == "date") {
                const el = document.getElementById(`flToastFormOutline-${ propertyId }`)
                    
                const datePickerOptions = {
                    inline: true,
                }
                if (property.mdb) {
                    datePickerOptions.datepicker = { 
                        format: property.mdb.dateFormat
                    }
                    datePickerOptions.monthsFull = property.mdb.monthsFull,
                    datePickerOptions.weekdaysNarrow = property.mdb.weekdaysNarrow
                }
                new mdb.Datepicker(el, datePickerOptions)

            } else if (["time", "duration"].includes(property.type)) {
                const el = document.getElementById(`flToastFormOutline-${ propertyId }`)
                new mdb.Timepicker(el,{ format24: true, increment: true }) 
            } else {
                const el = document.getElementById(`flToastFormOutline-${ propertyId }`)
                new mdb.Input(el)
            }
        }

        // Handle click on submit
        document.querySelectorAll("#flToastForm form").forEach(form => {
            form.addEventListener("submit", event => {
                event.preventDefault()
            })
        })
    }
}
