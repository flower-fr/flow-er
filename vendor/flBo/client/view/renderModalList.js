const renderModalList = ({ context, entity, view }, data) => {

    console.log("in renderModalList (flBo)")

    const section = (data.section) ? data.section : {}, rows = data.rows, order = data.order, limit = data.limit, modalListConfig = data.config, properties = data.properties

    const html = []

    if (section.links) {
        const links = []
        for (const link of section.links) {
            links.push(`<a role="button" class="fl-modal-list-link" data-fl-tab="${ link.tab }">${ context.localize(link.labels) }</a>`)
        }

        html.push(`
        <div class="row">${ links.join("/n") }</div>`)
    }

    html.push(`
    <div class="row">

            ${renderModalListHeader({ context }, section, modalListConfig, properties, order)}

            <tbody class="table-group-divider" id="flModalListBody">

            ${ (section.disposition != "ascending" ) 
        ? `     <tr class="fl-modal-list-form">
        
                    ${renderModalListForm({ context }, section, data.id, modalListConfig, data.where, properties)}
        
                </tr>
                <tr class="fl-modal-list-row">
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-add-button" title="${context.translate("Add")}" id="flModalListAddButton" data-mdb-ripple-init>
                            <span class="fas fa-plus"></span>
                        </button>
                    </td>
                    <td colspan="${ Object.entries(properties).length }" />
                </tr>
`
        : "" }

                ${renderModalListRows({ context, entity: data.entity }, section, data.id, modalListConfig, properties, rows)}
            
            </tbody>`)
        
    let sum = 0
    for (const row of rows) {
        for (const [propertyId, property] of Object.entries(properties)) {
            if (property.options.sum) sum += parseFloat(row[propertyId])
        }
    }

    html.push(`
            <tfoot>`)

    if (section.sum) {
        html.push(`
                <tr>
                    <th />`)

        for (const [propertyId, property] of Object.entries(properties)) {
            if (property.type != "hidden" && Object.keys(property).length > 0) {
                html.push(`
                    <th>${ ((property.options.sum)) ? `${ sum.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) }€` : "" }</th>`)
            }
        }
        
        html.push("</tr>")
    }

    if (section.disposition == "ascending" ) {
        html.push(`
                <tr class="fl-modal-list-row">
                    <td class="text-center">
                        <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-add-button" title="${context.translate("Add")}" id="flModalListAddButton" data-mdb-ripple-init>
                            <span class="fas fa-plus"></span>
                        </button>
                    </td>
                    <td colspan="${ Object.entries(properties).length }" />
                </tr>
                <tr class="fl-modal-list-form">
                
                    ${renderModalListForm({ context }, section, data.id, modalListConfig, data.where, properties)}
        
                </tr>`)
    }

    html.push(`
            </tfoot>

        </table>
    </div>`)

    return html.join("\n")
}
