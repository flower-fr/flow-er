const renderModalListForm = ({ context }, section, id, modalListConfig, where, properties) => {

    const html = []

    html.push(`
        <td class="text-center">
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-modal-list-close-button" id="flModalListCloseButton" data-mdb-ripple-init>
                <span class="fas fa-close"></span>
            </button>
        </td>`)

    for (const [propertyId, property] of Object.entries(properties)) {
        const options = property.options
        const label = (options && options.labels) ? context.localize(options.labels) : ((property.labels) ? context.localize(property.labels) : "")
        const propertyType = (options && options.type) ? options.type : property.type
        const disabled = (options && options.disabled) ? "disabled" : ""
        const required = (options && options.required) ? "required" : ""
        const modalities = (options.modalities) ? property.options.modalities : property.modalities

        let value = (where[propertyId]) ? where[propertyId] : ""
        if (Array.isArray(value) && value.length == 1) value = value[0]
        if (options.value && !Array.isArray(options.value)) {
            value = options.value
            if (value == "?id") value = id
            else if (value.substring(0, 6) == "today") {
                if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                else if (property.type == "datetime") value = moment().format("YYYY-MM-DD HH:mm:ss")    
                else value = moment().format("YYYY-MM-DD")        
            }
        }
        console.log(propertyId, value)

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
                        <select class="form-select form-select-sm fl-modal-list-add-select" data-mdb-select-init="" id="${propertyId}" ${(multiple) ? "multiple" : ""} ${ disabled } ${ required }>
                            ${ (required == "") ? "<option />" : "" }`
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
                        <input class="form-control form-control-sm fl-modal-list-add-datalist" id="${propertyId}" list="updateDataList-${propertyId}" placeholder="${ context.translate("Search") }" ${ required } />
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
                    `<select class="fl-modal-list-add-select" data-mdb-select-init id="${propertyId}" ${ required } ${ disabled }>
                            ${ (required == "") ? "<option />" : "" }`
                )

                const attributes = {}
                for (const modality of modalities) {
                    const modalityId = modality.id
                    let label = []
                    const format = property.format[0].split("%s"), args = property.format[1].split(",")
                    for (let i = 0; i <= args.length; i++) {
                        if (i != 0) {
                            const config = context.config[`${property.entity}/property/${args[i-1]}`]
                            let value = modality[args[i-1]]
                            if (config && config.type == "percentage") value = `${ parseFloat(value) * 100 }%`
                            label.push(value)
                        }
                        label.push(format[i])
                    }
                    for (const key of (property.options.attributes) ? (property.options.attributes) : []) {
                        if (!attributes[key]) attributes[key] = []
                        attributes[key].push(`${modalityId}:${modality[key]}`)
                    }
                    html.push(`<option value="${modalityId}" ${ (value == modalityId) ? "selected" : "" }>${label.join("")}</option>`)
                }

                html.push(
                    `       </select>
                        <label class="form-label select-label">${label}</label>`
                )

                for (const [key, value] of Object.entries(attributes)) {
                    html.push(`<input type="hidden" id="${propertyId}-${key}" value="${ value.join("|") }" />`)
                }
            }

            else if (["date"].includes(property.type)) {
                html.push(`<div class="form-outline fl-modal-list-add-date-outline" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm fl-modal-list-add-date" id="${propertyId}" value="${context.decodeDate(value)}" ${ disabled } ${ required } placeholder="DD/MM/YYYY" autocomplete="off" />
                        <label class="form-label">${label}</label>
                    </div>`)
            }

            else if (["datetime"].includes(property.type)) {
                html.push(`<div class="form-outline fl-modal-list-add-date-outline" data-mdb-datetimepicker-init data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm fl-modal-list-add-date" id="${propertyId}" value="${ moment(value).format("DD/MM/YYYY HH:mm:ss") }" ${ disabled } ${ required } placeholder="DD/MM/YYYY" autocomplete="off" />
                        <label class="form-label">${label}</label>
                    </div>`)
            }

            else if (property.type == "number") {
                html.push(`
                    <div class="form-outline fl-modal-list-add-form-outline" data-mdb-input-init>
                        <div class="form-outline fl-modal-list-add-form-outline" data-mdb-input-init>
                            <input class="form-control form-control-sm is-valid fl-modal-list-add-input" id="${propertyId}" value="${value}" ${ disabled } ${ required } />
                            <label class="form-label">${label}</label>
                        </div>
                    </div>`)
            }

            else if (property.type == "percentage") {
                html.push(`<div class="form-outline fl-modal-list-add-form-outline" data-mdb-input-init>
                    <div class="form-outline fl-modal-list-add-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-list-add-input" data-fl-type="percentage" id="${propertyId}" value="${value}" ${ disabled } ${ required } />
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

    /**
     * Rules
     */

    for (const [target, rule] of Object.entries((section.rules) ? section.rules : {})) {
        html.push(`<input type="hidden" class="fl-modal-rule" data-fl-target="${ target }" data-fl-function="${ rule.function }" data-fl-params="${ rule.params.join(",") }" />`)
    }

    return html.join("\n")
}