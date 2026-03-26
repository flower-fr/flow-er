import View from "../View.js"

export default class ListHeader extends View
{
    constructor({ controller, rows, order, limit, properties, translations }) {
        super({ controller })
        this.rows = rows
        this.order = order
        this.limit = limit
        this.properties = properties
        this.translations = translations

        let direction = "+"
        if (this.order[0] === "-") {
            direction = "-"
            this.order = this.order.substring(1)
        }
        this.direction = direction
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
            html.push(`
            <th>
                ${ (property.anchor) ? `<button type="button" class="btn btn-link fl-list-order-button" data-fl-property="${propertyId}" ${ (propertyId === this.order) ? `data-fl-direction="${this.direction}"` : "" } data-mdb-ripple-init data-mdb-ripple-color="dark">` : "<div>" }
                    <span class="fl-modal-list-header-label">
                        ${ property.label }
                        ${ (propertyId === this.order) ? `<i class="fas ${ (this.direction == "+") ? "fa-arrow-down-short-wide" : "fa-arrow-down-wide-short" }"></i>` : "" }
                    </span>
                ${ (property.anchor) ? "</button>" : "</div>" }
            </th>`)
        }

        return html.join("\n")
    }

    trigger = () => {}
}
