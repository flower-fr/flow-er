import View from "../View.js"

export default class ListCell extends View
{
    constructor({ controller, row, propertyId, params, property, translations}) {
        super({ controller })
        this.row = row
        this.propertyId = propertyId
        this.params = params
        this.property = property
        this.translations = translations
    }

    initialize = async () => {}

    render = () => 
    {
        const html = [], row = this.row, propertyId = this.propertyId, property = this.property
        
        if (property.type == "select") {
            html.push(`
                <td class="${(property.class) ? property.class[row[propertyId]] : ""} ${this.consistencyClass()}">
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
            html.push(`<td class="${this.consistencyClass()}">${captions.join(",")}</td>`)                  
        }

        else if (property.type == "date") {
            html.push(`<td class="${this.consistencyClass()}">${ moment(row[propertyId]).format("DD/MM/YYYY") }</td>`)
        }
    
        else if (property.type == "datetime") {
            const dow = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"][moment(row[propertyId]).day()]
            html.push(`<td class="${this.consistencyClass() || "text-muted"}"><strong>${ dow }</strong> ${ moment(row[propertyId]).format("DD/MM/YYYY HH:mm:ss") }</td>`)
        }

        else if (property.type == "number") {
            html.push(`<td class="text-right ${this.consistencyClass()}">${ parseFloat(row[propertyId]).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) }</td>`)
        }

        else if (property.type == "percentage") {
            html.push(`<td class="text-right ${this.consistencyClass()}">${ parseFloat(row[propertyId] * 100).toLocaleString("fr-FR") }%</td>`)
        }

        else if (property.type == "email") {
            html.push(`<td class="${this.consistencyClass()}">${(row[propertyId]) ? `<a href="mailto:${row[propertyId]}">${row[propertyId]}</a>` : ""}</td>`)
        }              

        else if (property.type == "phone") {
            html.push(`<td class="${this.consistencyClass()}"><a href="tel:${row[propertyId]}">${row[propertyId]}</a></td>`)
        }

        else if (property.type == "link") {
            html.push(`<td class="${this.consistencyClass()}">${ (row[propertyId]) ? `<a href="${row[propertyId]}" target="_blank">${ ( property.prefix ) ? `&hellip;${ row[propertyId].substring(27) }` : row[propertyId] }</a>` : "" }</td>`)
        }              

        else if (property.type == "tags") {
            html.push(`<td class="listTagsName ${this.consistencyClass()}" id="listTagsName-${propertyId}-${row.id}">${row[propertyId]}</td>`)
        }

        else {
            const value = (Array.isArray(row[propertyId])) ? row[propertyId].join(", ") : row[propertyId]
            html.push(`<td class="${this.consistencyClass()}">${(value && value !== null) ? value : ""}</td>`)                  
        }

        return html.join("\n")
    }

    trigger = () => {}

    consistencyClass = () => {
        const { row, propertyId } = this
        const conflictResources = this.params?.consistency?.rules?.conflictResources
        if (!conflictResources) return ""

        if (Object.keys(row.consistencyIssues).find(type => conflictResources[type]?.highlight.includes(propertyId)))
            return "text-danger fw-bold"
        return ""
    }
}
