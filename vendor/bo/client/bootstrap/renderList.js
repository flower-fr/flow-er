const renderList = ({ context, entity, view }, data) => {

    const rows = data.rows, orderParam = data.orderParam, limit = data.limit, listConfig = data.config, properties = data.properties

    return `<tr>
        <td>
            <div class="text-center">
                <input type="checkbox" class="listCheckAll" data-toggle="tooltip" data-placement="top" title="${context.translate("Check all")}"></input>
            </div>
        </td>

        <td class="text-center"}">
            <button type="button" class="btn btn-sm btn-outline-primary index-btn listDetailButton" title="${context.translate("Add")}" id="listDetailButton-0">
                <span class="fas fa-plus"></span>
            </button>
        </td>

        <td colspan="${Object.keys(properties).length}" />
    </tr>

    ${renderRows(context, listConfig, properties, rows)}

    <tr class="listRow">
        <td>
            <div class="text-center">
                <input type="checkbox" class="listCheckAll" title="${context.translate("Check all")}"></input>
            </div>
        </td>

        <td class="text-center">
            <button type="button" class="btn btn-sm btn-outline-primary index-btn listGroupButton" data-toggle="tooltip" data-placement="top" title="${context.translate("Grouped actions")}" id="listGroupButton-1">
                <span class="fas fa-list"></span>
            </button>
            ${(rows.length == limit) ? `
                <button type="button" class="btn btn-sm btn-outline-primary listMoreButton" data-toggle="tooltip" data-placement="top" title="${context.translate("Display the entire list")}">
                    <i class="fas fa-ellipsis-h"></i>
                </button>`
                : ""}
        </td>

        <td colspan="${Object.keys(properties).length - 1}" />
    </tr>`
}

const renderRows = (context, listConfig, properties, rows) => {

    const result = []

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        const listCheckIds = []
        if (listConfig && listConfig.checkIds) {
            for (let checkId of listConfig.checkIds) {
                listCheckIds.push(`<input type="hidden" class="listCheckId-${row.id}" id="listCheckId-${row.id}-${checkId}" value="${row[checkId]}"></input>`)
            }
        }

        result.push(`
        <tr class="listRow">
            <td>
                <div class="text-center">
                    <input type="checkbox" class="listCheck" id="listCheck-${row.id}-${i}"></input>
                    ${listCheckIds.join("\n")}
                </div>
            </td>

            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-primary index-btn listDetailButton" data-bs-toggle="modal" data-bs-target="#listDetailModalForm" data-mdb-ripple-init data-mdb-target="#listDetailModalForm" data-mdb-modal-init title="${context.translate("Detail")}" id="listDetailButton-${row.id}">
                  <i class="fas fa-search"></i>
                </button>
            </td>

            ${renderProperties(context, row, properties)}
        </tr>`)
    }

    return result.join("\n")
}

const renderProperties = (context, row, properties) => {

    const html = []

    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]

        if (property.type == "select") {
            html.push(`<td class="${(property.options.class) ? property.options.class[row[propertyId]] : ""}">
                ${(row[propertyId]) ? context.localize(property.modalities[row[propertyId]]) : ""}
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

        else if (property.type == "email") {
            html.push(`<td>${(row[propertyId]) ? `<a href="mailto:${row[propertyId]}">${row[propertyId]}</a>` : ""}</td>`)
        }              

        else if (property.type == "phone") {
            html.push(`<td><a href="tel:${row[propertyId]}">${row[propertyId]}</a></td>`)
        }

        else if (property.type == "tags") {
            html.push(`<td class="listTagsName" id="listTagsName-${propertyId}-${row.id}">${row[propertyId]}</td>`)
        }

        else {
            if (property.options.detailCaption) {
                html.push(`<input type="hidden" id="detailCaption-${row.id}" value="${row[propertyId]}" />`)
            }
            html.push(`<td>${(row[propertyId] !== null) ? row[propertyId] : ""}</td>`)                  
        }
    }
    return html.join("\n")
}
