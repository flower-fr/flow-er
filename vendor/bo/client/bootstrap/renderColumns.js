/** 
 * List to render as cards dispatched by columns 
 */
const renderColumns = ({ context }, { config, properties, rows }) => {

    const pipe = {}

    for (let modality of config.distribution.modalities.split(",")) {
        pipe[modality] = { count: 0, sum : 0, rows: [] }
    }
    for (let row of rows) {
        if (pipe[row[config.distribution.variable]]) {
            pipe[row[config.distribution.variable]].count ++
            pipe[row[config.distribution.variable]].sum += parseFloat(row[config.distribution.sum])
            pipe[row[config.distribution.variable]].rows.push(row)    
        }
    }

    const result = ["<div class=\"row\">"]
    
    for (let key of Object.keys(pipe)) {
        const modality = pipe[key]
        const property = properties[config.distribution.variable]
        result.push(`<div class="col-md-3">
            <div class="card border-secondary">
                <div class="card-header text-center">
                    <strong>${modality.count} ${context.localize(property.modalities[key])}</strong> <em>(${modality.sum} €)</em>
                </div>
            </div>
            ${renderCards({ context }, { config, properties, rows: modality.rows })}
        </div>`)
    }

    result.push("</div>")
    return result.join("\n")
}

const renderCards = ({ context }, { config, properties, rows }) => {

    const result = []

    for (let row of rows) {
        result.push(`<div class="card mt-3" draggable="true">
            <div class="card-body">
                <div class=\"d-flex justify-content-between align-items-center mb-3\">
                    ${ renderLayout({ context }, { config: config.title, properties, row }) }
                    <button type="button" class="btn btn-sm btn-outline-primary index-btn listDetailButton" title="${context.translate("Detail")}" id="listDetailButton-${row.id}">
                    <i class="fas fa-search"></i>
                    </button>
                </div>
                <hr>
                ${renderLayout({ context }, { config: config.layout, properties, row })}
            </div>
        </div>`)
    }

    return result.join("\n")
}
