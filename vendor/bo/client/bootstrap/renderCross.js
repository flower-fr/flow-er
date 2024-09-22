const renderCross = ({ context, entity, view }, data) => {

    const dict = {}, rows = data.rows, crossConfig = data.config, properties = data.properties, distribution = crossConfig.distribution.variable
    const property = context.config[`${entity}/property/${distribution}`]
    for (let modality of Object.keys(property.modalities)) {
        dict[modality] = { count: 0 }
        dict[modality][crossConfig.measure] = 0
    }

    for (let row of rows) {
        for (let propertyId of Object.keys(crossConfig.properties)) {
            if (propertyId != "owner_id") {
                dict[row[distribution]][propertyId] = row[propertyId]
            }
        }
        dict[row[distribution]][crossConfig.measure] += parseFloat(row[crossConfig.measure])
        dict[row[distribution]]["count"]++
    }

    const cross = {}
    for (let modality of Object.keys(dict)) {
        if (dict[modality].count != 0) cross[modality] = dict[modality]
    }

    const result = []

    result.push(`<div class="row">
        <div class="table-responsive">
            <div class="col-md-12">
                <table class="table table-sm table-hover" id="listPanel">
                    <thead class="table-light">
                        ${ renderCrossHeader({ context, entity, view }, properties) }
                    </thead>
                    <tbody class="table-group-divider" id="listParent">`)

    result.push(renderCrossRows(context, crossConfig, properties, cross))

    result.push(`
                    </tbody>
                </table>
            </div>
        </div>
    </div>`)

    return result.join("\n")
}

const renderCrossHeader = ({ context }, properties) => {

    const result = []

    for (let propertyId of Object.keys(properties)) {
        if (propertyId != "owner_id") {
            const property = properties[propertyId]

            result.push(`<th>${ context.localize(property.labels) }</th>`)
        }
    }

    return result.join("\n")
}

const renderCrossRows = (context, crossConfig, properties, cross) => {

    const result = []

    for (let row of Object.values(cross)) {
        result.push(`<tr class="listRow">`)
        result.push(renderCrossProperties(context, row, properties))
        result.push("</tr>")
    }
    return result.join("\n")
}

const renderCrossProperties = (context, row, properties) => {

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
