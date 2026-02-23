class ListHeader
{
    constructor({ context, rows, order, limit, config, properties }) {
        this.context = context
        this.rows = rows
        this.order = order
        this.limit = limit
        this.config = config
        this.properties = properties

        let direction = "+"
        if (this.order[0] === "-") {
            direction = "-"
            this.order = this.order.substring(1)
        }
        this.direction = direction
    }

    render = () =>
    {
        const result = []

        result.push(`
            <th>
                <div class="text-center">
                    <small>
                        <b class="fl-list-count" title="${ this.context.translate("Lines number") }"></b>
                        <br><b class="fl-list-sum" title="${ this.context.translate("Sum") }"></b>
                    </small>
                </div>
            </th>
            <th />`)

        for (const [propertyId, property] of Object.entries(this.properties)) {
            result.push(`
            <th>
                ${ (property.options.anchor) ? `<button type="button" class="btn btn-link fl-list-order-button" data-fl-property="${propertyId}" ${ (propertyId === this.order) ? `data-fl-direction="${this.direction}"` : "" } data-mdb-ripple-init data-mdb-ripple-color="dark">` : "<div>" }
                    <span class="fl-modal-list-header-label">
                        ${ this.context.localize(property.labels) }
                        ${ (propertyId === this.order) ? `<i class="fas ${ (this.direction == "+") ? "fa-arrow-down-short-wide" : "fa-arrow-down-wide-short" }"></i>` : "" }
                    </span>
                ${ (property.options.anchor) ? "</button>" : "</div>" }
            </th>`)
        }

        return result.join("\n")
    }

    trigger = () => {
    }
}

export { ListHeader }
