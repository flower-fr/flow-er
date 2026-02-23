import View from "../View.js"

export default class ModalListProperty extends View
{
    constructor({ controller, context, entity, section, config, propertyId, property, id, value })
    {
        super({ controller })
        this.context = context
        this.entity = entity
        this.section = section
        this.config = config
        this.propertyId = propertyId
        this.property = property
        this.id = id
        this.value = value
    }

    render = () =>
    {
        const context = this.context, entity = this.entity, section = this.section, modalListConfig = this.config, propertyId = this.propertyId, property = this.property, id = this.id
        let value = this.value
        if (property.type == "date") {
            if (value) value = moment(value).format("DD/MM/YYYY")
            else value = ""
        }
        const html = []

        html.push(`
        <td class="text-center">
            <input type="hidden" id="modalListTabsRoute-${id}" value="/bo/modalListTabs/${entity}/${id}" />

            ${ (section.action && section.action == "detail") 
        ? `
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-detail-button" title="${context.translate("Detail")}" id="modalListDetailButton-${id}" data-fl-route="/${ modalListConfig.controller }/${ modalListConfig.action }/${ modalListConfig.entity }/${ id }">
                <i class="fas fa-search"></i>
            </button>`
        : "" }

            ${ (section.action && section.action == "update")
        ? `
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-update-button" title="${context.translate("Update")}" id="modalListDetailButton-${id}" data-fl-data="${ encodeURI(JSON.stringify(row)) }" data-fl-route="/${ modalListConfig.controller }/${ modalListConfig.action }/${ modalListConfig.entity }/${ id }">
                <i class="fas fa-pen"></i>
            </button>`
        : "" }

        </td>`)

        if (!["hidden", "textarea"].includes(property.type) && Object.keys(property).length > 0) {

            if (property.type == "select") {
                html.push(`<td class="${(property.options.class) ? property.options.class[value] : "" }">
                    ${(value) ? context.localize(property.modalities[value]) : ""}
                </td>`)
            }
            
            else if (property.type == "multiselect") {
                const captions = []
                for (let modalityId of value.split(",")) {
                    captions.push(context.localize(property.modalities[modalityId]))
                }
                html.push(`<td>${captions.join(",")}</td>`)                  
            }

            else if (property.type == "date") {
                html.push(`<td>${ value }</td>`)
            }
        
            else if (property.type == "datetime") {
                html.push(`<td>${ moment(value).local().format("DD/MM/YYYY HH:mm:ss") }</td>`)
            }

            else if (property.type == "number") {
                html.push(`<td>${ parseFloat(value).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) }${ (property.options.currency) ? property.options.currency : "" }</td>`)
            }

            else if (property.type == "percentage") {
                html.push(`<td>${ parseFloat(value * 100).toLocaleString("fr-FR") }%</td>`)
            }

            else if (property.type == "email") {
                html.push(`<td>${(value) ? `<a href="mailto:${value}">${value}</a>` : ""}</td>`)
            }              

            else if (property.type == "phone") {
                html.push(`<td><a href="tel:${value}">${value}</a></td>`)
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
                    if (modality.id == value) {
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
                html.push(`<td class="fl-list-tags-name" id="flListTagsName-${propertyId}-${id}">${ label.join("") }</td>`)
            }

            else {
                html.push(`<td>${(value !== null) ? value : ""}</td>`)                  
            }
        }

        return html.join("\n")
    }
}
