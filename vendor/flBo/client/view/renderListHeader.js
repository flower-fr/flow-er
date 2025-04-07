const renderListHeader = ({ context }, listConfig, properties, order = "-touched_by") => {

    let direction = "+"
    if (order[0] == "-") {
        direction = "-"
        order = order.substring(1)
    }

    const result = []

    result.push(`
        <th>
            <div class="text-center">
                <small>
                    <b class="fl-list-count" title="${ context.translate("Lines number") }"></b>
                    <br><b class="fl-list-sum" title="${ context.translate("Sum") }"></b>
                </small>
            </div>
        </th>
        <th />`)

    for (let [propertyId, property] of Object.entries(properties)) {
        console.log(propertyId, property)
        result.push(`
        <th>
            ${ (property.options.anchor) ? `<button type="button" class="btn btn-link fl-list-order-button" data-fl-property="${propertyId}" ${ (propertyId == order) ? `data-fl-direction="${direction}"` : "" } data-mdb-ripple-init data-mdb-ripple-color="dark">` : "<div>" }
                <span class="fl-modal-list-header-label">
                    ${ context.localize(property.labels) }
                    ${ (propertyId == order) ? `<i class="fas ${ (direction == "+") ? "fa-arrow-down-short-wide" : "fa-arrow-down-wide-short" }"></i>` : "" }
                </span>
            ${ (property.options.anchor) ? "</button>" : "</div>" }
        </th>`)
    }

    return result.join("\n")
}
