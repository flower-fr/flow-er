import View from "../View.js"
import GroupTag from "./GroupTag.js"

export default class Group extends View
{
    constructor({ controller, entity, view, layout, locale })
    {
        super({ controller })
        this.entity = entity
        this.view = view
        this.layout = layout
        this.locale = locale
    }

    initialize = async () =>
    {
        let response = await fetch(`/bo/group/${ this.entity }?view=${ this.view }`)
        const { properties, translations } = await response.json()
        this.properties = properties
        this.translations = translations

        response = await fetch(`/bo/search/${ this.entity }?view=${ this.view }&locale=${this.locale}`)
        const { tags } = await response.json()
        this.tags = tags.map(tag => new GroupTag({ controller: this.controller, name: tag.distinct_name }))
    }

    render = () =>
    {
        const html = []
        html.push(`
            <div class="card mb-3" id="flGroup">
                <div class="card-header text-center">
                    <h5>Actions groupées</h5>
                    <div>
                        <strong>
                            <span class="fl-list-count"></span>&nbsp;&nbsp;
                            <span class="fl-list-sum"></span>
                        </strong>
                    </div>
                </div>
                <div class="card-body">`)

        html.push(`
                    <form>`)

        for (let [propertyId, property] of Object.entries(this.properties)) {
            if (property.type === "select") {
                html.push(`
                        <div class="form-outline mb-3" id="flGroupOutline-${propertyId}">
                            <select class="form-select form-select-sm fl-modal-form-select" id="flGroup-${propertyId}" data-mdb-size="sm">
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
                        <div class="form-outline mb-3" id="flGroupOutline-${propertyId}" data-mdb-datepicker-init data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flGroup-${propertyId}" />
                            <label class="form-label select-label">${property.label}</label>
                        </div>`)
            } else {
                html.push(`
                        <div class="form-outline mb-3" id="flGroupOutline-${propertyId}" data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flGroup-${propertyId}" />
                            <label class="form-label select-label">${property.label}</label>
                        </div>`)
            }
        }

        html.push(`
                        <div class="form-outline mb-3">
                            <button class="btn btn-warning">Modifier <span class="fl-list-count"></span></button>
                        </div>
                    </form>
                    <hr>`)

        html.push(`
                    <div class="input-group mb-3" id="flGroupOutline-tag">
                        <input
                            type="text"
                            class="form-control rounded"
                            id="flGroup-tag"
                            placeholder="Créer un #tag"
                            aria-label="Créer un #tag"
                        />
                        <button class="btn btn-sm btn-warning" type="button" id="flGroupTagPlus" data-mdb-ripple-init>
                            <i class="fas fa-plus"></i>                        
                        </button>
                    </div>`)

        for (const tag of this.tags) html.push(tag.render())

        html.push(`
                    <hr>
                    <form>
                        <div class="form-outline mb-3">
                            <select class="form-select form-select-sm fl-modal-form-select" id="flGroup-template" data-mdb-size="sm">
                                <option />
                                <option value="1">Template 1</option>
                                <option value="2">Template 2</option>
                                <option value="3">Template 3</option>
                            </select>
                            <label class="form-label select-label">Template</label>
                        </div>
                        <div class="form-outline mb-3" id="flGroupOutline-text" data-mdb-input-init>
                            <textarea id="flGroup-text" class="form-control" rows="6">Bonjour { prenom }

Je me permets de vous contacter car j'ai vu que vous étiez en charge de { sujet } chez { entreprise }.

Chez Double Crème, nous aidons les entreprises du secteur de l'IT à vendre sans effort.

Seriez-vous disponible pour en discuter ? Je serais ravi de vous présenter comment nous pouvons vous aider à atteindre vos objectifs.

Cordialement,
{ mon_prenom }</textarea>
                                <label class="form-label">Message</label>
                        </div>
                        <div class="form-outline">
                            <button class="btn btn-warning">Envoyer un mail</button>
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
                const el = document.getElementById(`flGroup-${ propertyId }`)
                new mdb.Select(el)
            } else if (property.type == "date") {
                const el = document.getElementById(`flGroupOutline-${ propertyId }`)
                new mdb.Datepicker(el,{ inline: true })
            } else {
                const el = document.getElementById(`flGroupOutline-${ propertyId }`)
                new mdb.Input(el)
            }
        }

        for (const [propertyId, property] of Object.entries({ template: { type: "select" }, text: { type: "textarea" }})) {
            if (property.type === "select") {
                const el = document.getElementById(`flGroup-${ propertyId }`)
                new mdb.Select(el)
            } else if (property.type == "date") {
                const el = document.getElementById(`flGroupOutline-${ propertyId }`)
                new mdb.Datepicker(el,{ inline: true })
            } else {
                const el = document.getElementById(`flGroupOutline-${ propertyId }`)
                new mdb.Input(el)
            }
        }
    }
}
