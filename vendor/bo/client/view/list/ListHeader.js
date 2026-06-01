import View from "../View.js"

export default class ListHeader extends View
{
    constructor({ controller, rows, order, limit, filledColumns, properties, orderProperty, orderDirection, translations, layout }) {
        super({ controller })
        this.rows = rows
        this.order = order
        this.limit = limit
        this.filledColumns = filledColumns
        this.properties = properties
        this.translations = translations
        this.layout = layout
        this.orderProperty = orderProperty
        this.orderDirection = orderDirection
        // let direction = "+"
        // if (this.order[0] === "-") {
        //     direction = "-"
        //     this.order = this.order.substring(1)
        // }
        // this.direction = direction
    }

    initialize = async () => {}

    render = () =>
    {
        const html = [], translations = this.translations

        html.push(`
            <th>
                <div class="text-center">
                    <small>
                        <b class="fl-list-count" title="${ translations["Lines number"] }"></b>
                        <br><b class="fl-list-sum" title="${ translations["Sum"] }"></b>
                    </small>
                </div>
            </th>
            <th />`)

        for (const [propertyId, property] of Object.entries(this.properties)) {
            if (this.filledColumns.includes(propertyId)) {
                html.push(`
                <th>
                    ${ (property.anchor) ? `<button type="button" class="btn btn-link" id="flListOrderButton-${propertyId}" data-mdb-ripple-init data-mdb-ripple-color="dark">` : "<div>" }
                        <span class="fl-modal-list-header-label">
                            ${ property.label }
                            ${ (propertyId === this.orderProperty) ? `<i class="fas ${ (this.orderDirection === "asc") ? "fa-arrow-down-short-wide" : "fa-arrow-down-wide-short" }"></i>` : "" }
                        </span>
                    ${ (property.anchor) ? "</button>" : "</div>" }
                </th>`)
            }
        }

        return html.join("\n")
    }

    trigger = () => {
        const { layout } = this
        for (const [propertyId, property] of Object.entries(this.properties)) {
            if (this.filledColumns.includes(propertyId) && property.anchor) {
                document.getElementById(`flListOrderButton-${propertyId}`).onclick = () => {
                    const direction = (propertyId === this.orderProperty && this.orderDirection === "asc") ? "desc" : "asc"
                    layout.refreshList({ orderProperty: propertyId, orderDirection: direction })
                }
            }
        }
    }
}
