const renderModalListRows = ({ context, entity }, section, id, modalListConfig, properties, rows) => {

    const result = []

    for (const row of rows) {

        result.push(`
        <tr class="fl-modal-list-row">

            ${renderModalListProperties({ context, entity }, section, modalListConfig, row, properties)}

        </tr>`)

        if (Object.values(properties).some((x) => x.type == "textarea")) {
            const [textareaId, textarea] = Object.entries(properties).find(([key, value]) => value.type == "textarea")
            result.push(`
        <tr class="fl-modal-list-row">
            <td/>
            <td colspan="${ Object.entries(properties).length }">
                ${ row[textareaId] && row[textareaId].split("\n").join("<br>") }
            </td>
        </tr>`)
        }
    }

    return result.join("\n")
}

const renderModalListProperties = ({ context, entity }, section, modalListConfig, row, properties) => {

    for (const [key, value] of Object.entries(row)) {
        if (properties[key] && properties[key].type == "date") {
            if (value) row[key] = moment(value).format("DD/MM/YYYY")
            else row[key] = ""
        }
    }
    const html = []

    html.push(`<td class="text-center">
        <input type="hidden" id="modalListTabsRoute-${row.id}" value="/bo/modalListTabs/${entity}/${row.id}" />
        ${ (section.action && section.action == "detail") ?
        `<button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-detail-button" title="${context.translate("Detail")}" id="modalListDetailButton-${row.id}" data-fl-route="/${ modalListConfig.controller }/${ modalListConfig.action }/${ modalListConfig.entity }/${ row.id }">
            <i class="fas fa-search"></i>
        </button>` : "" }
        ${ (section.action && section.action == "update") ?
        `<button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-update-button" title="${context.translate("Update")}" id="modalListDetailButton-${row.id}" data-fl-data="${ encodeURI(JSON.stringify(row)) }" data-fl-route="/${ modalListConfig.controller }/${ modalListConfig.action }/${ modalListConfig.entity }/${ row.id }">
            <i class="fas fa-pen"></i>
        </button>` : "" }
    </td>`)

    for (const [propertyId, property] of Object.entries(properties)) {

        if (!["hidden", "textarea"].includes(property.type) && Object.keys(property).length > 0) {

            if (property.type == "select") {
                html.push(`<td class="${(property.options.class) ? property.options.class[row[propertyId]] : "" }">
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
                html.push(`<td>${ row[propertyId] }</td>`)
            }
        
            else if (property.type == "datetime") {
                html.push(`<td>${ moment(row[propertyId]).local().format("DD/MM/YYYY HH:mm:ss") }</td>`)
            }

            else if (property.type == "number") {
                html.push(`<td>${ parseFloat(row[propertyId]).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) }${ (property.options.currency) ? property.options.currency : "" }</td>`)
            }

            else if (property.type == "percentage") {
                html.push(`<td>${ parseFloat(row[propertyId] * 100).toLocaleString("fr-FR") }%</td>`)
            }

            else if (property.type == "email") {
                html.push(`<td>${(row[propertyId]) ? `<a href="mailto:${row[propertyId]}">${row[propertyId]}</a>` : ""}</td>`)
            }              

            else if (property.type == "phone") {
                html.push(`<td><a href="tel:${row[propertyId]}">${row[propertyId]}</a></td>`)
            }

            else if (property.type == "route") {
                let route = `/${ property.controller }/${ property.action }/${ property.entity }`
                if (property.id) route += `/${ row[property.id] }`
                if (property.query) {
                    const query = []
                    for (const [key, value] of Object.entries(property.query)) {
                        query.push(`${ key }=${ row[value] }`)
                    }
                    route += `?${ query.join("&") }`
                }
                html.push(`<td><a href="${ route }">${ context.translate("Click for downloading") }</a></td>`)
            }

            else if (["tags", "source"].includes(property.type)) {
                let label = []
                for (const modality of property.modalities) {
                    if (modality.id == row[propertyId]) {
                        const format = property.format[0].split("%s"), args = property.format[1].split(",")
                        for (let i = 0; i <= args.length; i++) {
                            if (i != 0) {
                                const config = context.config[`${property.entity}/property/${args[i-1]}`]
                                let value = modality[args[i-1]]
                                if (config && config.type == "percentage") value = `${ parseFloat(value) * 100 }%`
                                label.push(value)
                            }
                            label.push(format[i])
                        }
                    }
                }
                html.push(`<td class="fl-list-tags-name" id="flListTagsName-${propertyId}-${row.id}">${ label.join("") }</td>`)
            }

            else {
                html.push(`<td>${(row[propertyId] !== null) ? row[propertyId] : ""}</td>`)                  
            }
        }
    }
    return html.join("\n")
}
