const tableRowsView = ({ context, entity }, properties, rows) => {

    const html = []

    for (let i = 0; i < rows.length; i++) {

        const row = rows[i]

        html.push(`
        <tr class="fl-json-row">`)

        html.push(`<input type="hidden" class="fl-json-cell-${ i }" data-fl-property="id" data-fl-value="${ row.id }" />`)

        html.push(`
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-json-detail-button" title="${ context.translate("Detail") }" data-fl-row="${ i }">
                    <i class="fas fa-search"></i>
                </button>
            </td>`)
    
        for (const [propertyId, property] of Object.entries(properties)) {
    
            let display

            if (property.type === "source") {
                for (const modality of property.modalities) {
                    if (modality.id === row[propertyId]) {
                        display = modality[property.text]
                        if (property.secondaryText) display += `<br><span class="text-muted text-sm">${ modality[property.secondaryText] }</span>`
                        break
                    }
                }
            }

            else if (property.modalities) {

                const value = []
                for (const modality of (row[propertyId]) ? row[propertyId].split(",") : []) value.push(context.localize(property.modalities[modality]))

                display = value.join(", ")
            }
    
            else if (property.type == "date") {
                display = (row[propertyId]) ? moment(row[propertyId]).format("DD/MM/YYYY") : ""
            }
        
            else if (property.type == "datetime") {
                display = (row[propertyId]) ? moment(row[propertyId]).local().format("DD/MM/YYYY HH:mm:ss") : ""
            }
    
            else if (property.type == "number") {
                display = (row[propertyId]) ? parseFloat(row[propertyId]).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) : ""
            }
    
            else {
                display = (row[propertyId]) ? row[propertyId] : ""
            }

            html.push(`<td class="fl-json-cell-${ i }" data-fl-property="${ propertyId }" data-fl-value="${ row[propertyId] }">${ display }</td>`)
        }
    
        html.push(`
            </tr>`)
    }

    return html.join("\n")
}

export { tableRowsView }