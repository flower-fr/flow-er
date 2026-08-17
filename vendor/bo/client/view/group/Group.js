import View from "../View.js"
import GroupTag from "./GroupTag.js"
import Toast from "../toast/Toast.js"

import exportXlsx from "../../utils/exportXlsx.js"

export default class Group extends View
{
    constructor({ controller, entity, view, layout, locale })
    {
        super({ controller })
        this.entity = entity
        this.view = view
        this.layout = layout
        this.locale = locale
        this.checkedRows = []
    }

    initialize = async () =>
    {
        let response = await fetch(`/bo/group/${ this.entity }?view=${ this.view }`)
        const { tabs, properties, translations } = await response.json()
        this.tabs = tabs
        this.properties = properties
        this.translations = translations

        response = await fetch(`/bo/search/${ this.entity }?view=${ this.view }`)
        const { tags } = await response.json()
        this.tags = tags.map(tag => new GroupTag({ controller: this.controller, name: tag.distinct_name }))
    }

    render = () =>
    {
        const { translations } = this
        const html = []
        html.push(`
            <div class="card mb-3" id="flGroup">
                <div class="card-header text-center">
                    <h5>${ translations.groupedActions }</h5>
                    <div>
                        <strong>
                            <span class="fl-group-count"></span>
                            <span class="fl-group-sum"></span>
                        </strong>
                    </div>
                </div>
                <div class="card-body">`)

        for (let [tabId, tab] of Object.entries(this.tabs ?? {})) {
            const action = tab.post ?? tab.clientAction

            html.push(`
                        <form data-tab-id="${ tabId }">`)

            for (const propertyId of (tab.properties) ? tab.properties : []) {
                const property = this.properties[propertyId]
                if (["select", "vector"].includes(property.type)) {
                    html.push(`
                            <div class="form-outline mb-3" id="flGroupOutline-${tabId}-${propertyId}">
                                <select class="form-select form-select-sm fl-modal-form-select" id="flGroup-${tabId}-${propertyId}" data-mdb-size="sm">
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
                            <div class="form-outline mb-3" id="flGroupTextOutline-${ tabId }-${ propertyId }" data-mdb-input-init>
                                <textarea id="flGroupText-${ tabId }-${ propertyId }" class="form-control" rows="4"></textarea>
                                    <label class="form-label">${ this.translations["Text"] }</label>
                            </div>`) 
                    }

                } else if (property.type === "date") {
                    html.push(`
                            <div class="form-outline mb-3" id="flGroupOutline-${ tabId }-${ propertyId }" data-mdb-datepicker-init data-mdb-input-init>
                                <input class="form-control form-control-sm" id="flGroup-${ tabId }-${ propertyId }" />
                                <label class="form-label select-label">${property.label}</label>
                            </div>`)

                } else if (["time", "duration"].includes(property.type)) {
                    html.push(`
                            <div class="form-outline mb-3" id="flGroupOutline-${ tabId }-${propertyId}" data-mdb-timepicker-init data-mdb-input-init>
                                <input class="form-control form-control-sm" id="flGroup-${ tabId }-${propertyId}" />
                                <label class="form-label select-label">${property.label}</label>
                            </div>`)

                } else {
                    html.push(`
                            <div class="form-outline mb-3" id="flGroupOutline-${ tabId }-${ propertyId }" data-mdb-input-init>
                                <input class="form-control form-control-sm fl-modal-form-input" id="flGroup-${ tabId }-${ propertyId }" />
                                <label class="form-label select-label">${property.label}</label>
                            </div>`)
                }
            }

            html.push(`
                            <div class="form-outline mb-3">
                                <button class="btn btn-sm ${ (action.class === "danger") ? "btn-danger" : "btn-warning" }">${ action.label } <span class="fl-group-btn-count" id="flGroupBtnCount-${ tabId }"></span></button>
                            </div>
                        </form>
                        <hr>`)
        }

        html.push(`
                    <div class="input-group mb-3" id="flGroupOutline-tag">
                        <input
                            type="text"
                            class="form-control rounded"
                            id="flGroup-tag"
                            placeholder="Créer un #tag"
                            aria-label="Créer un #tag"
                        />
                        <button class="btn btn-warning" type="button" id="flGroupTagPlus" data-mdb-ripple-init>
                            <i class="fas fa-plus"></i>                        
                        </button>
                    </div>`)

        for (const tag of this.tags) html.push(tag.render())

        html.push(`
                </div>
            </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        for (let [tabId, tab] of Object.entries(this.tabs ?? {})) {
            for (const propertyId of (tab.properties) ? tab.properties : []) {
                const property = this.properties[propertyId]
                if (["select", "vector"].includes(property.type)) {
                    const el = document.getElementById(`flGroup-${ tabId }-${ propertyId }`)
                    new mdb.Select(el)
                    if (property.text) {
                        new mdb.Input(document.getElementById(`flGroupTextOutline-${ tabId }-${ propertyId }`)).init()
                        el.addEventListener("change", () => {
                            const modalityId = el.value
                            document.getElementById(`flGroupText-${ tabId }-${ propertyId }`).innerHTML = property.rows[modalityId][property.text]
                            new mdb.Input(document.getElementById(`flGroupTextOutline-${ tabId }-${ propertyId }`)).init()
                        })
                    }
                } else if (property.type == "date") {
                    const el = document.getElementById(`flGroupOutline-${ tabId }-${ propertyId }`)
                    
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
                    const el = document.getElementById(`flGroupOutline-${ tabId }-${ propertyId }`)
                    new mdb.Timepicker(el,{ format24: true, increment: true }) 
                } else {
                    const el = document.getElementById(`flGroupOutline-${ tabId }-${ propertyId }`)
                    new mdb.Input(el)
                }
            }
        }

        // Handle click on submit
        document.querySelectorAll("#flGroup form").forEach(form => {
            form.addEventListener("submit", event => {
                event.preventDefault()
                const tab = this.tabs[form.dataset.tabId]

                if (tab.clientAction) return this.clientActionHandler(tab)
            })
        })
    }

    eventRowChecked = (summable, checkedRows) =>
    {
        this.checkedRows = checkedRows
        const checked = checkedRows.length, sumChecked = (summable) ? checkedRows.reduce((accumulator, current) => accumulator + parseFloat(current[summable.propertyId]), 0) : 0
        if (checked > 0) {
            const sumLabel = (sumChecked) ? `${ new Intl.NumberFormat("fr-FR", summable.format ? summable.format : {}).format(sumChecked) }${ summable.unit ? ` ${ summable.unit }` : "" }` : ""
            $(".fl-group-count").text(checked ? checked : "")
            for (const [tabId, tab] of Object.entries(this.tabs ?? {})) {
                const match = (row) => {
                    if (!tab.restriction) return true
                    return !Object.entries(tab.restriction).find(([property, value]) => {
                        return row[property] !== value
                    })
                }
                const kept = checkedRows.reduce((acc, cur) => match(cur) ? acc+1 : acc, 0)
                $(`#flGroupBtnCount-${ tabId }`).text(kept ? `(${ kept })` : "")
            }
            if (sumChecked) $(".fl-group-sum").text(`(${ sumLabel })`)
        } else {
            $(".fl-group-count").text("")
            $(".fl-group-btn-count").text("")
            $(".fl-group-sum").text("")
        }
    }

    clientActionHandler = (tab) => {
        if (tab.clientAction.type === "export") return this.runExport(tab)
    }

    runExport = async (tab) => {
        let response = await fetch(`/bo/export/${ this.entity }?view=${ tab.clientAction.view }`)
        const config = await response.json()
        
        const rows = this.getMatchingRows(tab)
        if (rows.length === 0)
            return (new Toast({ controller: this.controller }, { title: config.translations["Excel export"], message: config.translations["No rows to export"], type: "warning" })).trigger()
        
        const resolvedToken = config.params.fileName?.params?.[0] === "today" ? new Date().toISOString().split("T")[0] : ""
        const fileName = config.params.fileName.template.replace("%s", resolvedToken)
        await exportXlsx(fileName, config, rows)
    }
    
    getMatchingRows = (tab) => {
        const match = row => !tab.restriction || !Object.entries(tab.restriction).find(([key, value]) => row[key] !== value)
        return (this.checkedRows ?? []).filter(match)
    }
}
