const renderForm = ({ context, entity, view} , { properties, where, formJwt, row }) => {

    const renderSection = () => {

        let addConfig = context.config[`${entity}/form/${view}`]
        const html = ["<div class=\"row\">"]

        for (let sectionId of Object.keys(addConfig.layout)) {
            const section = addConfig.layout[sectionId]
            if (section.labels) {
                html.push(`<div class="col-lg-12">
                    <h5 id="${sectionId}" class="text-center my-4">${ context.localize(section.labels) }</h5>
                </div>`)
            }
            html.push(renderProperty(section.properties))
        }

        html.push("</div>")

        return html.join("\n")
    }

    const renderProperty = (section) => {

        const html = []

        for (let propertyId of section) {
            const property = properties[propertyId]
            const options = property.options
            const label = (options.labels) ? context.localize(options.labels) : context.localize(property.labels)
            const propertyType = (options.type) ? options.type : property.type
            const readonly = (property.options.readonly) ? true : false
            const required = (property.options.required) ? true : false

            html.push(`<div class="${ (options.class) ? options.class : "col-lg-12 mb-3" }">`)

            let currentDate = new Date()
            const year = currentDate.getFullYear(), month = String(currentDate.getMonth() + 1).padStart(2, "0"), day = String(currentDate.getDate()).padStart(2, "0")
            currentDate = `${year}-${month}-${day}`

            let value = ""
            if (row && row[propertyId]) value = row[propertyId]
            else {
                if (options.value && !Array.isArray(options.value)) {
                    value = options.value
                    if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                    else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                    else value = moment().format("YYYY-MM-DD")    
                }
                if (options.initialValue) {
                    value = options.initialValue
                    if (value && value.charAt(5) == "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                    else if (value && value.charAt(5) == "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                    else value = moment().format("YYYY-MM-DD")    
                }
            }
    
            if (propertyId == "bank_identifier") {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control updateIban" name="${propertyId}" id="${propertyId}" value="${value}" placeholder="${ (required) ? "* " : "" } ${label}" ${ (required) ? "required" : "" } maxlength="255">
                </div>`)
            }
    
            else if (propertyType == "input") {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control" name="${propertyId}" id="${propertyId}" value="${value}" placeholder="${ (required) ? "* " : "" } ${label}" ${ (required) ? "required" : "" } ${ (readonly) ? "disabled" : "" } maxlength="255">
                </div>`)
            }
    
            else if (propertyType == "email") {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control updateEmail" name="${propertyId}" id="${propertyId}" value="${value}" placeholder="${ (required) ? "* " : "" } ${label}" ${ (required) ? "required" : "" } maxlength="255">
                </div>`)
            }
    
            else if (propertyType == "phone") {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control updatePhone" name="${propertyId}" id="${propertyId}" value="${value}" placeholder="${ (required) ? "* " : "" } ${label}" ${ (required) ? "required" : "" } maxlength="255">
                </div>`)              
            }
        
            else if (["date", "datetime", "closing_date"].includes(propertyType)) {
                html.push(`<div class="form-group">
                    <input type="text" class="form-control updateDate" name="${propertyId}" id="${propertyId}" value="$${value}" placeholder="${ (required) ? "* " : "" } ${label}" ${ (required) ? "required" : "" } maxlength="255">
                </div>`)
            }
    
            else if (propertyType == "birth_year") {
                html.push(`<div class="form-group">
                    <label class="form-label">${(required) ? "* " : ""}${label}</label>
                    <select class="form-control updateBirthYear" id="${propertyId}" ${(required) ? "required" : ""}>
                        <option />
                        ${() => { for (let year = 1950; year < new Date.getFullYear(); year++) `<option value="${year}" ${(value == year) ? "selected=\"selected\"" : ""}>${year}</option>` }}
                    </select>
                </div>`)
            }

            else if (propertyType == "time") {
                html.push(`<div class="form-group">
                <input type="text" class="form-control updateTime" name="${propertyId}" id="${propertyId}" value="${value}" placeholder="${ (required) ? "* " : "" } ${label}" ${ (required) ? "required" : "" } maxlength="255">
            </div>`)              
            }
    
            else if (propertyType == "number") {
                html.push(`<div class="form-group">
                <input type="text" class="form-control updateNumber" name="${propertyId}" id="${propertyId}" value="${value}" placeholder="${ (required) ? "* " : "" } ${label}" ${ (required) ? "required" : "" } maxlength="255">
            </div>`)
            }
    
            else if (propertyType == "textarea") {
                html.push(`<div class="form-group row">
                    <label class="form-label">${(required) ? "* " : ""}${label}</label>
                    <textarea class="form-control updateTextarea" rows="5" name="${propertyId}" id="${propertyId}" ${(required) ? "* " : ""}${label} maxlength="${(property.options.max_length) ? property.options.max_length : 2047}">${value}</textarea>
                </div>`)
            }

            else if (propertyType == "select") {
                const multiple = property.multiple
                const values = (value) ? value.split(",") : []
                html.push(`<div class="form-group" id="updateSelectDiv-${propertyId}">
                    <label class="form-label">${(required) ? "* " : ""}${label}</label>
                    <select class="form-control" name="${propertyId}" id="${propertyId}" ${(required) ? "required" : ""}>
                        <option />
    ${function () {
        const restriction = (property.options.restriction) ? property.options.restriction : {}
        const html = []
        for (let key of Object.keys(property.modalities)) {
            let keep = true
            if (restriction[key]) {
                for (let filterId of Object.keys(restriction[key])) {
                    if (where[filterId]) {
                        if (restriction[key][filterId] && !restriction[key][filterId].includes(where[filterId][0])) keep = false
                    }
                }
            }
            const labels = property.modalities[key]
            let selectable = true
            if (!values[key] && labels.archive) selectable = false                
            if (selectable && keep) {
                html.push(`<option value="${key}" ${(values.includes(key)) ? "selected" : ""} ${(labels.archive) ? "disabled" : ""}>${context.localize(labels)}</option>`)
            }
        }
        return html.join("\n")
    } ()}
                    </select>            
                </div>`)
            }
    
            else if (propertyType == "tag") {
                html.push(`<div class="form-group" id="updateSelectDiv-${propertyId}">
                    <label class="form-label">${(required) ? "* " : ""}${label}</label>
                    ${`<select class="form-control updateSelect" name="${propertyId}" id="${propertyId}" multiple>
                        <option />
    ${function () {
        const html = []
        for (let tag of property.tags) {
            const vectorId = property.vector
            const ids = tag[vectorId]
            const tagKey = (property.key) ? property.key : "id"
            const selected = false
            html.push(`<option value="${tag.id}" ${(selected) ? "selected" : ""}>${tag.name}</option>`)
        }
        return html.join("\n")
    } ()}
                        </select>`}
                </div>`)
            }
    
            else if (propertyType == "source") {
                html.push(`<div class="form-group" id="updateSelectDiv-${propertyId}">
                    <label class="form-label">${(required) ? "* " : ""}${label}</label>
                    ${`<select class="form-control updateSelect" name="${propertyId}" id="${propertyId}">
                        <option />
    ${function () {
        const restriction = (property.options.restriction) ? property.options.restriction : {}
        const html = []
        for (let modalityId of Object.keys(property.modalities)) {
            let keep = true
            if (restriction[modalityId]) {
                for (let filterId of Object.keys(restriction[modalityId])) {
                    if (where[filterId]) {
                        if (restriction[modalityId][filterId] && !restriction[modalityId][filterId].includes(where[filterId][0])) keep = false
                    }
                }
            }
            const modality = property.modalities[modalityId]
            if (keep) {
                html.push(`<option value="${modalityId}" ${(value == modalityId) ? "selected" : ""}>${modality}</option>`)
            }
        }
        return html.join("\n")
    } ()}
                    </select>`}
                </div>`)
            }

            else if (propertyType == "history") {          

                html.push(`<div class="form-group">
                    <div>${label}</div>
                    <textarea class="form-control updateTextarea" name="${propertyId}" id="${propertyId}" ${(required) ? "required" : ""} maxlength="${(property.options.max_length) ? property.options.max_length : 65535}"></textarea>
                    <input type="hidden" id="updateHistoryRoute-${propertyId}" value="/bo/history/${property.entity}/1" />
                    <div class="invalid-feedback text-danger" id="updateError-${propertyId}"></div>
                </div>`)
            }

            else if (propertyType == "checkbox") {
                html.push(`<div class="form-group">
                    <input type="checkbox" name="${propertyId}" id="${propertyId}" value="1" ${(required) ? "required" : ""} checked></input>
                    &nbsp;&nbsp;
                    <label>${label}</label>
                </div>`)
            }

            else {
                html.push(`<div class="form-group">
                <input type="text" class="form-control updateInput" name="${propertyId}" id="${propertyId}" value="" placeholder="${ (required) ? "* " : "" } ${label}" ${ (required) ? "required" : "" } maxlength="255">
            </div>`)
            }

            html.push("</div>")
        }

        return html.join("\n")
    }

    const html = []

    html.push(`<form method="post" id="customForm" class="contactForm" enctype="multipart/form-data">
        <input id="lead_origin" type="hidden" name="flower-identifier" value="">
        <div class="row">
            ${renderSection()}
        </div>
        <div class="col-md-12">
            <div class="form-group">

                <input type="submit" value="Envoyer" class="btn btn-primary">

            </div>
        </div>
    </form>`)

    return html.join("\n")
}
