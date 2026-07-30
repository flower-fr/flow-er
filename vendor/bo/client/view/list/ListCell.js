import View from "../View.js"

export default class ListCell extends View
{
    constructor({ controller, list, row, propertyId, property, orderProperty, translations}) {
        super({ controller })
        this.list = list
        this.row = row
        this.propertyId = propertyId
        this.property = property
        this.orderProperty = orderProperty
        this.translations = translations
    }

    initialize = async () => {}

    render = () => 
    {
        const html = [], { row, propertyId, property, orderProperty } = this
        
        if (property.type == "select") {
            html.push(`
                <td class="${(property.class) ? property.class[row[propertyId]] : ""}">
                    ${ (row[propertyId]) 
        ? ( (property.modalities[row[propertyId]]) ? property.modalities[row[propertyId]].label : row[propertyId] )
        : "" }
                </td>`)
        }
        
        else if (property.type === "multiselect") {
            const captions = []
            for (let modalityId of row[propertyId].split(",")) {
                captions.push(property.modalities[modalityId].label)
            }
            html.push(`<td>${captions.join(",")}</td>`)                  
        }

        else if (property.type === "date") {
            if (propertyId === orderProperty && this.list.group === "day") {
                html.push("<td/>")
            } else {
                const dow = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"][moment(row[propertyId]).day()]
                html.push(`<td class="text-muted"><strong>${ dow }</strong>&nbsp;${ moment(row[propertyId]).format("DD/MM/YYYY") }</td>`)
            }
        }
    
        else if (property.type === "datetime") {
            if (propertyId === orderProperty && this.list.group === "day") {
                html.push(`<td class="text-muted">${ moment(row[propertyId]).format("HH:mm") }</td>`)
            } else {
                const dow = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"][moment(row[propertyId]).day()]
                html.push(`<td class="text-muted"><strong>${ dow }</strong> ${ moment(row[propertyId]).format("DD/MM/YYYY HH:mm") }</td>`)
            }
        }

        else if (property.type === "number") {
            html.push(`<td class="text-end">${ parseFloat(row[propertyId]).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) }</td>`)
        }

        else if (property.type === "percentage") {
            html.push(`<td class="text-right">${ parseFloat(row[propertyId] * 100).toLocaleString("fr-FR") }%</td>`)
        }

        else if (property.type === "email") {
            html.push(`<td>${(row[propertyId]) ? `<a href="mailto:${row[propertyId]}">${row[propertyId]}</a>` : ""}</td>`)
        }              

        else if (property.type === "phone") {
            html.push(`<td><a href="tel:${row[propertyId]}">${row[propertyId]}</a></td>`)
        }

        else if (property.type === "link") {
            html.push(`<td>${ (row[propertyId]) ? `<a href="${row[propertyId]}" target="_blank">${ ( property.prefix ) ? `&hellip;${ row[propertyId].substring(27) }` : row[propertyId] }</a>` : "" }</td>`)
        }              

        else if (property.type === "tags") {
            html.push(`<td class="listTagsName" id="listTagsName-${propertyId}-${row.id}">${row[propertyId]}</td>`)
        }

        else {
            if (propertyId === orderProperty && this.list.group) {
                html.push("<td/>")
            } else {
                const value = (Array.isArray(row[propertyId])) ? row[propertyId].join(", ") : row[propertyId]
                html.push(`<td>${(value && value !== null) ? value : ""}</td>`)
            }
        }

        return html.join("\n")
    }

    trigger = () => {}
}
