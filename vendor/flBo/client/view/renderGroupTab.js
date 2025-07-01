const renderGroupTab = ({ context, entity }, section, properties, row, payload ) => {

    console.log("In renderGroupTab (flBo)")

    const html = []

    for (let propertyId of Object.keys(section.properties)) {
        const property = properties[propertyId]
        const options = property.options
        const propertyType = (options.type) ? options.type : property.type
        const label = propertyType !== "hidden" && ((options.labels) ? context.localize(options.labels) : context.localize(property.labels))
        const disabled = (property.options.readonly /* deprecated */ || property.options.disabled) ? "disabled" : ""
        const required = (options.mandatory) ? "required" : ""
        const modalities = (options.modalities) ? options.modalities : property.modalities

        let value = (row[propertyId]) ? row[propertyId] : ""
        if (!value && options.value && !Array.isArray(options.value)) {
            if (row[options.value]) value = row[options.value]
            else if (options.value && options.value.charAt(5) == "+") value = moment().add(options.value.substring(6), "days").format("YYYY-MM-DD")
            else if (options.value && options.value.charAt(5) == "-") value = moment().subtract(options.value.substring(6), "days").format("YYYY-MM-DD")
            //else value = options.value
        }

        if (options.change && !value) {

            html.push(`<input type="hidden" class="form-change" data-property-id="${propertyId}" value="mdb/groupTab/${entity}" />`)
        }

        /**
         * Consistency time property
         */

        if (options.consistency) {

            html.push(`<input type="hidden" id="touched_at" value="${value}" />`)
        }

        /**
         * Title
         */

        else if (propertyType == "title") {
            
            html.push(`<hr><h5 class="text-center mb-4">${label}</h5>`)
        }

        else if (propertyType == "hidden") {
            if (!value && options.value && !Array.isArray(options.value)) value = options.value
            html.push(`<input type="hidden" class="updateInput" id="${propertyId}" data-fl-property="${propertyId}" data-fl-type="input" value="${value}" />`)
        }

        /**
         * Input
         */

        else if (propertyType == "input") {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid updateInput" id="${propertyId}" value="${value}" data-fl-disabled="${ disabled }" ${ required } maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Email
         */

        else if (propertyType == "email") {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid updateEmail" id="${propertyId}" value="${value}" data-fl-disabled="${ disabled }" ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${context.translate("Invalid")}</div>
                    </div>
                </div>`
            )
        }

        /**
         * Phone
         */

        else if (propertyType == "phone") {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid updatePhone" id="${propertyId}" value="${value}" data-fl-disabled="${ disabled }" ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>
                </div>`
            )              
        }

        else if (propertyType == "sms") {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid updateInput fl-sms-text" id="${propertyId}" value="${value}" data-fl-template="flSmsTemplate-${propertyId}" data-fl-div="flSmsDiv-${propertyId}" data-fl-disabled="${ disabled }" ${ required } maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )

            html.push(`<input type="hidden" id="flSmsTemplate-${propertyId}" value="${ encodeURI("<p><i class=\"fas fa-message-alt\"></i></button>&nbsp;&nbsp;<button type=\"button\" class=\"btn btn-sm btn-outline-primary index-btn fl-sms-template\" {disabled} data-fl-addresses=\"{addresses}\" data-fl-body=\"{body}\">{addresses}</button>&nbsp;&nbsp;{text}</p>") }" />`)
            html.push(`<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } fl-submit-div" id="flSmsDiv-${propertyId}"></div>`)
        }

        else if (propertyType == "linkedin") {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <textarea class="form-control form-control-sm updateTextarea fl-linkedin-text" rows="5" id="${propertyId}" data-fl-template="flLinkedinTemplate-${propertyId}" data-fl-div="flLinkedinDiv-${propertyId}" data-fl-disabled="${ disabled }" ${ required }${label} maxlength="${(property.options.max_length) ? property.options.max_length : 2047}">${value}</textarea>
                        <label class="form-label">${ (required) ? "* " : "" }${label}</label>
                    </div>
                </div>`
            )
            html.push(`<input type="hidden" id="flLinkedinTemplate-${propertyId}" value="${ encodeURI("<p><i class=\"fas fa-message-alt\"></i>&nbsp;&nbsp;<a href=\"{addresses}\" target=\"_blank\" type=\"button\" class=\"btn btn-sm btn-outline-primary index-btn fl-linkedin-template\" {disabled} data-fl-addresses=\"{addresses}\" data-fl-body=\"{body}\">{addresses}</a>&nbsp;&nbsp;{text}</p>") }" />`)
            html.push(`<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } fl-submit-div" id="flLinkedinDiv-${propertyId}"></div>`)
        }
    
        /**
         * Date or datetime
         */

        else if (["date", "closing_date"].includes(propertyType)) {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3">
                    <div class="form-outline dateOutline" "data-mdb-datepicker-init" data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm updateDate" id="${propertyId}" value="${context.decodeDate(value)}" data-fl-disabled="${ disabled }" ${ required } placeholder="DD/MM/YYYY" autocomplete="off" />
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>
                </div>`
            )
        }

        /**
         * Birth year
         */

        else if (propertyType == "birth_year") {

            html.push(
                `<div class="input-group row mb-2">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${ (required) ? "* " : ""}${label }</label>
                    <div class="col-sm-7">
                        <select class="form-control form-control-sm updateBirthYear" id="${propertyId}" data-fl-disabled="${ disabled }" ${ required }>
                            <option />
                            ${() => { for (let year = 1950; year < new Date.getFullYear(); year++) `<option value="${year}" ${(value == year) ? "selected=\"selected\"" : ""}>${year}</option>` }}
                        </select>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>
                </div>`
            )
        }

        /**
         * Time
         */

        else if (propertyType == "time") {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3">
                    <div class="form-outline timeOutline" "data-mdb-timepicker-init" data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm updateTime" id="${propertyId}" value="${value}" data-fl-disabled="${ disabled }" ${ required } />
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>
                </div>`
            )
        }
    
        /**
         * Datetime
         */

        else if (["datetime"].includes(propertyType)) {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3">
                    <div class="form-outline datetimeOutline" "data-mdb-datetimepicker-init" data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm updateDatetime" id="${propertyId}" value="${context.decodeDate(value)}" data-fl-disabled="${ disabled }" ${ required } placeholder="DD/MM/YYYY" autocomplete="off" />
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>
                </div>`
            )
        }

        /**
         * Number
         */

        else if (propertyType == "number") {

            html.push(
                `<div class="input-group row mb-2">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${ (required) ? "* " : "" }${label}</label>
                    <div class="col-sm-7">
                        <input class="form-control form-control-sm updateNumber" id="${propertyId}" value="${value}" data-fl-disabled="${ disabled }" ${ required } />
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>
                </div>`
            )
        }

        /**
         * Textarea
         */

        else if (propertyType == "textarea") {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <textarea class="form-control form-control-sm updateTextarea" rows="5" id="${propertyId}" data-fl-disabled="${ disabled }" ${ required }${label} maxlength="${(property.options.max_length) ? property.options.max_length : 2047}">${value}</textarea>
                        <label class="form-label">${ (required) ? "* " : "" }${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Select
         */

        else if (propertyType == "select") {

            const multiple = property.multiple
            const values = (value) ? value.split(",") : []
            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="form-outline">
                        <select class="updateSelect" data-mdb-select-init id="${propertyId}" data-fl-disabled="${ disabled }" ${ required }>
                            <option />`
            )

            for (let key of Object.keys(modalities)) {
                const labels = modalities[key]
                if (values[key] || !labels.archive) {
                    html.push(`<option value="${key}" ${(value == key) ? "selected" : ""} ${(labels.archive) ? "disabled" : ""}>${context.localize(labels)}</option>`)
                }
            }

            html.push(
                `       </select>
                        <label class="form-label select-label">${ (required) ? "* " : "" }${label}</label>
                    </div>
                    <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                </div>`
            )
        }

        /**
         * Tag
         */

        else if (propertyType == "tag") {

            const selectedIds = []
            for (let tag of property.tags) {
                const vectorId = property.vector
                const ids = tag[vectorId]
                if (ids.includes(row.id)) {
                    selectedIds.push(row.id)
                }
            }

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }">
                    <div class="form-outline" data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm update-datalist" id="${propertyId}" list="updateDataList-${propertyId}" data-tag-ids="${ selectedIds.join(",") }" data-tag-ids="" placeholder="${ context.translate("Search") }" />
                        <datalist id="updateDataList-${propertyId}">
                            <option value="-- ${ context.translate("Erase") } --" data-id="0" id="datalist-${propertyId}-0"></option>`)

            for (let tag of property.tags) {
                html.push(`<option value="${tag.name}" data-id="${tag.id}" id="datalist-${propertyId}-${tag.id}"></option>`)
            }

            html.push(
                `       </datalist>
                        <label class="form-label">${label}</label>
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>`
            )

            for (let tag of property.tags) {
                const vectorId = property.vector
                const ids = tag[vectorId]
                if (ids.includes(row.id)) {
                    selectedIds.push(row.id)
                    html.push(
                        `<div class="chip" data-mdb-chip-init>
                            ${tag.name}
                            <i class="close fas fa-times"></i>
                        </div>
                        `
                    )
                }
            }

            html.push(
                `</div>
`
            )
        }

        /**
         * Source
         */

        else if (propertyType == "source") {

            if (property.options.autocomplete) {
                html.push(
                    `<div 
                        class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } ${ (!value) ? "fl-modal-list-add-autocomplete" : "" }"
                        data-mdb-input-init
                        data-fl-values="${ Object.values(modalities).join(",") }"
                    >
                        <div class="input-group mb-3">
                            <div class="form-outline formOutline" data-mdb-input-init>
                                <input class="form-control form-control-sm is-valid fl-modal-form-input updateInput" id="${propertyId}" data-fl-property="${propertyId}" data-fl-type="input" value="${value}" data-fl-disabled="${ disabled }" ${ required } maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
                                <label class="form-label">${label}</label>
                            </div>

                            ${ (!value) ? `
                                <button 
                                    class="btn btn-primary fl-group-tab-search"
                                    type="button"
                                    data-fl-property="${propertyId}"
                                    data-fl-key-property="${ property.options.columns.id }"
                                    data-fl-keys="${ Object.keys(modalities).join(",") }"
                                    data-fl-values="${ Object.values(modalities).join(",") }"
                                    data-mdb-ripple-init data-mdb-ripple-color="dark"
                                >
                                    <i class="fas fa-search"></i>
                                </button>` : "" }                            
                        </div>
                    </div>`
                )    
            }
            else {
                html.push(
                    `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                        <div class="form-outline">
                            <select 
                                class="updateSelect"
                                data-mdb-select-init
                                id="${propertyId}"
                                data-fl-disabled="${ disabled }" ${ required }
                                data-fl-key-property="${ property.options.columns && property.options.columns.id }"
                            >
                                <option />`
                )
    
                for (let modalityId of Object.keys(modalities)) {
                    const modality = modalities[modalityId]
                    html.push(`<option value="${modalityId}" ${(value == modalityId) ? "selected" : ""}>${modality}</option>`)
                }
    
                html.push(
                    `       </select>
                            <label class="form-label select-label">${(required) ? "* " : ""}${label}</label>
                            <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                        </div>
                    </div>`
                )    
            }
        }

        /**
         * History
         */

        else if (propertyType == "history") {          

            html.push(
                `<div class="input-group row mb-2">
                    <div>${label}</div>
                    <textarea class="form-control form-control-sm updateTextarea" id="${propertyId}" data-fl-disabled="${ disabled }" ${(required) ? "required" : ""} maxlength="${(property.options.max_length) ? property.options.max_length : 65535}"></textarea>
                    <input type="hidden" id="updateHistoryRoute-${propertyId}" value="/bo/history/${property.entity}/1" />
                    <div class="invalid-feedback text-danger" id="updateError-${propertyId}"></div>
                </div>
                <div class="card my-3 text-muted updateHistory" id="updateHistory-${propertyId}"></div>`
            )
        }

        /**
         * JSON
         */

        else if (propertyType == "json") {

            html.push(
                `<div class="input-group row mb-2">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${(required) ? "* " : ""}${label}</label>
                    <div class="col-sm-7">
                        <!--<textarea class="form-control form-control-sm updateTextarea" rows="5" id="${propertyId}" data-fl-disabled="${ disabled }" ${(required) ? "* " : ""}${label} maxlength="${(property.options.max_length) ? property.options.max_length : 2047}"></textarea>-->
                        <div id="treeview-json" class="pt-2 pb-2"></div>
                        <input type="hidden" id="json-content" value="${value}"></input>
                    </div>
                </div>`
            )
        }

        /**
         * Wysiwyg
         */

        else if (propertyType == "wysiwyg") {
            html.push(
                `<div class="input-group row mb-2">
                    <div class="wysiwyg fl-email-text" id="${propertyId}" data-fl-template="flEmailTemplate-${propertyId}" data-fl-div="flEmailDiv-${propertyId}" data-mdb-wysiwyg-init>
                        ${ value }
                    </div>
                </div>`
            )

            html.push(`<input type="hidden" id="flEmailTemplate-${propertyId}" value="${ encodeURI("<p><i class=\"fas fa-message-alt\"></i></button>&nbsp;&nbsp;<button type=\"button\" class=\"btn btn-sm btn-outline-primary index-btn fl-email-template\" {disabled} data-fl-addresses=\"{addresses}\" data-fl-subject=\"{subject}\" data-fl-body=\"{body}\">{addresses}</button>&nbsp;&nbsp;{text}</p>") }" />`)

            html.push(`<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } fl-submit-div" id="flEmailDiv-${propertyId}"></div>`)
        }

        /**
         * HTML
         */

        else if (propertyType == "html") {

            html.push(
                `<div class="row mt-3">
                    <label class="col-form-label">${(required) ? "* " : ""}${label}</label>
                </div>
                <div class="row">
                    <div class="card">
                        <div class="container">
                            <div>${value}</div>
                        </div>
                    </div>
                </div>`
            )
        }

        else {

            html.push(
                `<div class="input-group row mb-2">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${(required) ? "* " : ""}${label}</label>
                    <div class="col-sm-7">
                        <input class="form-control form-control-sm updateInput" id="${propertyId}" value="${value}" data-fl-disabled="${ disabled }" ${(required) ? "required" : ""} maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
                        <div class="invalid-feedback">${ context.translate("Invalid") }</div>
                    </div>
                </div>`
            )
        }
    }
    
    html.push(
        `<div class="col-md-12 mb-4">
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-update-button" title="${context.translate("Update")}">
                <i class="fas fa-pen"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-close-button" id="flModalListCloseButton" data-mdb-ripple-init>
                <span class="fas fa-close"></span>
            </button>
        </div>`)

    return html.join("\n")
}
