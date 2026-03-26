import View from "../View.js"

export default class SearchFilter extends View
{
    constructor({ controller, entity, view, propertyId, property, params, translations })
    {
        super({ controller })
        this.entity = entity
        this.view = view
        this.propertyId = propertyId
        this.property = property
        this.params = params
        this.translations = translations
    }

    initialize = async () => {}

    render = () =>
    {
        const propertyId = this.propertyId, property = this.property, params = this.params
        const html = []
        const propertyType = property.type

        let input
        
        if (["date", "time", "datetime"].includes(propertyType)) {
            input = renderFilterDateTime(propertyId, property, params)
        }

        else if (["number"].includes(propertyType)) {
            input = renderFilterNumber(propertyId, property, params)
        }

        else if (["select", "vector"].includes(propertyType)) {
            input = renderFilterSelect(propertyId, property, params)
        }

        else {
            input = renderFilterInput(propertyId, property, params)
        }

        html.push(`<div class="col-md-12">${input}</div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const datePickerOptions = {
            datepicker: { 
                format: this.translations.mdbDateFormat
            },
            inline: true,
            monthsFull: this.translations.mdbMonthsFull,
            weekdaysNarrow: this.translations.mdbWeekdaysNarrow,
        }
        if (["date", "time", "datetime"].includes(this.property.type)) {
            const min = document.getElementById(`flSearchFormOutlineMin-${ this.propertyId }`)
            new mdb.Datepicker(min, datePickerOptions)
            const max = document.getElementById(`flSearchFormOutlineMax-${ this.propertyId }`)
            new mdb.Datepicker(max, datePickerOptions)
        } else if (["number"].includes(this.property.type)) {
            const min = document.getElementById(`flSearchFormOutlineMin-${ this.propertyId }`)
            new mdb.Input(min)
            const max = document.getElementById(`flSearchFormOutlineMax-${ this.propertyId }`)
            new mdb.Input(max)
        } else if (["select", "vector"].includes(this.property.type)) {
            const outline = document.getElementById(`flSearch-${ this.propertyId }`)
            new mdb.Select(outline)
        } else {
            const outline = document.getElementById(`flSearchFormOutline-${ this.propertyId }`)
            new mdb.Input(outline)
        }
    }
}

const renderFilterDateTime = (propertyId, property, params) => 
{
    let valueMin, valueMax
    if (params.where && params.where[propertyId]) {
        const where = params.where[propertyId].split(",")
        if (where[0] == "between") {
            valueMin = moment(where[1]).format("DD/MM/YYYY")
            valueMax = moment(where[2]).format("DD/MM/YYYY")
        }
    }

    return `
        <div class="form-outline mb-1" id="flSearchFormOutlineMin-${propertyId}" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
            <input type="text" class="form-control form-control-sm" id="flSearchMin-${propertyId}" ${ (valueMin) ? `value="${ valueMin }"` : "" } />
            <label for="flSearchMin-${propertyId}" class="form-label">${ property.label } - Min</label>
        </div>
        <div class="form-outline mb-3" id="flSearchFormOutlineMax-${propertyId}" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
            <input type="text" class="form-control form-control-sm" id="flSearchMax-${propertyId}" ${ (valueMax) ? `value="${ valueMax }"` : "" } />
            <label for="searchMax-${propertyId}" class="form-label">Max</label>
        </div>`
}

const renderFilterSelect = (propertyId, property, { where }) => 
{
    const renderModalities = () => 
    {
        let options = []
        for (const [modalityId, modality] of Object.entries(property.modalities)) {
            let selected = false
            if (Object.keys(where).length > 0 && Object.keys(where).includes(propertyId)) {
                const checked = where[propertyId].split(",")
                if (checked.includes(modalityId)) selected = true
            }
            if (!modality.archive) {
                options.push(`<option value="${modalityId}" ${ (selected) ? "selected" : "" } id="search-${propertyId}-${modalityId}">${ modality.label }</option>`)
            }
        }
        return options.join("\n")
    }

    return `
        <div class="mb-3">
            <select class="form-select" data-mdb-size="sm" data-mdb-select-init="" id="flSearch-${propertyId}" multiple>
                ${renderModalities()}
            </select>
            <label class="form-label select-label">${ property.label }</label>
        </div>`
}

const renderFilterNumber = (propertyId, property, params) => 
{
    let valueMin, valueMax
    if (params.where && params.where[propertyId]) {
        const where = params.where[propertyId].split(",")
        if (where[0] == "between") {
            valueMin = where[1]
            valueMax = where[2]
        }
    }

    return `
        <div class="input-group input-group-sm mb-3">
            <div class="form-outline" id="flSearchFormOutlineMin-<${propertyId}" data-mdb-input-init>
                <input type="number" class="form-control form-control-sm" id="flSearchMin-<${propertyId}" ${ (valueMin) ? `value="${ valueMin }"` : "" } />
                <label class="form-label" for="flSearchMin-<${propertyId}">Min</label>
            </div>
            <div class="form-outline" id="flSearchFormOutlineMax-<${propertyId}" data-mdb-input-init>
                <input type="number" class="form-control form-control-sm" id="flSearchMax-<${propertyId}" ${ (valueMax) ? `value="${ valueMax }"` : "" } />
                <label class="form-label" for="flSearchMax-<${propertyId}">Max</label>
            </div>
        </div>`
}

const renderFilterInput = (propertyId, property) => 
{
    return `
        <div class="form-outline mb-3" id="flSearchFormOutline-${propertyId}" data-mdb-input-init>
            <input type="text" class="form-control form-control-sm" data-property-id="${propertyId}" id="flSearch-${propertyId}" />
            <label class="form-label" for="search-${propertyId}">${ property.label }</label>
        </div>`
}
