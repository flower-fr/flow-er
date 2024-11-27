const renderTable = ({ context, entity, view }, data) => {

    const listConfig = data.listConfig, properties = data.properties
    
    const result = []

    result.push(`
    <div class="row">
        <div class="table-responsive">
            <div class="col-md-12">
                <table class="table table-sm table-hover" id="listPanel">
                    <thead class="table-light"><th></th><th />
                        ${ renderTableHeaders({ context, entity, view }, listConfig, properties) }
                    </thead>
                    <tbody class="table-group-divider" id="flListParent"></tbody>
                </table>
            </div>
        </div>
    </div>`)

    return result.join("\n")
}

const renderTableHeaders = ({ context }, listConfig, properties) => {

    const result = []

    for (let propertyId of Object.keys(listConfig.properties)) {
        const property = properties[propertyId]

        result.push(`<th>${ context.localize(property.labels) }</th>`)
    }

    return result.join("\n")
}

module.exports = {
    renderTable
}
