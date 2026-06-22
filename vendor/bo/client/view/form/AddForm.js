import View from "../View.js"

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
        const { properties, translations } = await response.json()
        this.properties = properties
        this.translations = translations
    }

    render = () =>
    {
        const html = []
        html.push(`
            <div class="card" id="flAdd">
                <div class="card-body">
                    <form>`)

        for (let [propertyId, property] of Object.entries(this.properties)) {
            if (property.type === "select") {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}">
                            <select class="form-select form-select-sm fl-modal-form-select" id="flAdd-${propertyId}" data-mdb-size="sm">
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
                            <input class="form-control form-control-sm fl-modal-form-input" id="flAdd-${propertyId}" />
                            <label class="form-label select-label">${property.label}</label>
                        </div>`)
            } else {
                html.push(`
                        <div class="form-outline mb-3" id="flAddOutline-${propertyId}" data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flAdd-${propertyId}" />
                            <label class="form-label select-label">${property.label}</label>
                        </div>`)
            }
        }

        html.push(`
                    <div class="form-outline mb-3">
                            <button class="btn btn-warning">Ajouter <span class="fl-list-count"></span></button>
                        </div>
                    </form>
                </div>
            </div>`)

        return html.join("\n")
    }

    trigger = async () =>
    {
        for (const [propertyId, property] of Object.entries(this.properties)) {
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
    }
}
