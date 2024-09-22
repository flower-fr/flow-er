const renderModalList = ({ context, entity, view }, data) => {

    const rows = data.rows, orderParam = data.orderParam, limit = data.limit, modalListConfig = data.config, properties = data.properties

    return `<style>
    table td { 
        font-size: 0.9rem;
    }
    </style>
    <div class="row">
        <div class="table-responsive">
            <div class="col-md-12">
                <table class="table table-sm table-hover" id="listPanel">
                    
                    ${renderModalListHeader({ context }, properties)}
    
                    <tbody class="table-group-divider" id="listParent">
                        <tr>
                            <td>
                                <div class="text-center">
                                    <input type="checkbox" class="modalListCheckAll" data-toggle="tooltip" data-placement="top" title="${context.translate("Check all")}"></input>
                                </div>
                            </td>
                    
                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-outline-primary index-btn modalListDetailButton" title="${context.translate("Add")}" id="modalListDetailButton-0">
                                    <span class="fas fa-plus"></span>
                                </button>
                            </td>
                        </tr>
                    
                        ${renderModalListRows({ context, entity: data.entity }, modalListConfig, properties, rows)}
                    
                        <tr class="listRow">
                            <td>
                                <div class="text-center">
                                    <input type="checkbox" class="modalListCheckAll" title="${context.translate("Check all")}"></input>
                                </div>
                            </td>
                    
                            <td class="text-center">
                                <button type="button" class="btn btn-sm btn-outline-primary index-btn modalListGroupButton" data-toggle="tooltip" data-placement="top" title="${context.translate("Grouped actions")}" id="modalListGroupButton-1">
                                    <span class="fas fa-list"></span>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>`
}

const renderModalListHeader = ({ context }, properties) => {

    const head = [`<th></th><th></th>`]

    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        if (Object.keys(property).length > 0) {
            head.push(`<th>
                <div id="modalListSortAnchor-${propertyId}">
                    <span class="modalListHeaderLabel" id="modalListHeaderLabel-${propertyId}">${ context.localize(property.labels) }</span>
                </div>
            </th>`)    
        }
    }

    return head.join("\n")
}

const renderModalListRows = ({ context, entity }, modalListConfig, properties, rows) => {

    const result = []

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        const modalListCheckIds = []
        if (modalListConfig.checkIds) {
            for (let checkId of modalListConfig.checkIds) {
                modalListCheckIds.push(`<input type="hidden" class="modalListCheckId-${row.id}" id="modalListCheckId-${row.id}-${checkId}" value="${row[checkId]}"></input>`)
            }
        }

        result.push(`
        <tr class="listRow">
            <td>
                <div class="text-center">
                    <input type="checkbox" class="modalListCheck" id="modalListCheck-${row.id}-${i}"></input>
                    ${modalListCheckIds.join("\n")}
                </div>
            </td>

            <td class="text-center">
                <input type="hidden" id="modalListTabsRoute-${row.id}" value="/bo/modalListTabs/${entity}/${row.id}" />
                <button type="button" class="btn btn-sm btn-outline-primary index-btn modalListDetailButton" id="modalListDetailButton-${row.id}">
                  <i class="fas fa-search"></i>
                </button>
            </td>

            ${renderModalListProperties({ context }, row, properties)}
        </tr>
        <tr><td class="modalListTabsPanel" id="modalListTabsPanel-${row.id}" colspan="${ Object.keys(properties).length + 2 }"></td></tr`)
    }

    return result.join("\n")
}

const renderModalListProperties = ({ context }, row, properties) => {

    const html = []

    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]

        if (Object.keys(property).length > 0) {

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
    }
    return html.join("\n")
}
