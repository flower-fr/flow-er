import { ModalListHeader } from "./ModalListHeader.js"
import { ModalListForm } from "./ModalListForm.js"
import { ModalListRow } from "./ModalListRow.js"

class ModalList
{
    constructor({ context, entity, view, id, section, rows, where, order, limit, config, properties })
    {
        this.context = context
        this.entity = entity
        this.view = view
        this.id = id
        this.section = section
        this.rows = rows
        this.where = where
        this.order = order
        this.limit = limit
        this.config = config
        this.properties = properties
        this.modalListHeader = new ModalListHeader({ context, section, properties, order })
        this.modalListForm = new ModalListForm({ context, section, properties, where, id })
        this.modalListRows = []
        for (const row of this.rows) {
            this.modalListRows.push(new ModalListRow({ context, entity, section, config, properties, row }))
        }
    }

    render = () =>
    {
        const context = this.context, entity = this.entity, id = this.id, section = this.section, rows = this.rows, where = this.where, order = this.order, limit = this.limit, modalListConfig = this.config, properties = this.properties

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

                ${ this.modalListHeader.render() }

                <tbody class="table-group-divider" id="flModalListBody">

                ${ (section.disposition != "ascending" ) ? `     
                    ${ this.modalListForm.render() }
            
                    <tr class="fl-modal-list-row">
                        <td class="text-center">
                            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-add-button" title="${context.translate("Add")}" id="flModalListAddButton" data-mdb-ripple-init>
                                <span class="fas fa-plus"></span>
                            </button>
                        </td>
                        <td colspan="${ Object.entries(properties).length }" />
                    </tr>` : "" }`)

        for (const modalListRow of this.modalListRows) {
            html.push(modalListRow.render())
        }

        html.push(`                
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
                if (!["hidden", "textarea"].includes(property.type) && Object.keys(property).length > 0) {
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
                    ${ this.modalListForm.render() }`)
        }

        html.push(`
                </tfoot>

            </table>
        </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
    }
}

export { ModalList }