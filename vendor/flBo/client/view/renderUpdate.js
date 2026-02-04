const renderUpdate = ({ context }, section, properties, row, vectors ) => {

    console.log("In renderUpdate (flBo)")
    
    const html = []

    if (row.id) html.push(`<input type="hidden" class="fl-modal-form-input" data-fl-property="id" data-fl-type="input" value="${ row.id }" />`)
    
    html.push(
        `<div class="col-md-12 mb-4">
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-update-button" title="${context.translate("Update")}">
                <i class="fas fa-pen"></i>
            </button>
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-close-button" id="flModalListCloseButton" data-mdb-ripple-init>
                <span class="fas fa-close"></span>
            </button>
        </div>`)

    for (let propertyId of section.properties) {
        const property = properties[propertyId]
        const options = property.options
        const label = (options.labels) ? context.localize(options.labels) : context.localize(property.labels)
        const propertyType = (options.type) ? options.type : property.type
        const disabled = (property.options.readonly /* deprecated */ || property.options.disabled) ? "disabled" : ""
        const required = (property.options.mandatory /* deprecated */ || property.options.required) ? "required" : ""
        const modalities = (property.options.modalities) ? property.options.modalities : property.modalities
        
        let value = (row && row[propertyId]) ? row[propertyId] : ""
        if (property.type == "percentage" && value) value = parseFloat(row[propertyId] * 100)
        else if (options.value && !Array.isArray(options.value)) {
            value = options.value
            if (value == "?id") value = id
            else if (value.substring(0, 5) == "today") {
                if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                else if (property.type == "datetime") value = moment().format("YYYY-MM-DD HH:mm:ss")    
                else value = moment().format("YYYY-MM-DD")
            }
        }

        if (options.change) {

            html.push(`<input type="hidden" class="form-change" data-fl-property="${propertyId}" value="${value}" />`)
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
            
            html.push(`<hr><h6 class="text-center mb-3">${label}</h6>`)
        }

        else if (propertyType == "hidden") {
            html.push(`<input type="hidden" class="fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="input" value="${value}" />`)
        }

        /**
         * Input
         */

        else if (propertyType == "input") {

            html.push(
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } ${ (property.autocomplete) ? "fl-modal-list-add-autocomplete" : "" }"
                  id="flModalFormInput-${propertyId}"
                  data-mdb-input-init
                  ${ (property.autocomplete) ? `data-fl-values="${ property.values.join(",") }"`: "" }
                >
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="input" value="${value}"  data-fl-disabled="${ disabled }" ${ required } maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Password
         */

        else if (propertyType == "password") {

            html.push(
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } ${ (property.autocomplete) ? "fl-modal-list-add-autocomplete" : "" }"
                  id="flModalFormInput-${propertyId}"
                  data-mdb-input-init
                  ${ (property.autocomplete) ? `data-fl-values="${ property.values.join(",") }"`: "" }
                >
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input type="password" class="form-control form-control-sm is-valid fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="input" value="${value}"  data-fl-disabled="${ disabled }" ${ required } maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
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
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input type="email" class="form-control form-control-sm is-valid fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="email" value="${value}"  data-fl-disabled="${ disabled }" ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Phone
         */

        else if (propertyType == "phone") {

            html.push(
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="phone" value="${value}"  data-fl-disabled="${ disabled }" ${ required } maxlength="255" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )              
        }
    
        /**
         * Date or datetime
         */

        else if (["date", "datetime", "closing_date"].includes(propertyType)) {

            html.push(
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline fl-date-outline" data-fl-container="detailPanel">
                        <input class="form-control form-control-sm fl-modal-form-input fl-modal-future" data-fl-property="${propertyId}" data-fl-type="date" value="${context.decodeDate(value)}"  data-fl-disabled="${ disabled }" ${ required } placeholder="${ context.translate("DD/MM/YYYY") }" autocomplete="off" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Birth year
         */

        else if (propertyType == "birth_year") {

            html.push(
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <select class="form-control form-control-sm fl-modal-form-input fl-modal-form-select" data-fl-property="${propertyId}" data-fl-type="birthYear" data-fl-container="flModalForm"  data-fl-disabled="${ disabled }" ${ required }>
                            <option />
                            ${() => { for (let year = 1950; year < new Date.getFullYear(); year++) `<option value="${year}" ${(value == year) ? "selected=\"selected\"" : ""}>${year}</option>` }}
                        </select>
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Time
         */

        else if (propertyType == "time") {

            html.push(
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline fl-time-outline" data-fl-container="flModalForm" data-mdb-timepicker-init data-mdb-input-init>
                        <input class="form-control form-control-sm fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="time" value="${value}"  data-fl-disabled="${ disabled }" ${ required } />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Number
         */

        else if (propertyType == "number") {

            html.push(
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input type="numeric" class="form-control form-control-sm fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="number" value="${value}"  data-fl-disabled="${ disabled }" ${ required } pattern="[0-9]+(\.[0-9]{0,4})?" placeholder="12345,67" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Percentage
         */

        else if (propertyType == "percentage") {

            html.push(
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input type="numeric" class="form-control form-control-sm fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="percentage" value="${value}"  data-fl-disabled="${ disabled }" ${ required } pattern="[0-9]+(\.[0-9]{0,4})?" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Textarea
         */

        else if (propertyType == "textarea") {

            html.push(
                `<div
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <textarea class="form-control form-control-sm fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="textarea" rows="5"  data-fl-disabled="${ disabled }" ${ required } ${label} maxlength="${(property.options.max_length) ? property.options.max_length : 2047}">${value}</textarea>
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * Select
         */

        else if (propertyType == "select") {

            const multiple = property.multiple

            let values
            if (value) {
                if (Number.isInteger(value)) values = [value]
                else values = value.split(",") 
            }
            else values = []

            html.push(
                `<div
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline">
                        <select class="form-select form-select-sm fl-modal-form-input fl-modal-form-select" data-fl-property="${propertyId}" data-fl-type="select" data-fl-container="flModalForm" data-mdb-select-init ${ (required) ? "data-mdb-validation=\"true\" data-mdb-invalid-feedback=\" \" data-mdb-valid-feedback=\" \"" : "" } ${(multiple) ? "multiple" : ""}  data-fl-disabled="${ disabled }" ${ required }>
                            <option />`
            )

            for (let key of Object.keys(property.modalities)) {
                const labels = property.modalities[key]
                if (values[key] || !labels.archive) {
                    html.push(`<option value="${key}" ${(value == key) ? "selected" : ""} ${(labels.archive) ? "disabled" : ""}>${context.localize(labels)}</option>`)
                }
            }

            html.push(
                `       </select>
                        <label class="form-label select-label">${label}</label>
                    </div>
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
                `<div
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline" data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="input" list="updateDataList-${propertyId}" data-tag-ids="${ selectedIds.join(",") }" placeholder="${ context.translate("Search") }" data-fl-disabled="${ disabled }" />
                        <datalist id="updateDataList-${propertyId}">
                            <option value="-- ${ context.translate("Erase") } --" data-id="0" id="datalist-${propertyId}-0"></option>`)

            for (let tag of property.tags) {
                html.push(`<option value="${tag.name}" data-id="${tag.id}" id="datalist-${propertyId}-${tag.id}"></option>`)
            }

            html.push(
                `       </datalist>
                        <label class="form-label">${label}</label>
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

            html.push(
                `<div
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline">
                        <select class=" fl-modal-form-input fl-modal-form-select" data-fl-property="${propertyId}" data-fl-type="select" data-fl-container="flModalForm" data-mdb-select-init  data-fl-disabled="${ disabled }" ${ required } ${ (required) ? "data-mdb-validation=\"true\" data-mdb-invalid-feedback=\" \" data-mdb-valid-feedback=\" \"" : "" }>
                            <option />`
            )

            for (let modalityId of Object.keys(modalities)) {
                const modality = modalities[modalityId]
                let formatted = [], i = 1
                const args = (property.format[1]) ? property.format[1].split(",") : []
                for (let sub of property.format[0].split("%s")) {
                    formatted.push(sub)
                    if (modality[args[i-1]]) formatted.push(modality[args[i-1]])
                    i++
                }
                html.push(`<option value="${modality.id}" ${(value == modality.id) ? "selected" : ""}>${formatted.join("")}</option>`)
            }

            html.push(
                `       </select>
                        <label class="form-label select-label">${label}</label>
                    </div>
                </div>`
            )
        }

        /**
         * File
         */

        else if (propertyType == "file") {

            html.push(
                `<div 
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="">
                        <label class="form-label" for="customFile">${ label }</label>
                        <input type="file" class="form-control form-control-sm fl-modal-form-file" id="${propertyId}" data-fl-property="${propertyId}" data-fl-type="file" data-fl-disabled="${ disabled }" ${ required } />
                    </div>
                </div>`
            )
        }

        /**
         * Log
         */

        else if (propertyType == "log") {          

            html.push(
                `<div
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline formOutline mb-2">
                        <textarea class="form-control form-control-sm fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="textarea" ${(required) ? "required" : ""} maxlength="${(property.options.max_length) ? property.options.max_length : 65535}"></textarea>
                        <label class="form-label">${ label }</label>
                    </div>
                </div>
                <div class="fl-modal-log">
                    <table class="table table-sm table-hover table-responsive">
                        <thead class="datatable-header" />
                        <tbody class=""table-group-divider">`)

            for (const comment of vectors[property.vector]) {
                html.push(`
                    <tr>
                        <td><strong>${ moment(comment.touched_at).format("DD/MM/YYYY HH:mm:ss") }</strong></td>
                        <td><strong>${ comment.owner_n_fn.trim() !== "" ? `(${ comment.owner_n_fn })` : `(${ comment.chanel })` }</strong></td>
                        <td>${ comment.summary.split("\n").join("<br>") }</td>
                    </tr>

                    <!--<div class="text-muted mb-2"><small>
                        <strong>${ moment(comment.touched_at).format("DD/MM/YYYY HH:mm:ss") } ${ comment.owner_n_fn.trim() !== "" ? `(${ comment.owner_n_fn })` : `(${ comment.chanel })` }</strong><br>
                        ${ comment.summary.split("\n").join("<br>") }
                    </small></div><hr>-->`)
            }

            html.push("</tbody></table></div>")
        }

        /**
         * History
         */

        else if (propertyType == "history") {          

            html.push(
                `<div class="input-group row mb-2">
                    <div>${label}</div>
                    <textarea class="form-control form-control-sm fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="textarea" ${(required) ? "required" : ""} maxlength="${(property.options.max_length) ? property.options.max_length : 65535}"></textarea>
                    <input type="hidden" id="updateHistoryRoute-${propertyId}" value="/bo/history/${property.entity}/1" />
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
                    <div class="wysiwyg" id="wysiwyg" data-mdb-wysiwyg-init>
                        ${ value.map( (x) => { return context.localize(JSON.parse(x.data).text) } ).join("\n") }
                        <p><img src="/flow-er/logos/flow-er-3.png" width="40" class="img-fluid"></p>
                    </div>
                </div>`
            )
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
                `<div
                  class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3"
                  id="flModalFormInput-${propertyId}"
                >
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm fl-modal-form-input" data-fl-property="${propertyId}" data-fl-type="input" value="${value}"  data-fl-disabled="${ disabled }" ${(required) ? "required" : ""} maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
                        <label class="form-label select-label">${(required) ? "* " : ""}${label}</label>
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
