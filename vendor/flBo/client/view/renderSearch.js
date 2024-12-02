const renderSearch = ({ context, entity, view }, data) => {
    
    const properties = data.properties
    const html = []
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        const options = (property.options) ? property.options : []
        if (options.change) {
            html.push(`<input type="hidden" class="fl-search-change" data-property-id="${propertyId}" value="mdb/search/${entity}?view=${view}" />`)
        }
    }

    return `${html.join("\n")}
    <ul class="sidenav-menu">
        <li class="sidenav-item">
            <div class="container">
                <form class="form-inline">
                    <div class="row mt-3">

                        ${renderFilters(context, entity, view, properties, data)}
            
                        <div class="col-md-12">    
                            <div class="input-group mb-2 text-center">
                                <button type="button" class="btn btn-outline-primary fl-search-refresh" title="${ context.translate("Refresh the list") }">
                                    <i class="fa fa-sync-alt"></i>
                                </button>
                                <button type="button" class="btn btn-outline-primary fl-search-erase" title="${ context.translate("Erase") }">
                                    <i class="fa fa-times"></i>
                                </button>                
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </li>
    </ul>`
}

const renderFilters = (context, entity, view, properties, data) => {
    let filters = []
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        const options = (property.options) ? property.options : []
        const propertyType = (options.type) ? options.type : property.type

        let input
        
        if (["date", "time", "datetime"].includes(propertyType)) {
            input = renderFilterDateTime(context, propertyId, property)
        }

        else if (["age"].includes(propertyType)) {
            input = renderFilterAge(context, propertyId, property)
        }

        else if (["select", "multiselect", "source", "tags"].includes(propertyType)) {
            input = renderFilterSelect(context, propertyId, property, options, data.where)
        }        

        else if (["tag"].includes(propertyType)) {
            input = renderFilterTag(context, propertyId, property, options)
        }        

        else if (["number"].includes(propertyType)) {
            input = renderFilterNumber(context, propertyId, property, options)
        }        

        else {
            input = renderFilterInput(context, propertyId, property, options, properties)
        }        

        filters.push(`<div class="col-md-12">${input}</div>`)
    }

    return filters.join("\n")
}

const renderFilterDateTime = (context, propertyId, property) => {

    return `<div class="form-outline fl-search-date-outline mb-1" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
            <input type="text" class="form-control form-control-sm fl-search-item fl-search-min" id="flSearchMin-${propertyId}" data-property-id="${propertyId}"/>
            <label for="flSearchMin-${propertyId}" class="form-label">${context.localize(property.labels)} - Min</label>
        </div>
        <div class="form-outline fl-search-date-outline mb-3" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
            <input type="text" class="form-control form-control-sm fl-search-item fl-search-max" id="flSearchMax-${propertyId}" data-property-id="${propertyId}"/>
            <label for="flSearchMax-${propertyId}" class="form-label">Max</label>
        </div>`
} 

const renderFilterSelect = (context, propertyId, property, options, where) => {

    const renderModalities = () => {

        let options = []
        for (let modalityId of Object.keys(property.modalities)) {
            const modality = property.modalities[modalityId]
            let selected = false
            if (Object.keys(where).length > 0 && Object.keys(where).includes(propertyId)) {
                const checked = where[propertyId].split(",")
                if (checked.includes(modalityId)) selected = true
            }
            if (!modality.archive) {
                options.push(`<option value="${modalityId}" ${ (selected) ? "selected" : "" } id="search-${propertyId}-${modalityId}">${context.localize(modality)}</option>`)
            }
        }
        return options.join("\n")
    }

    return `${(property.options.value) ? `<input type="hidden" class="searchInputValue" id="searchInputValue-${propertyId}" value="${property.options.value}" />` : ""}
    <div class="mb-3">
        <select class="fl-search-item fl-search-select" data-property-id="${propertyId}" data-mdb-size="sm" data-mdb-select-init="" id="flSearch-${propertyId}" multiple>
            ${renderModalities()}
        </select>
        <label class="form-label select-label">${context.localize(property.labels)}</label>
    </div>`
}


const renderFilterTag = (context, propertyId, property) => {

    const renderModalities = () => {

        let options = []
        for (let { id, name } of property.tags) {
            options.push(`<option value="${id}" id="search-${propertyId}-${id}">${name}</option>`)
        }
        return options.join("\n")
    }

    return `
        <div class="mb-3">
            <select class="fl-search-item fl-search-tag" data-property-id="${propertyId}" data-mdb-size="sm" data-mdb-select-init="" id="flSearch-${propertyId}" multiple>
                ${renderModalities()}
            </select>
            <label class="form-label select-label">${context.localize(property.labels)}</label>
        </div>`
} 

const renderFilterNumber = (context, propertyId, property) => {

    return `<div class="input-group input-group-sm mb-3">
                <span class="input-group-text fs-6" id="addon-wrapping"><label class="form-label" style="margin-bottom: 0 !important">${context.localize(property.labels)}</label></span>
                <div class="form-outline" data-mdb-input-init>
                    <input type="number" value="0" id="min" min="0" class="form-control form-control-sm fl-search-item fl-search-input" data-property-id="${propertyId}" id="flSearchMin-<${propertyId}"/>
                    <label class="form-label" for="flSearchMin-<${propertyId}">Min</label>
                </div>
                <div class="form-outline" data-mdb-input-init>
                    <input type="number" value="0" id="max" min="0" class="form-control form-control-sm fl-search-item fl-search-input" data-property-id="${propertyId}" id="flSearchMax-<${propertyId}"/>
                    <label class="form-label" for="flSearchMax-<${propertyId}">Max</label>
                </div>
            </div>`
}

const renderFilterInput = (context, propertyId, property, options, properties) => {

    const values = (properties[propertyId].distribution) ? Object.keys(properties[propertyId].distribution) : []
    return `
        <div class="form-outline fl-search-form-Outline mb-3" data-mdb-input-init data-values="${ values.join(",") }">
            <input type="text" class="form-control form-control-sm fl-search-item fl-search-input" data-property-id="${propertyId}" id="flSearch-${propertyId}" />
            <label class="form-label" for="flSearch-${propertyId}">${context.localize(property.labels)}</label>
        </div>`
}
