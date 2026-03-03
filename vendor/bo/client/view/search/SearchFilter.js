import View from "../View.js"

export default class SearchFilter extends View
{
    constructor({ controller, entity, view, propertyId, property, data })
    {
        super({ controller })
        this.entity = entity
        this.view = view
        this.propertyId = propertyId
        this.property = property
        this.data = data
    }

    initialize = async () =>
    {
        const response = await fetch(`/bo/search/${ this.entity }/${ this.view }`)
        const { translations } = await response.json()
        this.translations = translations
    }

    render = () =>
    {
        const propertyId = this.propertyId, property = this.property, data = this.data
        const html = []
        const propertyType = property.type

        let input
        
        if (["date", "time", "datetime"].includes(propertyType)) {
            input = renderFilterDateTime(propertyId, property, data)
        }

        else if (["number"].includes(propertyType)) {
            input = renderFilterNumber(propertyId, property)
        }

        else if (["select", "multiselect"].includes(propertyType)) {
            input = renderFilterSelect(propertyId, property, data)
        }

        else {
            input = renderFilterInput(propertyId, property, data)
        }

        html.push(`<div class="col-md-12">${input}</div>`)

        return html.join("\n")
    }

    trigger = () => {
    }
}

const renderFilterDateTime = (propertyId, property, data) => 
{
    let valueMin, valueMax
    if (data.where && data.where[propertyId]) {
        const where = data.where[propertyId].split(",")
        if (where[0] == "between") {
            valueMin = moment(where[1]).format("DD/MM/YYYY")
            valueMax = moment(where[2]).format("DD/MM/YYYY")
        }
    }

    return `
    <div class="form-floating form-outline mb-1" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
        <input type="text" class="form-control form-control-sm" id="flSearchMin-${propertyId}" ${ (valueMin) ? `value="${ valueMin }"` : "" } />
        <label for="flSearchMin-${propertyId}" class="form-label">${ property.label } - Min</label>
    </div>
    <div class="form-floating form-outline mb-3" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
        <input type="text" class="form-control form-control-sm" id="flSearchMax-${propertyId}" ${ (valueMax) ? `value="${ valueMax }"` : "" } />
        <label for="searchMax-${propertyId}" class="form-label">Max</label>
    </div>`
}

const renderFilterSelect = (propertyId, property, { where }) => 
{
    const renderModalities = () => 
    {
        let options = []
        for (const modalityId of Object.keys(property.modalities)) {
            const modality = property.modalities[modalityId]
            let selected = false
            if (Object.keys(where).length > 0 && Object.keys(where).includes(propertyId)) {
                const checked = where[propertyId].split(",")
                if (checked.includes(modalityId)) selected = true
            }
            if (!modality.archive) {
                options.push(`<option value="${modalityId}" ${ (selected) ? "selected" : "" } id="search-${propertyId}-${modalityId}">${ modality }</option>`)
            }
        }
        return options.join("\n")
    }

    return `
    <div class="form-floating mb-3">
        <select class="form-select" data-mdb-size="sm" data-mdb-select-init="" id="flSearch-${propertyId}" multiple>
            ${renderModalities()}
        </select>
        <label class="form-label select-label">${ property.labels }</label>
    </div>`
}

const renderFilterNumber = (propertyId, property) => 
{
    return `
    <div class="input-group input-group-sm mb-3">
        <span class="input-group-text fs-6" id="addon-wrapping"><label class="form-label" style="margin-bottom: 0 !important">${ property.labels }</label></span>
        <div class="form-floating form-outline" data-mdb-input-init>
            <input type="number" value="0" id="min" min="0" class="form-control form-control-sm" id="flSearchMin-<${propertyId}"/>
            <label class="form-label" for="flSearchMin-<${propertyId}">Min</label>
        </div>
        <div class="form-floating form-outline" data-mdb-input-init>
            <input type="number" value="0" id="max" min="0" class="form-control form-control-sm" id="flSearchMax-<${propertyId}"/>
            <label class="form-label" for="flSearchMax-<${propertyId}">Max</label>
        </div>
    </div>`
}

const renderFilterInput = (propertyId, property) => 
{
    return `
        <div class="form-floating form-outline mb-3" data-mdb-input-init>
            <input type="text" class="form-control form-control-sm" data-property-id="${propertyId}" id="flSearch-${propertyId}" />
            <label class="form-label" for="search-${propertyId}">${ property.labels }</label>
        </div>`
}
