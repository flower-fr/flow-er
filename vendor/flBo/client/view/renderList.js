const renderList = ({ context, entity, view }, data) => {

    console.log("In renderList(flBo)")

    const rows = data.rows, orderParam = data.order, limit = data.limit, listConfig = data.config, properties = data.properties

    const columns = {}, dictionary = {}
    for (const row of rows) dictionary[row.id] = row

    for (const [propertyId, column] of Object.entries( (listConfig.columns) ? listConfig.columns : properties )) {
        const property = properties[propertyId] || column

        if (column.cross) {
            for (const crossRow of (data.crossRows) ? data.crossRows : []) {
                let row = dictionary[crossRow[property.foreignKey]]
                if (!row) {
                    row = {}
                    for (const key of Object.keys(listConfig.properties)) {
                        if (crossRow[key]) row[key] = crossRow[key]
                    }
                    rows.push(row)
                    dictionary[crossRow[property.foreignKey]] = row
                }
                if (!row[propertyId]) row[propertyId] = []
                let value = crossRow[property.property]
                let keep = true
                if (column.restriction) {
                    for (const [k, v] of Object.entries(column.restriction)) {
                        if (v.substring(0, 1) == "!") {
                            if (crossRow[k] == v.substring(1)) {
                                keep = false
                                break
                            }
                        }
                        else if (crossRow[k] != v) {
                            keep = false
                            break
                        }
                    }
                }
                if (keep) {
                    const modalities = data.crossProperties[property.property].modalities
                    if (modalities && modalities[value]) value = context.localize(modalities[value])
                    row[propertyId].push(value)
                }
            }
        }

        columns[propertyId] = property
    }
    
    const html = []

    html.push(`
    <thead class="table-light fl-list">
        ${ renderListHeader({ context, entity, view }, listConfig, columns, orderParam) }
    </thead>
    <tbody class="table-group-divider">`)

    html.push(`<tr>
        <td>
            <div class="text-center">
                <input type="checkbox" class="fl-list-check-all" data-toggle="tooltip" data-placement="top" title="${context.translate("Check all")}"></input>
            </div>
        </td>

        <td class="text-center">
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-list-detail fl-list-add" title="${context.translate("Add")}" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#flListDetailModalForm" data-id="0">
                <span class="fas fa-plus"></span>
            </button>
            <button 
              type="button"
              class="btn btn-sm btn-outline-primary index-btn fl-list-group"
              data-fl-controller="flBo"
              data-fl-action="group"
              data-mdb-ripple-init
              data-mdb-modal-init
              data-mdb-target="#flListDetailModalForm"
              data-toggle="tooltip"
              data-placement="top"
              title="${context.translate("Grouped actions")}"
            >
                <span class="fas fa-list"></span>
            </button>
        </td>

        <td colspan="${Object.keys(columns).length}" />
    </tr>

    ${renderRows(context, listConfig, columns, rows)}

    <tr class="listRow">
        <td>
            <div class="text-center">
                <input type="checkbox" class="fl-list-check-all" title="${context.translate("Check all")}"></input>
            </div>
        </td>

        <td class="text-center">
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-list-detail fl-list-add" title="${context.translate("Add")}" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#flListDetailModalForm" data-id="0">
                <span class="fas fa-plus"></span>
            </button>
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-list-group" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#flListDetailModalForm" data-toggle="tooltip" data-placement="top" title="${context.translate("Grouped actions")}">
                <span class="fas fa-list"></span>
            </button>
            ${(rows.length == limit) ? 
        `       <button type="button" class="btn btn-sm btn-outline-primary fl-list-more" data-toggle="tooltip" data-placement="top" title="${context.translate("Display the entire list")}">
                    <i class="fas fa-ellipsis-h"></i>
                </button>`
        : ""}
        </td>

        <td colspan="${Object.keys(columns).length}" />
    </tr>`)

    html.push(`
    </tbody>`)

    return html.join("\n")
}

const renderRows = (context, listConfig, columns, rows) => {

    const result = []

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        const checkData = []
        if (listConfig && listConfig.checkData) {
            for (let propertyId of listConfig.checkData) {
                checkData.push(`${propertyId}:${ encodeURIComponent(row[propertyId]) }`)
            }
        }

        // Deprecated
        const listCheckIds = []
        if (listConfig && listConfig.checkIds) {
            for (let checkId of listConfig.checkIds) {
                listCheckIds.push(`<input type="hidden" class="listCheckId-${row.id}" id="listCheckId-${row.id}-${checkId}" value="${row[checkId]}"></input>`)
            }
        }

        result.push(renderHidden(context, listConfig, columns, row))

        result.push(`
        <tr class="listRow">
            <td>
                <div class="text-center">
                    <input type="checkbox" class="fl-list-check" id="flListCheck-${ row.id }" data-row-id="${i}" data-properties="${ checkData.join("|") }"></input>
                </div>
            </td>

            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-list-detail" data-bs-toggle="modal" data-bs-target="#flListDetailModalForm" data-mdb-target="#flListDetailModalForm" data-mdb-modal-init title="${context.translate("Detail")}" data-id="${row.id}">
                  <i class="fas fa-search"></i>
                </button>
            </td>

            ${renderProperties(context, listConfig, columns, row)}
        </tr>`)
    }

    return result.join("\n")
}

const renderHidden = (context, listConfig, columns, row) => {

    const html = []
    if (listConfig.hidden) {
        for (let propertyId of Object.keys(listConfig.hidden)) {
            html.push(`<input type="hidden" id="flListHidden-${ propertyId }-${ row.id }" value="${ row[propertyId] }" />`)
        }
    }
    return html
}

const renderProperties = (context, listConfig, columns, row) => {

    const html = []
    for (let [propertyId, property] of Object.entries(columns)) {
        if (property.type == "select") {
            html.push(`<td class="${(property.options.class) ? property.options.class[row[propertyId]] : ""}">
                ${ (row[propertyId]) 
        ? ( (property.modalities[row[propertyId]]) ? context.localize(property.modalities[row[propertyId]]) : row[propertyId] )
        : "" }
            </td>`)
        }
        
        else if (property.type == "multiselect") {
            const captions = []
            for (let modalityId of row[propertyId].split(",")) {
                captions.push(context.localize(property.modalities[modalityId]))
            }
            html.push(`<td>${captions.join(",")}</td>`)                  
        }

        else if (property.type == "date") {
            html.push(`<td>${context.decodeDate(row[propertyId])}</td>`)
        }
      
        else if (property.type == "datetime") {
            html.push(`<td>${context.decodeTime(row[propertyId])}</td>`)
        }

        else if (property.type == "number") {
            html.push(`<td class="text-right">${ parseFloat(row[propertyId]).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) }</td>`)
        }

        else if (property.type == "percentage") {
            html.push(`<td class="text-right">${ parseFloat(row[propertyId] * 100).toLocaleString("fr-FR") }%</td>`)
        }

        else if (property.type == "email") {
            html.push(`<td>${(row[propertyId]) ? `<a href="mailto:${row[propertyId]}">${row[propertyId]}</a>` : ""}</td>`)
        }              

        else if (property.type == "phone") {
            html.push(`<td><a href="tel:${row[propertyId]}">${row[propertyId]}</a></td>`)
        }

        else if (property.options.type == "link") {
            html.push(`<td>${(row[propertyId]) ? `<a href="${row[propertyId]}">${row[propertyId]}</a>` : ""}</td>`)
        }              

        else if (property.type == "tags") {
            html.push(`<td class="listTagsName" id="listTagsName-${propertyId}-${row.id}">${row[propertyId]}</td>`)
        }

        else {
            if (property.options.detailCaption) {
                html.push(`<input type="hidden" id="detailCaption-${row.id}" value="${row[propertyId]}" />`)
            }
            const value = (Array.isArray(row[propertyId])) ? row[propertyId].join(", ") : row[propertyId]
            html.push(`<td>${(value && value !== null) ? value : ""}</td>`)                  
        }
    }
    return html.join("\n")
}
