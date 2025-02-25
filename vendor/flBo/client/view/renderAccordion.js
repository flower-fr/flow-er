const renderAccordion = ({ context, entity, view }, data) => {

    console.log("In renderAccordion(flBo)")

    const rows = data.rows, crossRows = data.crossRows, orderParam = data.order, limit = data.limit, listConfig = data.config, properties = data.properties, crossProperties = data.crossProperties
    
    const html = []

    html.push(`
    <div class="accordion accordion-flush" id="accordion">`)

    html.push(`
        ${renderAccordionRows({ context, entity }, listConfig, properties, rows, crossProperties, crossRows)}`)

    html.push(`
    </div>`)

    return html.join("\n")
}

const renderAccordionRows = ({ context, entity }, listConfig, properties, rows, crossProperties, crossRows) => {

    const files = {}
    for (const row of rows) {
        if (!files[row.id]) files[row.id] = { "type": row.type, "designation": row.designation, "status": row.status, "rows": [] }
    }

    for (const row of crossRows) {
        if (!files[row.case_id]) files[row.case_id] = { "type": row.case_type, "designation": row.designation, "status": row.case_status, "rows": [] }
        files[row.case_id].rows.push(row)
    }

    const result = []

    result.push(`
        <div class="accordion-item">
            <h2 class="accordion-header" id="heading-0">
                <a role="button" class="btn btn-sm btn-outline-primary index-btn fl-list-detail fl-list-add" title="${context.translate("Add")}" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#flListDetailModalForm" data-fl-controller="bo" data-fl-action="detail" data-fl-entity="${entity}" data-id="0">
                    <span class="fas fa-plus"></span>
                </a>
            </h2>
        </div>`)

    for (const [case_id, file] of Object.entries(files)) {

        result.push(`
            <div class="accordion-item">
                <h2 class="accordion-header" id="heading-${case_id}">
                <button 
                    data-mdb-collapse-init 
                    class="accordion-button collapsed" 
                    type="button"
                    data-mdb-target="#collapse-${case_id}"
                    aria-expanded="false"
                    aria-controls="collapse-${case_id}"
                >
                    <strong>${ file.designation }</strong>: ${ context.localize(properties.type.modalities[file.type]) } (${ file.status })
                </button>
                </h2>
                <div id="collapse-${case_id}" class="accordion-collapse collapse" aria-labelledby="heading-${case_id}" data-mdb-parent="#accordion">
                    <div class="accordion-body">
                        <div>
                            <a role="button" class="fl-list-detail fl-list-add" title="${context.translate("Add")}" data-mdb-ripple-init data-mdb-modal-init data-mdb-target="#flListDetailModalForm" data-fl-controller="bo" data-fl-action="detail" data-fl-entity="${listConfig.crossEntity}" data-id="0">
                                <span class="fas fa-plus"></span>
                            </a>
                        </div>`)
    
                    
        for (const row of file.rows) {

            const checkData = []
            if (listConfig && listConfig.checkData) {
                for (let propertyId of listConfig.checkData) {
                    checkData.push(`${propertyId}:${row[propertyId]}`)
                }
            }

            result.push(renderHidden(context, listConfig, properties, row))

            result.push(`
                        <div>
                            <a role="button" class="fl-list-detail" data-mdb-target="#flListDetailModalForm" data-mdb-modal-init title="${context.translate("Detail")}" data-fl-controller="bo" data-fl-action="detail" data-fl-entity="${listConfig.crossEntity}" data-id="${row.id}">
                                <i class="fas fa-search"></i>&nbsp;&nbsp;<strong>${ row.n_fn }</strong> (${ context.localize(crossProperties.role.modalities[row.role]) })
                            </a>
                        </div>`)
        }

        result.push(`
                    </div>
                </div>
            </div>`)
    }

    return result.join("\n")
}
