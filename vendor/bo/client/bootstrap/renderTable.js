const renderTable = ({ context, entity, view }, data) => {

    const rows = data.rows, limit = data.limit, listConfig = data.config, properties = data.properties

    const result = []

    result.push(`
    <div class="row">
        <div class="table-responsive">
            <div class="col-md-12">
                <table class="table table-sm table-hover" id="listPanel">
                    <thead class="table-light"><th /><th />
                        ${ renderTableHeaders({ context, entity, view }, properties) }
                    </thead>
                    <tbody class="table-group-divider" id="listParent">`)

    result.push(`
        <tr>
            <td>
                <div class="text-center">
                    <input type="checkbox" class="listCheckAll" data-toggle="tooltip" data-placement="top" title="${context.translate("Check all")}"></input>
                </div>
            </td>

            <td class="text-center"}">
                <button type="button" class="btn btn-sm btn-outline-primary index-btn listDetailButton" data-bs-toggle="modal" data-bs-target="#listDetailModalForm" title="${context.translate("Add")}" id="listDetailButton-0">
                    <span class="fas fa-plus"></span>
                </button>
            </td>

            <td colspan="${Object.keys(properties).length}" />
        </tr>`)

    result.push(renderRows(context, listConfig, properties, rows))

    result.push(`
        <tr class="listRow">
            <td>
                <div class="text-center">
                    <input type="checkbox" class="listCheckAll" title="${context.translate("Check all")}"></input>
                </div>
            </td>

            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-primary index-btn listGroupButton" data-toggle="tooltip" data-placement="top" title="${context.translate("Grouped actions")}" id="listGroupButton-1">
                    <span class="fas fa-list"></span>
                </button>
                ${(rows.length == limit) ? `
                    <button type="button" class="btn btn-sm btn-outline-primary listMoreButton" data-toggle="tooltip" data-placement="top" title="${context.translate("Display the entire list")}">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>`
                    : ""}
            </td>

            <td colspan="${Object.keys(properties).length - 1}" />
        </tr>`)

    result.push(`
                        </tbody>
                    </table>
                </div>
            </div>
        </div>`)
    
    return result.join("\n")
}

const renderTableHeaders = ({ context, entity, view }, properties) => {

    const result = []

    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]

        result.push(`<th>${ context.localize(property.labels) }</th>`)
    }

    return result.join("\n")
}