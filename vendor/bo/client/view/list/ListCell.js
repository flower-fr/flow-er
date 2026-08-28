import View from "../View.js"

export default class ListCell extends View
{
    constructor({ controller, list, listRow, row, propertyId, params, property, orderProperty, translations}) {
        super({ controller })
        this.list = list
        this.listRow = listRow
        this.row = row
        this.propertyId = propertyId
        this.params = params
        this.property = property
        this.orderProperty = orderProperty
        this.translations = translations
    }

    initialize = async () => {}

    render = () => 
    {
        const html = [], { row, propertyId, property, orderProperty, list, listRow } = this

        // Compute class for cell depending on config rule
        const rowClass  = listRow.rowClass || this.consistencyClass()
        let classSpec
        if (property.type == "select") {
            if (list.cellClass) {
                const cellClassSpec = list.cellClass[propertyId]
                if (cellClassSpec && row[propertyId]) {
                    classSpec = Object.entries(cellClassSpec).find(([cLass, spec]) => 
                        Object.entries(spec).find(([key, value]) => row[key] === value)
                    )
                }
            }
            if (classSpec) classSpec = classSpec[0]

            html.push(`
                <td class="${ rowClass || classSpec || "" }">
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
            html.push(`<td class="${ rowClass  }">${captions.join(",")}</td>`)                  
        }

        else if (property.type === "date") {
            if (row[propertyId]) {
                if (propertyId === orderProperty && this.list.grouping === "day") {
                    html.push("<td/>")
                } else {
                    const dow = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"][moment(row[propertyId]).day()]
                    html.push(`<td class="${ (row[propertyId] === moment().format("YYYY-MM-DD")) ? "fst-italic text-muted" : ( rowClass   || "text-muted") }"><strong>${ dow }</strong>&nbsp;${ moment(row[propertyId]).format("DD/MM/YYYY") }</td>`)
                }
            } else {
                html.push("<td/>")
            }
        }
    
        else if (property.type === "datetime") {
            if (row[propertyId]) {
                if (propertyId === orderProperty && this.list.grouping === "day") {
                    html.push(`<td class="text-muted">${ moment(row[propertyId]).format("HH:mm") }</td>`)
                } else {
                    const dow = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"][moment(row[propertyId]).day()]
                    html.push(`<td class="${ rowClass   || "text-muted"}"><strong>${ dow }</strong> ${ moment(row[propertyId]).format("DD/MM/YYYY HH:mm") }</td>`)
                }
            }
        }

        else if (property.type === "duration") {
            html.push(`<td class="text-end ${ rowClass   || ""}">${ Math.floor(row[propertyId] / 60) }h${ (x => x ? x : "")(row[propertyId] % 60) }</td>`)
        }

        else if (property.type === "number") {
            html.push(`<td class="text-end ${ rowClass   || ""}">${ parseFloat(row[propertyId]).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) }</td>`)
        }

        else if (property.type === "percentage") {
            html.push(`<td class="text-right ${ rowClass   || ""}">${ parseFloat(row[propertyId] * 100).toLocaleString("fr-FR") }%</td>`)
        }

        else if (property.type === "email") {
            html.push(`<td class="${ rowClass   || ""}">${(row[propertyId]) ? `<a href="mailto:${row[propertyId]}">${row[propertyId]}</a>` : ""}</td>`)
        }              

        else if (property.type === "phone") {
            html.push(`<td class="${ rowClass   || ""}"><a href="tel:${row[propertyId]}">${row[propertyId]}</a></td>`)
        }

        else if (property.type === "link") {
            html.push(`<td class="${ rowClass   || ""}">${ (row[propertyId]) ? `<a href="${row[propertyId]}" target="_blank">${ ( property.prefix ) ? `&hellip;${ row[propertyId].substring(27) }` : row[propertyId] }</a>` : "" }</td>`)
        }              

        else if (property.type === "tags") {
            html.push(`<td class="listTagsName ${ rowClass   || ""}" id="listTagsName-${propertyId}-${row.id}">${row[propertyId]}</td>`)
        }

        else {
            if (propertyId === orderProperty && this.list.grouping) {
                html.push("<td/>")
            } else {
                const value = (Array.isArray(row[propertyId])) ? row[propertyId].join(", ") : row[propertyId]
                html.push(`<td class="${ rowClass   || ""}">${(value && value !== null) ? value : ""}</td>`)
            }
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
