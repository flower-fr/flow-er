import View from "../View.js"
import ListCell from "./ListCell.js"

export default class ListRow extends View
{
    constructor({ i, controller, list, row, filledColumns, params, properties, orderProperty, summable, translations }) {
        super({ controller })
        this.list = list
        this.i = i
        this.row = row
        this.filledColumns = filledColumns
        this.properties = properties
        this.orderProperty = orderProperty
        this.summable = summable
        this.translations = translations
        this.listCells = []

        this.listRowColumns = []

        const grouping = properties[orderProperty].group
        if (grouping) {
            if (this.filledColumns.includes(orderProperty)) {
                const property = properties[orderProperty]
                this.listCells.push(new ListCell({ controller, list, listRow: this, row, propertyId: orderProperty, property, orderProperty, translations }))
            }
        }

        for (const [propertyId, property] of Object.entries(properties)) {
            if (propertyId !== orderProperty || !grouping) {
                if (this.filledColumns.includes(propertyId)) {
                    this.listCells.push(new ListCell({ controller, list, listRow: this, row, propertyId, params, property, orderProperty, translations }))
                }
            }
        }
    }

    initialize = async () => {}

    render = () =>
    {
        const html = [], i = this.i, { row, properties, translations } = this
        let rowClass
        for (const [propertyId, property] of Object.entries(properties)) {
            if (property.type === "select") {
                rowClass = Object.entries(property.modalities).find(([mod, spec]) => spec.rowClass && row[propertyId] === mod)
                if (rowClass) this.rowClass = rowClass[1].rowClass
            }
        }

        html.push(`
        <tr class="listRow">
            <td>
                <div class="text-center">
                    <input type="checkbox" id="flListCheck-${ i }"></input>
                </div>
            </td>

            <td class="text-center">
                <a 
                    href="#!"
                    class="text-primary"
                    id="flListDetail-${ row.id }"
                    title="${ translations["Detail"] }"
                >
                    <i class="fas fa-search"></i>
                </a>
                <a
                    href="#!"
                    id="flListTooltip-${ row.id }"
                >
                    <small><i class="fas fa-circle-exclamation me-md-2"></i></small>
                </a>
            </td>

            ${ this.listCells.map(cell => cell.render()).join("\n") }

        </tr>`)

        return html.join("\n")
    }

    trigger = () => {
        // const { row } = this
        // const tooltip = $(`#flListTooltip-${ row.id }`)
        // if (tooltip) new mdb.Tooltip(tooltip, { html: true, placement: "right" })

    }
}
