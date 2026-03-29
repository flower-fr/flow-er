import View from "../View.js"

export default class ListCell extends View
{
    constructor({ controller, row, propertyId, property, translations}) {
        super({ controller })
        this.row = row
        this.propertyId = propertyId
        this.property = property
        this.translations = translations
    }

    initialize = async () => {}

    render = () => 
    {
        const html = [], row = this.row, propertyId = this.propertyId, property = this.property
        
        if (property.type == "select") {
            html.push(`<td class="${(property.class) ? property.class[row[propertyId]] : ""}">
                ${ (row[propertyId]) 
        ? ( (property.modalities[row[propertyId]]) ? property.modalities[row[propertyId]].label : row[propertyId] )
        : "" }
            </td>`)
        }
        
        else if (property.type == "multiselect") {
            const captions = []
            for (let modalityId of row[propertyId].split(",")) {
                captions.push(property.modalities[modalityId].label)
            }
            html.push(`<td>${captions.join(",")}</td>`)                  
        }

        else if (property.type == "date") {
            html.push(`<td>${ moment(row[propertyId]).format("DD/MM/YYYY") }</td>`)
        }
    
        else if (property.type == "datetime") {
            html.push(`<td>${ moment(row[propertyId]).format("DD/MM/YYYY HH:mm:ss") }</td>`)
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

        else if (property.type == "link") {
            html.push(`<td>${(row[propertyId]) ? `<a href="${row[propertyId]}">${row[propertyId]}</a>` : ""}</td>`)
        }              

        else if (property.type == "tags") {
            html.push(`<td class="listTagsName" id="listTagsName-${propertyId}-${row.id}">${row[propertyId]}</td>`)
        }

        else {
            const value = (Array.isArray(row[propertyId])) ? row[propertyId].join(", ") : row[propertyId]
            html.push(`<td>${(value && value !== null) ? value : ""}</td>`)                  
        }

        return html.join("\n")
    }

    trigger = () => {}
}
