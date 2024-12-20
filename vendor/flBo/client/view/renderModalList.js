const renderModalList = ({ context, entity, view }, data) => {

    const rows = data.rows, orderParam = data.orderParam, limit = data.limit, modalListConfig = data.config, properties = data.properties

    const html = []
    html.push(`
    <div class="row mt-3">
        <div class="table-responsive">

            <!-- Form status messages -->

            <div class="fl-modal-list-message" id="flModalListMessageOk">
                <h5 class="alert alert-success my-3 text-center">${context.translate("Your request has been registered")}</h5>
            </div>

            <div class="fl-modal-list-message" id="flModalListMessageExpired">
                <h5 class="alert alert-danger my-3 text-center">${context.translate("The form has expired, please input again")}</h5>
            </div>

            <div class="fl-modal-list-message" id="flModalListMessageConsistency">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The database has evolved in the meantime, please input again")}</h5>
            </div>

            <div class="fl-modal-list-message" id="flModalListMessageDuplicate">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The data already exists")}</h5>
            </div>

            <div class="fl-modal-list-message" id="flModalListMessageServerError">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("A technical error has occured. PLease try again later")}</h5>
            </div>

            <form class="was-validated row g-4" id="flModalListAddForm">
                <table class="table table-sm">
                    <thead class="datatable-header">
                        ${renderModalListHeader({ context }, modalListConfig, properties)}
                    </thead>
                    <tbody class="table-group-divider">
                    
                        ${renderModalListRows({ context, entity: data.entity }, data.id, modalListConfig, properties, rows)}

                    </tbody>
                </table>
                <div class="form-group row fl-submit-div">
                    <div>
                        <input type="submit" id="flModalListAddSubmit" class="btn btn-warning mt-3 fl-Modal-List-submit" value="${ context.localize(data.config.post.labels) }" data-controller=${data.config.post.controller} data-action=${data.config.post.action} data-entity=${data.config.post.entity}>
                    </div>
                </div>
            </form>
        </div>
    </div>`)

    return html.join("\n")
}

const renderModalListHeader = ({ context }, modalListConfig, properties) => {

    const head = []

    head.push("<th />")

    for (let propertyId of Object.keys(modalListConfig.properties)) {
        const property = properties[propertyId]
        if (property.type != "hidden" && Object.keys(property).length > 0) {
            head.push(`<th scope="col">
                <div id="modalListSortAnchor-${propertyId}">
                    <span class="fl-modal-list-header-label" id="flModalListHeaderLabel-${propertyId}">${ context.localize(property.labels) }</span>
                </div>
            </th>`)
        }
    }

    return head.join("\n")
}

const renderModalListRows = ({ context }, id, modalListConfig, properties, rows) => {

    const result = []

    result.push(`
        <tr>

            ${renderModalListForm({ context }, id, modalListConfig, {}, properties)}

        </tr>`)

    for (const row of rows) {

        result.push(`
        <tr class="fl-modal-list-row">

            ${renderModalListProperties({ context }, modalListConfig, row, properties)}

        </tr>`)
    }

    return result.join("\n")
}

const renderModalListProperties = ({ context }, modalListConfig, row, properties) => {

    const html = []

    html.push("<td />")

    for (const propertyId of Object.keys(modalListConfig.properties)) {
        const property = properties[propertyId]

        if (property.type != "hidden" && Object.keys(property).length > 0) {

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
                html.push(`<td>${ moment(row[propertyId]).format("DD/MM/YYYY") }</td>`)
            }
        
            else if (property.type == "datetime") {
                html.push(`<td>${ moment(row[propertyId]).format("DD/MM/YYYY HH:mm:ss") }</td>`)
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

const renderModalListForm = ({ context }, id, modalListConfig, row, properties) => {

    const html = []

    html.push(`
            <td class="text-center">
                <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-add-button" title="${context.translate("Add")}" id="flModalListAddButton" data-mdb-ripple-init>
                    <span class="fas fa-plus"></span>
                </button>
                <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-close-button" title="${context.translate("Add")}" id="flModalListCloseButton" data-mdb-ripple-init>
                    <span class="fas fa-close"></span>
                </button>
            </td>`)

    for (const propertyId of Object.keys(modalListConfig.properties)) {
        const property = properties[propertyId]
        const options = property.options
        const label = (options && options.labels) ? context.localize(options.labels) : ((property.labels) ? context.localize(property.labels) : "")
        const propertyType = (options && options.type) ? options.type : property.type
        const disabled = (options && options.disabled) ? "disabled" : ""
        const required = (options && options.required) ? "required" : ""
        const modalities = (options.modalities) ? property.options.modalities : property.modalities

        let value = (row[propertyId]) ? row[propertyId] : ""
        if (options.value && !Array.isArray(options.value)) {
            value = options.value
            if (value == "?id") value = id
            if (value.substring(0, 6) == "today") {
                if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                else if (property.type == "datetime") value = moment().format("YYYY-MM-DD HH:mm:ss")    
                else value = moment().format("YYYY-MM-DD")        
            }
        }

        if (Object.keys(property).length > 0) {

            if (propertyType == "hidden") {
                html.push(`<input type="hidden" class="fl-modal-list-add-input" id="${propertyId}" value="${value}" />`)
                continue
            }

            html.push("<td>")

            const multiple = property.multiple

            /**
             * Select
             */

            if (propertyType == "select") {
                html.push(`<div class="form-outline">
                        <select class="form-select form-select-sm fl-modal-list-add-select" data-mdb-select-init="" id="${propertyId}" ${(multiple) ? "multiple" : ""} ${ disabled }>
                            ${ (!required) ? "<option />" : "" }`
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
                        <select class="fl-modal-list-add-select" data-mdb-select-init id="${propertyId}" ${(required) } ${(disabled) }>
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

            else if (["date"].includes(property.type)) {
                html.push(`<div class="form-outline fl-modal-list-add-date-outline data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm fl-modal-list-add-date" id="${propertyId}" value="${context.decodeDate(value)}" ${ disabled } ${ required } placeholder="DD/MM/YYYY" autocomplete="off" />
                        <label class="form-label">${label}</label>
                    </div>`)
            }

            else if (["datetime"].includes(property.type)) {
                html.push(`<div class="form-outline fl-modal-list-add-date-outline data-mdb-datetimepicker-init data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm fl-modal-list-add-date" id="${propertyId}" value="${ moment(value).format("DD/MM/YYYY HH:mm:ss") }" ${ disabled } ${ required } placeholder="DD/MM/YYYY" autocomplete="off" />
                        <label class="form-label">${label}</label>
                    </div>`)
            }

            else if (property.type == "number") {
                html.push(`<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }">
                    <div class="form-outline fl-modal-list-add-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-list-add-input" id="${propertyId}" value="${value}" ${ disabled } ${ required } maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`)
            }

            else if (property.type == "email") {
                html.push(` <div class="form-outline fl-modal-list-add-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-list-add-email" id="${propertyId}" value="${value}" ${ disabled } ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                    </div>`)
            }              

            else if (property.type == "phone") {
                html.push(`<div class="form-outline fl-modal-list-add-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-list-add-phone" id="${propertyId}" value="${value}" ${ disabled } ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                    </div>`)
            }

            else {
                html.push(`<div class="form-outline fl-modal-list-add-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-list-add-input" id="${propertyId}" value="${value}" ${ disabled } ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                    </div>`)                  
            }

            html.push("</td>")
        }
    }

    return html.join("\n")
}