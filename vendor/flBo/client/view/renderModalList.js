const renderModalList = ({ context, entity, view }, data) => {

    const rows = data.rows, orderParam = data.orderParam, limit = data.limit, modalListConfig = data.config, properties = data.properties

    return `
    <div class="row mt-3">
        <div class="table-responsive">
            <table class="table table-sm">
                <thead class="datatable-header">
                    ${renderModalListHeader({ context }, properties)}
                </thead>
                <tbody class="table-group-divider">
                
                    ${renderModalListRows({ context, entity: data.entity }, modalListConfig, properties, rows)}

                </tbody>
            </table>
        </div>
    </div>`

}

const renderModalListHeader = ({ context }, properties) => {

    const head = []

    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        if (Object.keys(property).length > 0) {
            head.push(`<th scope="col">
                <div id="modalListSortAnchor-${propertyId}">
                    <span class="fl-modal-list-header-label" id="flModalListHeaderLabel-${propertyId}">${ context.localize(property.labels) }</span>
                </div>
            </th>`)
        }
    }

    return head.join("\n")
}

const renderModalListRows = ({ context }, modalListConfig, properties, rows) => {

    const result = []

    result.push(`
        <tr>

            ${renderModalListForm({ context }, {}, properties)}

        </tr>`)

    for (const row of rows) {

        result.push(`
        <tr>

            ${renderModalListProperties({ context }, row, properties)}

        </tr>`)
    }

    return result.join("\n")
}

const renderModalListProperties = ({ context }, row, properties) => {

    const html = []

    for (const [propertyId, property] of Object.entries(properties)) {

        if (Object.keys(property).length > 0) {

            if (property.type == "select") {
                html.push(`<td class="${(property.options.class) ? property.options.class[row[propertyId]] : "" }">
                    ${(row[propertyId]) ? context.localize(property.modalities[row[propertyId]]) : ""}
                </td>`)
            }
            
            else if (property.type == "multiselect") {
                const captions = []
                for (let modalityId of row[propertyId].split(",")) {
                    captions.push(context.localize(property.modalities[modalityId]))
                }
                html.push(`<td>${captions.join(",")}</td>`)                  
            }

            else if (property.type == "date") {
                let classe
                if (row[propertyId] == "9999-12-31") classe = "info"
                else if (row[propertyId] < "2024-09-01") classe = "success"
                else classe = "danger"
                html.push(`<td>${ context.decodeDate(row[propertyId]) }</td>`)
            }
        
            else if (property.type == "datetime") {
                html.push(`<td>${context.decodeTime(row[propertyId])}</td>`)
            }

            else if (property.type == "number") {
                html.push(`<td class="text-right">${ parseFloat(row[propertyId]).toLocaleString("fr-FR", { minimumFractionDigits: 2 }) }</td>`)
            }

            else if (property.type == "email") {
                html.push(`<td>${(row[propertyId]) ? `<a href="mailto:${row[propertyId]}">${row[propertyId]}</a>` : ""}</td>`)
            }              

            else if (property.type == "phone") {
                html.push(`<td><a href="tel:${row[propertyId]}">${row[propertyId]}</a></td>`)
            }

            else if (property.type == "tags") {
                html.push(`<td class="fl-list-tags-name" id="flListTagsName-${propertyId}-${row.id}">${row[propertyId]}</td>`)
            }

            else {
                html.push(`<td>${(row[propertyId] !== null) ? row[propertyId] : ""}</td>`)                  
            }
        }
    }
    return html.join("\n")
}

const renderModalListForm = ({ context }, row, properties) => {

    const html = []

    for (let propertyId of Object.keys(properties)) {
        const property = properties[propertyId]
        const options = property.options
        const label = (options.labels) ? context.localize(options.labels) : context.localize(property.labels)
        const propertyType = (options.type) ? options.type : property.type
        const readonly = (property.options.readonly) ? "readonly" : ""
        const required = (property.options.required) ? "required" : ""
        const modalities = (property.options.modalities) ? property.options.modalities : property.modalities

        let value = (row[propertyId]) ? row[propertyId] : ""
        if (options.value && !Array.isArray(options.value)) {
            value = options.value
            if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
            else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
            else value = moment().format("YYYY-MM-DD")    
        }

        if (Object.keys(property).length > 0) {

            html.push("<td>")

            const multiple = property.multiple

            /**
             * Select
             */

            if (propertyType == "select") {
                html.push(`<div class="form-outline">
                        <select class="fl-modal-list-add-select" data-mdb-select-init id="${propertyId}" ${(multiple) ? "multiple" : ""} ${ readonly } ${ required }>
                            <option />`
                )

                for (let key of Object.keys(modalities)) {
                    const labels = modalities[key]
                    if (!labels.archive) {
                        html.push(`<option value="${key}" ${(labels.archive) ? "disabled" : ""}>${context.localize(labels)}</option>`)
                    }
                }

                html.push(
                    `       </select>
                        <label class="form-label select-label">${label}</label>
                    </div>`)
            }

            /**
             * Tag
             */

            else if (propertyType == "tag") {

                html.push(
                    `<div class="form-outline" data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm fl-modal-list-add-datalist" id="${propertyId}" list="updateDataList-${propertyId}" placeholder="${ context.translate("Search") }" />
                        <datalist id="flModalListDataList-${propertyId}">
                            <option value="-- ${ context.translate("Erase") } --" data-id="0" id="datalist-${propertyId}-0"></option>`)

                for (let tag of property.tags) {
                    html.push(`<option value="${tag.name}" data-id="${tag.id}" id="flDatalist-${propertyId}-${tag.id}"></option>`)
                }

                html.push(
                    `    </datalist>
                        <label class="form-label">${label}</label>
                    </div>`
                )
            }

            /**
             * Source
             */

            else if (propertyType == "source") {

                html.push(
                    `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="form-outline">
                        <select class="fl-modal-list-add-select" data-mdb-select-init id="${propertyId}" ${(required) } ${(readonly) }>
                            <option />`
                )

                for (let modalityId of Object.keys(modalities)) {
                    const modality = modalities[modalityId]
                    html.push(`<option value="${modalityId}" ${(value == modalityId) ? "selected" : ""}>${modality}</option>`)
                }

                html.push(
                    `       </select>
                        <label class="form-label select-label">${label}</label>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>
                </div>`
                )
            }

            else if (["date", "datetime"].includes(property.type)) {
                html.push(` <div class="form-outline dateOutline" ${(propertyType == "datetime" ? "data-mdb-datetimepicker-init" : "data-mdb-datepicker-init")} data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm fl-modal-list-add-date" id="${propertyId}" value="${context.decodeDate(value)}" ${ readonly } ${ required } placeholder="DD/MM/YYYY" autocomplete="off" />
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>`)
            }

            else if (property.type == "number") {
                html.push(`<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-list-add-input" id="${propertyId}" value="${value}" ${ readonly } ${ required } maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`)
            }

            else if (property.type == "email") {
                html.push(` <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-list-add-email" id="${propertyId}" value="${value}" ${ readonly } ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${context.translate("Invalid")}</div>
                    </div>`)
            }              

            else if (property.type == "phone") {
                html.push(`<div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-list-add-phone" id="${propertyId}" value="${value}" ${ readonly } ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>`)
            }

            else {
                html.push(`<div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-list-add-input" id="${propertyId}" value="${value}" ${ readonly } ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>`)                  
            }

            html.push("</td>")
        }
    }

    return html.join("\n")
}