import View from "../View.js"
import ListHeaderCell from "./ListHeaderCell.js"

export default class ListHeader extends View
{
    constructor({ controller, list, rows, order, limit, filledColumns, properties, orderProperty, orderDirection, translations, layout }) {
        super({ controller })
        this.list = list
        this.rows = rows
        this.order = order
        this.limit = limit
        this.filledColumns = filledColumns
        this.properties = properties
        this.translations = translations
        this.layout = layout
        this.orderProperty = orderProperty
        this.orderDirection = orderDirection
        this.headerCells = {}
        for (const [propertyId, property] of Object.entries(this.properties)) {
            if (this.filledColumns.includes(propertyId)) {
                this.headerCells[propertyId] = new ListHeaderCell({ controller, list, propertyId, property, orderProperty, orderDirection, translations, layout })
            }
        }
    }

    initialize = async () => {}

    render = () =>
    {
        const html = [], { properties, orderProperty, translations, headerCells } = this

        html.push(`
            <th>
                <div class="text-center">
                    <div class="text-center">
                        <input type="checkbox" id="flListCheckAllUp" data-toggle="tooltip" data-placement="top" title="${ translations["Check all"] }"></input>
                    </div>
                </div>
            </th>
            <th />`)

        const group = properties[orderProperty].group
        if (group) {
            if (this.filledColumns.includes(orderProperty)) {
                html.push(`
                <th>
                    <div>
                        ${ headerCells[orderProperty].render() }
                    </div>
                </th>`)
            }
        }

        for (const [propertyId, property] of Object.entries(this.properties)) {
            if (propertyId !== orderProperty || !group) {
                if (this.filledColumns.includes(propertyId)) {
                    html.push(`
                    <th>
                        ${ (property.anchor) ? `<button type="button" class="btn btn-link" id="flListOrderButton-${propertyId}" data-mdb-ripple-init data-mdb-ripple-color="dark">` : "<div>" }
                            ${ headerCells[propertyId].render() }
                        ${ (property.anchor) ? "</button>" : "</div>" }
                    </th>`)
                }
            }
        }

        return html.join("\n")
    }

    trigger = () => {
        const { properties, filledColumns, headerCells } = this
        for (const propertyId of Object.keys(properties)) {
            if (filledColumns.includes(propertyId)) {
                headerCells[propertyId].trigger()
            }
        }

    }
}
