class ListRowProperties
{
    constructor({context, listConfig, columns, row}) {
console.log(columns)
        this.context = context
        this.listConfig = listConfig
        this.columns = columns
        this.row = row
    }

    render = () => 
    {
        const html = [], context = this.context, row = this.row
        for (let [propertyId, property] of Object.entries(this.columns)) {
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

    trigger = () => {
    }
}

export { ListRowProperties }
