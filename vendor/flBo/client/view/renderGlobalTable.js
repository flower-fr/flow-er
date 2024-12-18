const renderGlobalTable = ({ context, entity, view }, data) => {

    const properties = data.importConfig.properties
    console.log(Object.values(properties))
    return `
    <div class="row">
        <div class="table-responsive">
            <div class="datatable col-md-12" data-mdb-datatable-init>
                <table class="table table-sm table-hover" id="listPanel">
                    <thead >

                        ${ renderGlobalTableHeaders({ context, entity, view }, properties) }

                    </thead>
                    <tbody class="table-group-divider" id="listParent">

                        ${ renderGlobalTableRows({ context, entity, view }, properties, data.valid) }

                    </tbody>
                </table>
            </div>
        </div>
    </div>`
}

const renderGlobalTableHeaders = ({ context }, properties) => {

    const head = ["<tr>"]

    for (const property of Object.values(properties)) {
        if (property.type != "default") {
            head.push(`<th>
                ${ context.localize(property.labels) }
            </th>`)    
        }
    }

    head.push("</tr>")

    return head.join("\n")
}

const renderGlobalTableRows = ({ context }, properties, rows) => {

    const html = []

    for (const row of rows) {

        html.push("<tr>")

        for (const [propertyId, property] of Object.entries(properties)) {
            if (property.type != "default") {
                html.push(renderProperty({ context }, propertyId, property, row))
            }
        }

        html.push("</tr>")
    }

    return html.join("\n")
}

const renderProperty = ({context }, propertyId, property, row) => {

    const html = []

    if (property.type == "select") {
        html.push(`<td class="${(property.class) ? property.class[row[propertyId]] : ""}">
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
        html.push(`<td>${(row[propertyId] !== null) ? row[propertyId] : ""}</td>`)                  
    }

    return html.join("\n")
}
