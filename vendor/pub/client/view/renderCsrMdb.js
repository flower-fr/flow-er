const computeValue = (expression, closedDays = false, format = "YYYY-MM-DD") => {
    if (expression.includes("today")) {
        if (expression.includes("+") || expression.includes("-")) {
            const opened = ((expression.charAt(6) == "o")) ? true : false
            const shift = parseInt((opened) ? expression.substring(7) : expression.substring(6))
            let shifted = moment().locale("fr")
            for (let i = 0; i < shift; i++) {
                if (expression.charAt(5) == "+") {
                    shifted = shifted.add(1, "days")
                    if (closedDays) for (let closed of closedDays) if (shifted.format("YYYY-MM-DD") == closed) {
                        shifted = shifted.add(1, "days")
                        break
                    }
                    if (opened) {
                        if (shifted.day() == 6) shifted = shifted.add(2, "days")
                        else if (shifted.day() == 0) shifted = shifted.add(1, "days")
                    }
                    if (closedDays) for (let closed of closedDays) if (shifted.format("YYYY-MM-DD") == closed) {
                        shifted = shifted.add(1, "days")
                        break
                    }
                }
                else if (expression && expression.charAt(5) == "-") {
                    shifted = shifted.subtract(1, "days")
                    if (closedDays) for (let closed of closedDays) if (shifted.format("YYYY-MM-DD") == closed) {
                        shifted = shifted.subtract(1, "days")
                        break
                    }
                    if (opened) {
                        if (shifted.day() == 6) shifted = shifted.subtract(2, "days")
                        else if (shifted.day() == 0) shifted = shifted.subtract(1, "days")
                    }
                    if (closedDays) for (let closed of closedDays) if (shifted.format("YYYY-MM-DD") == closed) {
                        shifted = shifted.subtract(1, "days")
                        break
                    }
                }                    
            }
            return shifted.format(format)
        }
        else return moment().format(format)        
    }
    else return expression
}

const renderCsrMdb = ({ context, entity, view}, data) => {

    const properties = data.properties
    const config = data.formConfig
    const closedDays = config.options && config.options.closedDays 

    const renderProperty = (section) => {

        const html = []

        for (let propertyId of Object.keys(section)) {
            const property = (properties[propertyId]) ? properties[propertyId] : section[propertyId]
            const options = property.options
            const label = (options.labels) ? context.localize(options.labels) : context.localize(property.labels)
            const propertyType = (options.type) ? options.type : property.type
            const propertyModalities = (options.modalities) ? options.modalities : property.modalities
            const required = (property.options.required) ? true : false

            html.push(`<div class="${ (options.class) ? options.class : "col-lg-12 mb-3" }">`)

            let currentDate = new Date()
            const year = currentDate.getFullYear(), month = String(currentDate.getMonth() + 1).padStart(2, "0"), day = String(currentDate.getDate()).padStart(2, "0")
            currentDate = `${year}-${month}-${day}`

            let value = ""
            if (options.value && !Array.isArray(options.value)) {
                value = computeValue(options.value, closedDays)
            }
            value = value.replace(/(<([^>]+)>)/ig, "")
    
            if (["title"].includes(propertyType)) {
                html.push(`<h5 class="my-3">${ label }</h5>`)
            }
    
            else if (["paragraph"].includes(propertyType)) {
                html.push(`<p class="my-3">${ label }</p>`)
            }

            if (["input", "email", "phone", "number"].includes(propertyType)) {
                html.push(`
                    <div class="form-outline csr-form-outline-input mb-2" data-mdb-input-init>
                        <input 
                            type="text" 
                            class="form-control form-control-sm property updateInput
                                ${ (propertyType == "email") ? "updateEmail" : "" }
                                ${ (propertyType == "phone") ? "updatePhone" : "" }
                                ${ (propertyType == "number") ? "updateNumber" : "" }"
                            name="${propertyId}" id="${propertyId}" value="${value}" 
                            ${ (required) ? "required" : "" }
                            maxlength="${ (property.options.max_length) ? property.options.max_length : 255 }"
                        />
                        <label class="form-label" for="form12">${label}</label>
                    </div>`)
            }

            else if (["date"].includes(propertyType)) {

                html.push(
                    `<div class="form-outline csr-form-outline-date mb-2 dateOutline" ${ (property.options.startDate) ? `startDate="${ property.options.startDate }"` : "" } }>
                        <input 
                            type="text" 
                            class="form-control form-control-sm property updateInput"
                            name="${propertyId}" id="${propertyId}" value="${value}" 
                            ${ (required) ? "required" : "" }
                            placeholder="${ context.translate("DD/MM/YYYY") }" />
                        <label class="form-label">${label}</label>
                    </div>`
                )
            }
       
            else if (propertyType == "textarea") {
                html.push(`
                    <div class="form-outline csr-form-outline-textarea" data-mdb-input-init>
                        <textarea 
                            class="form-control form-control-sm property updateTextarea" 
                            rows="${ (property.options.rows) ? property.options.rows : 5 }" 
                            id="${propertyId}" 
                            maxlength="${(property.options.max_length) ? property.options.max_length : 2047}"
                        ></textarea>
                        <label class="form-label" for="form12">${label}</label>
                    </div>`)
            }

            else if (propertyType == "select") {
                html.push(`
                    <div class="form-outline mb-2">
                        <select 
                            class="form-control form-control-sm property csr-select updateSelect" 
                            data-mdb-select-init 
                            data-mdb-visible-options=${ Object.keys(propertyModalities).length + 1 }
                            id="${propertyId}"
                            ${ (required) ? "required" : "" } 
                        >
                            <option />`)

                for (let key of Object.keys(propertyModalities)) {
                    const labels = propertyModalities[key]
                    if (!labels.archived) {
                        html.push(`
                            <option value="${ computeValue(key, closedDays) }">${ computeValue(context.localize(labels), closedDays, "dddd D MMMM YYYY") }</option>`)
                    }
                }

                html.push(`
                        </select>
                        <label class="form-label select-label">${label}</label>
                    </div>`)
            }
    
            else if (propertyType == "tag") {
                html.push(`
                    <div class="form-group" id="updateSelectDiv-${propertyId}">
                        <label class="form-label">${(required) ? "* " : ""}${label}</label>
                        <select 
                            class="form-control form-control-sm property updateSelect" 
                            data-mdb-select-init 
                            id="${propertyId}" 
                            ${ (required) ? "required" : "" } 
                            multiple
                        >
                            <option />`)
                
                for (let tag of property.tags) {
                    html.push(`<option value="${tag.id}">${tag.name}</option>`)
                }

                html.push(`
                        </select>
                    </div>`)
            }
    
            else if (propertyType == "source") {
                html.push(`
                    <div class="form-group" id="updateSelectDiv-${propertyId}">
                        <select 
                            class="form-control form-control-sm property csr-select updateSelect"
                            data-mdb-select-init 
                            id="${propertyId}" 
                            ${ (required) ? "required" : "" } 
                        >
                            <option />`)

                for (let modalityId of Object.keys(propertyModalities)) {
                    const modality = propertyModalities[modalityId]
                    html.push(`<option value="${modalityId}">${modality}</option>`)
                }

                html.push(`
                        </select>
                        <label class="form-label select-label">${label}</label>
                    </div>`)
            }

            else if (propertyType == "history") {          

                html.push(`
                <div class="form-outline" data-mdb-input-init>
                    <textarea 
                        class="form-control form-control-sm property updateTextarea" 
                        id="${propertyId}"
                        ${ (required) ? "required" : "" }
                        maxlength="${(property.options.max_length) ? property.options.max_length : 65535}"
                    ></textarea>
                    <label class="form-label" for="form12">${label}</label>
                </div>`)
            }

            else if (propertyType == "checkbox") {
                html.push(`
                    <div class="form-group">
                        <input 
                            class="property property updateCheckbox" 
                            type="checkbox"
                            id="${propertyId}"
                            value="1"
                            ${ (required) ? "required" : "" }
                        ></input>
                        &nbsp;&nbsp;
                        <label>${label}</label>
                    </div>`)
            }

            html.push("</div>")
        }

        return html.join("\n")
    }

    const html = []

    let addConfig = context.config[`${entity}/form/${view}`], sectionId = "csr", section = addConfig.layout.csr
    if (section.labels) {
        html.push(`<h3 id="${sectionId}" class="text-center my-4 col-lg-12">${ context.localize(section.labels) }</h3>`)
    }

    html.push(renderProperty(section.properties))

    return html.join("\n")
}
