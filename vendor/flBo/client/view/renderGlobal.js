const renderGlobal = ({ context, entity }, config ) => {

    console.log("In renderGlobal (flBo)")
    
    const post = config.post

    const html = []

    html.push(
        `<div class="my-3">

            <input type="hidden" id="formJwt" name="formJwt" value="${ config.layout.formJwt }" />

            <!-- Form status messages -->

            <div class="globalMessage my-3" id="globalMessageOk">
                <h5 class="alert alert-success my-3 text-center">${context.translate("Your request has been registered")}</h5>
            </div>

            <div class="globalMessage my-3" id="globalMessageExpired">
                <h5 class="alert alert-danger my-3 text-center">${context.translate("The form has expired, please input again")}</h5>
            </div>

            <div class="globalMessage my-3" id="globalMessageConsistency">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The database has evolved in the meantime, please input again")}</h5>
            </div>

            <div class="globalMessage my-3" id="globalMessageDuplicate">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("The data already exists")}</h5>
            </div>

            <div class="globalMessage my-3" id="globalMessageServerError">
                <h5 class="alert alert-danger  my-3 text-center">${context.translate("A technical error has occured. PLease try again later")}</h5>
            </div>

            ${ (config.message) ? `
            <div class="my-3">
                <h5 class="alert alert-${ config.message.level } my-3 text-center">${context.localize(config.message)}</h5>
            </div>
            ` : "" }
            
            <form class="was-validated row g-4" id="globalForm" method="post" enctype="multipart/form-data">

                <div class="row my-3">`
    )

    html.push(renderSection({ context, entity }, config ))

    html.push(
        `       </div>
            
                <div class="form-group row submitDiv">
                    <div>
                        <input type="submit" id="globalSubmitButton" class="btn btn-warning submitButton mt-3" value="${ context.localize(post.labels) }" data-controller="${post.controller}" data-action="${post.action}" data-entity="${post.entity}" data-id="${post.id}">
                    </div>
                </div>

            </form>
        </div>`)

    return html.join("\n")
}

const renderSection = ({ context, entity }, config ) => {
    const html = []

    for (const [propertyId, property] of Object.entries(config.properties)) {
        const options = property.options
        const label = (options.labels) ? context.localize(options.labels) : context.localize(property.labels)
        const propertyType = (options.type) ? options.type : property.type
        const readonly = (property.options.readonly) ? true : false
        const required = (property.options.required) ? "required" : ""
        const modalities = (property.options.modalities) ? property.options.modalities : property.modalities
        let value = (property.options.value) ? property.options.value : ""
        if (value && !Array.isArray(value)) {
            if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
            else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
            else value = moment().format("YYYY-MM-DD")    
        }

        if (options.change) {

            html.push(`<input type="hidden" class="form-change" data-property-id="global-${propertyId}" value="mdb/groupTab/${entity}" />`)
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

        /**
         * Input
         */

        else if (propertyType == "input") {

            html.push(
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid globalInput" id="global-${propertyId}" value="${value}" ${(readonly) ? "disabled" : ""} ${ required } maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
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
                        <input class="form-control form-control-sm is-valid globalEmail" id="global-${propertyId}" value="${value}" ${(readonly) ? "disabled" : ""} ${ required } maxlength="255" />
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" }">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid globalPhone" id="global-${propertyId}" value="${value}" ${(readonly) ? "disabled" : ""} ${ required } maxlength="255" />
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3">
                    <div class="form-outline dateOutline" ${(propertyType == "datetime" ? "data-mdb-datetimepicker-init" : "data-mdb-datepicker-init")} data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm globalDate" id="global-${propertyId}" value="${context.decodeDate(value)}" ${(readonly) ? "disabled" : ""} ${ required } placeholder="${ context.translate("DD/MM/YYYY") }" autocomplete="off" />
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <select class="form-control form-control-sm globalBirthYear" id="global-${propertyId}" ${(readonly) ? "disabled" : ""} ${ required }>
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3">
                    <div class="form-outline timeOutline" data-mdb-timepicker-init data-mdb-input-init>
                        <input class="form-control form-control-sm globalTime" id="global-${propertyId}" value="${value}" ${(readonly) ? "disabled" : ""} ${ required } />
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3 mb-3">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input type="numeric" class="form-control form-control-sm globalNumber" id="global-${propertyId}" value="${value}" ${(readonly) ? "disabled" : ""} ${ required } pattern="[0-9]+(\.[0-9]{0,4})?" placeholder="12345,67" />
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <textarea class="form-control form-control-sm globalTextarea" rows="5" id="global-${propertyId}" ${(readonly) ? "disabled" : ""} ${ required } maxlength="${(property.options.max_length) ? property.options.max_length : 2047}">${value}</textarea>
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="form-outline">
                        <select class="form-select form-select-sm globalSelect" data-mdb-select-init ${ (required) ? "data-mdb-validation=\"true\" data-mdb-invalid-feedback=\" \" data-mdb-valid-feedback=\" \"" : "" } id="global-${propertyId}" ${(multiple) ? "multiple" : ""} ${(readonly) ? "disabled" : ""} ${ required }>
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="form-outline" data-mdb-input-init data-mdb-inline="true">
                        <input class="form-control form-control-sm global-datalist" id="global-${propertyId}" list="globalDataList-${propertyId}" data-tag-ids="${ selectedIds.join(",") }" placeholder="${ context.translate("Search") }" />
                        <datalist id="globalDataList-${propertyId}">
                            <option value="-- ${ context.translate("Erase") } --" data-id="0" id="datalist-${propertyId}-0"></option>`)

            for (let tag of property.tags) {
                html.push(`<option value="${tag.name}" data-id="global-${tag.id}" id="datalist-${propertyId}-${tag.id}"></option>`)
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="form-outline">
                        <select class="globalSelect" data-mdb-select-init id="global-${propertyId}" ${(readonly) ? "disabled" : ""}>
                            <option />`
            )

            for (let modalityId of Object.keys(modalities)) {
                const modality = modalities[modalityId]
                let formatted = [], i = 1
                for (let sub of property.format[0].split("%s")) {
                    formatted.push(sub)
                    if (modality[property.format[i]]) formatted.push(modality[property.format[i]])
                    i++
                }
                html.push(`<option value="${modalityId}" ${(value == modalityId) ? "selected" : ""}>${formatted.join("")}</option>`)
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="">
                       <label class="form-label" for="customFile">${ label }</label>
                        <input type="file" class="form-control form-control-sm globalFile" id="global-${propertyId}" ${(readonly) ? "disabled" : ""} ${ required } />
                    </div>
                </div>`
            )
        }

        /**
         * Table
         */

        else if (propertyType == "table") {

            html.push(renderGlobalTable( { context }, property.value ))
        }

        /**
         * JSON
         */

        else if (propertyType == "json") {

            html.push(
                `<div class="input-group row mb-2">
                    <label class="col-sm-5 col-form-label col-form-label-sm">${(required) ? "* " : ""}${label}</label>
                    <div class="col-sm-7">
                        <!--<textarea class="form-control form-control-sm globalTextarea" rows="5" id="global-${propertyId}" ${(readonly) ? "disabled" : ""} ${(required) ? "* " : ""}${label} maxlength="${(property.options.max_length) ? property.options.max_length : 2047}">${value}</textarea>-->
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
                `<div class="${ (property.options && property.options.class) ? property.options.class : "col-md-6" } mb-3">
                    <div class="form-outline formOutline" data-mdb-input-init>
                        <input class="form-control form-control-sm globalInput" id="global-${propertyId}" value="${value}" ${(readonly) ? "disabled" : ""} ${(required) ? "required" : ""} maxlength="${(property.options.max_length) ? property.options.max_length : 255}" />
                        <label class="form-label select-label">${(required) ? "* " : ""}${label}</label>
                    </div>
                </div>`
            )
        }
    }

    return html.join("\n")
}
