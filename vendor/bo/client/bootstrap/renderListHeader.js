const renderListHeader = ({ context, entity, view }, data) => {

    const measure = data.rows, properties = data.properties

    return `<style>
    table td { 
        font-size: 0.9rem;
    }
    </style>
    <div class="row">
        <div class="table-responsive">
            <div class="col-md-12">
                <table class="table table-sm table-hover" id="listPanel">
                    <thead class="table-light">
                        ${ renderListHeaderInputs({ context, entity, view }, measure, properties) }
                    </thead>
                    <tbody class="table-group-divider" id="listParent"></tbody>
                </table>
            </div>
        </div>
    </div>`
}

const renderListHeaderInputs = ({ context }, measure, properties) => {
    
    let measureValues = (measure) ? Object.values(measure) : false, count = (measure) ? measureValues[0] : false, sum = (measure) ? parseFloat(measureValues[1]) : false
    const average = (sum && count) ? Math.round(sum / count * 10) / 10 : false

    const renderSelectOption = (propertyId) => {
        const property = properties[propertyId]
        const options = []
        for (let modality of Object.keys(property.distribution)) {
            const { code, value } = property.distribution[modality]
            let label
            if (["select"].includes(property.type)) label = context.localize(property.modalities[code])
            else if (property.type == "date") label = context.decodeDate(code)
            else if (property.type == "number") label = parseFloat(code).toLocaleString("fr-FR")
            else label = code
            options.push(`<option value="${modality}" title="${ (modality) ? label : "Vide" } (${value})">${ (modality) ? label : "Vide" } (${value})</option>`)
        }
        return options.join("\n")
    }

    const renderDatalist = (propertyId) => {
        const property = properties[propertyId]
        const options = []
        for (let modality of Object.keys(property.distribution)) {
            const { code, value } = property.distribution[modality]
            options.push(`<option value="${code}">${code} (${value})</option>`)
        }
        return options.join("\n")
    }

    const head = [`<th>
        <div class="text-center">
            <small>
                <b id="listCount" title="Nombre de lignes">${count}</b>
                ${ (sum) ? `<br><b id="listCount" title="Somme">${sum.toLocaleString("fr-FR")}</b>` : "" }
                ${ (average) ? `<br><em id="listAverage" title="Moyenne">${average.toLocaleString("fr-FR")}</em>`: "" }
            </small>
        </div>
    </th>
    <th class="text-center">
        <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="tooltip" title="${context.translate("Order the list")}" id="flOrderButton">
            <i class="fas fa-arrow-down-a-z"></i>
        </button>
        <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="tooltip" title="${context.translate("Refresh the list")}" id="flRefreshButton">
            <i class="fas fa-sync-alt"></i>
        </button>
        <button type="button" class="btn btn-sm btn-outline-primary" data-bs-toggle="tooltip" title="${context.translate("Cancel the filters")}" id="flEraseButton">
            <i class="fas fa-times"></i>
        </button>
    </th>`]
    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        const forms = []
        if (["select", "tag"].includes(property.type)) {
            forms.push(`<select class="form-select form-select-sm px-0 searchInput searchInputSelect" size="${ Math.min(4, Object.keys(property.distribution).length) }" id="search-${propertyId}" multiple>${renderSelectOption(propertyId)}</select>`)
        }
        else if (["input", "email", "phone", "source"].includes(property.type)) {
            forms.push(`<input type="text" class="form-control form-control-sm searchInput searchInputText" list="searchDatalistOptions-${propertyId}" id="search-${propertyId}" />
                <datalist id="searchDatalistOptions-${propertyId}">${renderDatalist(propertyId)}</datalist>`)
        }
        else if (["date", "datetime"].includes(property.type)) {
            forms.push(`<input type="text" class="form-control form-control-sm searchInput searchInputDate searchInputDateMin" id="searchMin-${propertyId}" placeholder="${context.translate("Min")}" />`)
            forms.push(`<input type="text" class="form-control form-control-sm searchInput searchInputDate searchInputDateMax" id="searchMax-${propertyId}" placeholder="${context.translate("Max")}" />`)
        }
        else if (["time", "number"].includes(property.type)) {
            forms.push(`<input type="text" class="form-control form-control-sm searchInput searchInputNumber searchInputNumberMin" id="searchMin-${propertyId}" placeholder="${context.translate("Min")}" />`)
            forms.push(`<input type="text" class="form-control form-control-sm searchInput searchInputNumber searchInputNumberMax" id="searchMax-${propertyId}" placeholder="${context.translate("Max")}" />`)
        }

        head.push(`<th>
            <div data-bs-toggle="collapse" href="#listSortCollapse-${propertyId}" role="button" id="listSortAnchor-${propertyId}" aria-expanded="false" aria-controls="listSortCollapse-${propertyId}">
                <span class="listHeaderLabel" id="listHeaderLabel-${propertyId}">${ context.localize(property.labels) }</span>
                <i class="fa fa-filter listHeaderIcon" id="listHeaderIcon-${propertyId}"></i>
            </div>
            <div class="collapse" id="listSortCollapse-${propertyId}">
                ${ forms.join("") }
            </div>
        </th>`)
    }

    head.push(`<thead class="table-light text-center listOrderHead"><th colspan="${ Object.keys(properties).length + 2 }">`)
    head.push(renderOrderSelect({ context }, properties))
    head.push("</th></thead>")

    return head.join("\n")
}

const renderOrderSelect = ({ context }, properties) => {
    const columns = Object.keys(properties)
    const renderSelectOption = () => {
        const options = []
        for (let propertyId of columns) {
            const property = properties[propertyId]
            options.push(`<option value="${propertyId}">${ context.localize(property.labels) }</option>`)
        }
        return options.join("\n")
    }

    return `<div class="row justify-content-md-center">
        <div class="col-md-4">
            <div class="input-group">
                <select class="form-select form-select-sm flOrderSelect" id="flOrderSelect">
                    <option value=""></option>
                    ${renderSelectOption()}
                </select>
                <span class="input-group-text">
                    <span class="form-check">
                        <input type="checkbox" class="form-check-input flDescendingCheck" id="flDescendingCheck">
                        <label class="form-check-label" for="flDescendingCheck">
                            ${ context.translate("Descending order") }
                        </label>
                    </span>
                </span>
            </div>
        </div>
    </div>`
}
