const tableFormView = ({ context }, properties) => {

    const html = [`
        <input 
            class="fl-json-input"
            type="hidden"
            id="id"
            data-fl-property="id"
            data-fl-type="input"
            value="0"
        />`]

    html.push(`
        <td class="text-center">
            <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-json-close-button" data-mdb-ripple-init>
                <span class="fas fa-close"></span>
            </button>
        </td>`)

    for (const [propertyId, property] of Object.entries(properties)) {
        
        const value = "", required = (property.required) ? "required" : ""

        html.push("<td>")

        if (property.type === "source") {
            html.push(`
                <div>
                    <select 
                        class="form-select form-select-sm fl-json-input"
                        id="${propertyId}"
                        ${ required }
                        data-mdb-select-init=""
                        data-fl-property="${propertyId}"
                        data-fl-type="select"
                        ${ (property.multiple) ? "multiple" : ""
                    }>
                        ${ (!property.multiple) ? "<option />" : "" }`
            )

            for (let modality of property.modalities) {
                html.push(`
                    <option 
                        value="${ modality.id }" 
                        ${ (modality[property.secondaryText]) ? `data-mdb-secondary-text="${ modality[property.secondaryText] }`: "" }"
                    >
                        ${ modality[property.text] }
                    </option>`)
            }

            html.push(
            `       </select>
                    <label class="form-label select-label">${ context.localize(property.labels) }</label>
                </div>`)

        }

        else if (property.modalities) {
            html.push(`
                <div>
                    <select 
                        class="form-select form-select-sm fl-json-input"
                        id="${propertyId}"
                        ${ required }
                        data-mdb-select-init=""
                        data-fl-property="${propertyId}"
                        data-fl-type="select"
                        ${ (property.multiple) ? "multiple" : ""
                    }>
                        ${ (!property.multiple) ? "<option />" : "" }`
            )

            for (let key of Object.keys(property.modalities)) {
                html.push(`<option value="${key}" ${ (property.modalities[key]["secondaryText"]) ? `data-mdb-secondary-text="${ property.modalities[key]["secondaryText"] }`: "" }">${context.localize(property.modalities[key])}</option>`)
            }

            html.push(
            `       </select>
                    <label class="form-label select-label">${ context.localize(property.labels) }</label>
                </div>`)
        }

        else if (property.type === "date") {
            html.push(`
                <div class="form-outline fl-form-date" data-mdb-datepicker-init data-mdb-input-init data-mdb-inline="true">
                    <input 
                        class="form-control form-control-sm fl-json-input"
                        id="${propertyId}"
                        ${ required }
                        placeholder="DD/MM/YYYY"
                        autocomplete="off"
                        data-fl-property="${propertyId}"
                        data-fl-type="date"
                        value="${value}"
                     />
                    <label class="form-label" for="${propertyId}">${ context.localize(property.labels) }</label>
                </div>`)
        }

        else if (property.type === "time") {
            html.push(`
                <div class="form-outline fl-form-time" data-mdb-timepicker-init data-mdb-input-init data-mdb-inline="true">
                    <input
                        class="form-control form-control-sm fl-json-input"
                        id="${propertyId}"
                        ${ required }
                        placeholder="HH:MM"
                        autocomplete="off"
                        data-fl-property="${propertyId}"
                        data-fl-type="time"
                        value="${value}"
                    />
                    <label class="form-label" for="${propertyId}">${ context.localize(property.labels) }</label>
                </div>`)
        }

        else if (property.type === "datetime") {
            html.push(`
                <div class="form-outline fl-form-datetime" data-mdb-datetimepicker-init data-mdb-input-init data-mdb-inline="true">
                    <input
                        class="form-control form-control-sm fl-json-input"
                        id="${propertyId}"
                        ${ required }
                        placeholder="DD/MM/YYYY"
                        autocomplete="off"
                        data-fl-property="${propertyId}"
                        data-fl-type="datetime"
                        value="${value}"
                    />
                    <label class="form-label" for="${propertyId}">${ context.localize(property.labels) }</label>
                </div>`)
        }

        else if (property.type === "number") {
            html.push(`
                <div class="form-outline" data-mdb-input-init>
                    <input
                        type="number"
                        class="form-control form-control-sm fl-json-input"
                        id="${propertyId}"
                        ${ required }
                        data-fl-property="${propertyId}"
                        data-fl-type="number"
                        value="${value}"
                    />
                    <label class="form-label" for="${propertyId}">${ context.localize(property.labels) }</label>
                </div>`)
        }

        else {
            html.push(`
                <div class="form-outline" data-mdb-input-init>
                    <input 
                        type="text"
                        class="form-control form-control-sm fl-json-input"
                        id="${ propertyId }"
                        ${ required }
                        maxlength="255"
                        data-fl-property="${propertyId}"
                        data-fl-type="input"
                        value="${value}"
                    />
                    <label class="form-label" for="${propertyId}">${ context.localize(property.labels) }</label>
                </div>`)
        }

        html.push("</td>")
    }

    return html.join("\n")
}

export { tableFormView }