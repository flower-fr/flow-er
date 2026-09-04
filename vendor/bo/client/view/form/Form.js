import View from "../View.js"
import Toast from "../toast/Toast.js"

export default class Form extends View
{
    constructor({ controller, entity, view, id, onSuccess })
    {
        super({ controller })
        this.identifier = Date.now()
        this.entity = entity
        this.view = view
        this.id = id
        this.onSuccess = onSuccess
    }

    initialize = async () => {
        let response = await fetch(`/bo/form/${ this.entity }?view=${ this.view }`)
        const { properties, layout, post, translations } = await response.json()
        this.properties = properties
        this.layout = layout
        this.post = post
        this.translations = translations

        if (this.id) {
            // Retrieve the data
            const columns = Object.keys(properties).join(",")
            response = await fetch(`/core/v1/${ this.entity }/${ this.id }?columns=${ columns }`)
            this.data = (await response.json()).rows[0]
        }
    }

    formatValueFromData = (propertyId, property, data) =>
    {
        let value = property.value
        if (data) {
            value = data[propertyId] || ""
            if (property.type === "percentage" && value) value = parseFloat(value * 100)
            else if (property.value && !Array.isArray(property.value)) {
                if (value === "?id") value = data.id
                else if (value.substring(0, 5) === "today") {
                    if (value && value.charAt(5) === "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                    else if (value && value.charAt(5) === "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                    else if (property.type == "datetime") value = moment().format("YYYY-MM-DD HH:mm:ss")    
                    else value = moment().format("YYYY-MM-DD")
                }
            }
        }
        return value
    }

    render = () => 
    {
        const { layout, properties, post, data } = this

        const html = []

        html.push(`
        <div class="container">
            <div class="my-3">
                <div class="flForm-message" id="flForm-messageOk">
                    <h5 class="alert alert-success my-3 text-center">${ this.translations["Request registered"] }</h5>
                </div>

                <div class="flForm-message" id="flForm-messageConsistency">
                    <h5 class="alert alert-danger  my-3 text-center">${ this.translations["The data has changed in the meantime, please input again"] }</h5>
                </div>

                <div class="flForm-message" id="flForm-messageDuplicate">
                    <h5 class="alert alert-danger  my-3 text-center">${ this.translations["The data already exists"] }</h5>
                </div>

                <div class="flForm-message" id="flForm-messageServerError">
                    <h5 class="alert alert-danger  my-3 text-center">${ this.translations["Technical error, pLease try again later"] }</h5>
                </div>

                <form class="row g-4" id="${ this.identifier }">`)

        // Consistency

        if (data && data.touched_at) {
            html.push(`<input type="hidden" id="flForm-touched_at" value="${ data.touched_at }" />`)
        }

        const blocs = []
        for (const bloc of layout) {

            const blocHtml = []

            if (bloc.title) {
                blocHtml.push(`
                <h6 class="text-center col-xl-12 my-1">${ bloc.title }</h6>`)
            }

            for (const [propertyId, options] of Object.entries(bloc.properties)) {
                const property = properties[propertyId]

                const label = property.label
                const propertyType = property.type
                const divClass = options.class ? options.class : "col-md-6"
                const disabled = property.disabled
                const required = property.required

                const value = this.formatValueFromData(propertyId, property, data)

                // Title

                if (property.type === "title") {
                    blocHtml.push(`<hr><h6 class="text-center mb-3">${ label }</h6>`)
                }

                else if (property.type === "hidden" || property.hidden) {
                    blocHtml.push(`<input type="hidden" class="fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="input" ${ value ? `value="${ value }"`: "" } />`)
                }

                // Input

                else if (property.type === "input")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}" data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="input" ${ value ? `value="${ value }"`: "" }  data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 255 }" />
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // Password

                else if (property.type === "password")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}" data-mdb-input-init>
                            <input type="password" class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="input" data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 255 }" />
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // Email

                else if (property.type === "email")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}" data-mdb-input-init>
                            <input type="email" class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-property="flForm-${ propertyId }" data-fl-type="email" ${ value ? `value="${ value }"`: "" }  data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 255 }" />
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // Phone

                else if (property.type === "phone")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}" data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="phone" ${ value ? `value="${ value }"`: "" }  data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 255 }" />
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>`
                    )              
                }
        
                // Date or datetime

                else if (["date", "datetime"].includes(property.type))
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}" data-mdb-datepicker-init data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="date" value="${ value ? moment(value).format("DD/MM/YYYY") : "" }"  data-fl-disabled="${ disabled }" ${ required } placeholder="${ this.translations["DD/MM/YYYY"] }" />
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // Birth year

                else if (propertyType === "birth_year")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}">
                            <select class="form-control form-control-sm fl-modal-form-select" id="flForm-${ propertyId }" data-fl-type="birthYear" data-fl-disabled="${ disabled }" ${ required }>
                                <option />
                                ${() => { for (let year = 1950; year < new Date.getFullYear(); year++) `<option value="${ year }" ${ value === year ? "selected=\"selected\"" : ""}>${ year }</option>` }}
                            </select>
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // Time

                else if (propertyType == "time")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}" data-mdb-timepicker-init data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="time" ${ value ? `value=  "${ value }"`: "" } data-fl-disabled="${ disabled }" ${ required } />
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // Duration
                
                else if (propertyType === "duration")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}" data-mdb-input-init>
                            <input class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" value="${ Math.floor(value / 60) }:${ (x => x ? x : "")(value % 60) }" data-fl-disabled="${ disabled }" ${ required } />
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // Number

                else if (propertyType == "number")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}">
                            <input type="number" class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="number" ${ value ? `value="${ value }"`: "" } data-fl-disabled="${ disabled }" ${ required } pattern="[0-9]+(\.[0-9]{0,4})?" placeholder="12345,67" />
                            <label class="form-label">${label}</label>
                        </div>
                    </div>`
                    )
                }

                // Percentage

                else if (propertyType == "percentage")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}">
                            <input type="number" class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="percentage" ${ value ? `value="${ value }"`: "" } data-fl-disabled="${ disabled }" ${ required } pattern="[0-9]+(\.[0-9]{0,4})?" />
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // Textarea

                else if (propertyType == "textarea")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}">
                            <textarea class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="textarea" rows="5" data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 2047 }">${ value }</textarea>
                            <label class="form-label" for="flForm-flForm-${ propertyId }">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // Select

                else if (["select", "vector"].includes(propertyType))
                {
                    const multiple = property.multiple

                    let values
                    if (value) {
                        if (Number.isInteger(value)) values = [value]
                        else values = value.split(",") 
                    }
                    else values = []

                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}">
                            <select class="form-select form-select-sm fl-modal-form-select" id="flForm-${ propertyId }" data-fl-type="select" data-mdb-size="sm" data-mdb-select-init ${ (required) ? "data-mdb-validation=\"true\" data-mdb-invalid-feedback=\" \" data-mdb-valid-feedback=\" \"" : "" } ${( multiple ) ? "multiple" : ""}  data-fl-disabled="${ disabled }" ${ required }>
                                ${( !multiple ) ? "<option />" : "" }`
                    )

                    for (let [modalityId, modality] of Object.entries(property.modalities)) {
                        if (values[modalityId] || !modality.archive) {
                            blocHtml.push(`<option value="${modalityId}" ${(value == modalityId) ? "selected" : ""} ${ modality.archive ? "disabled" : "" }>${ modality.label }</option>`)
                        }
                    }

                    blocHtml.push(`
                            </select>
                            <label class="form-label select-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }

                // File

                else if (propertyType == "file")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div>
                            <label class="form-label" for="customFile">${ label }</label>
                            <input type="file" class="form-control form-control-sm fl-modal-form-file" id="flForm-${ propertyId }" data-fl-type="file" data-fl-disabled="${ disabled }" ${ required } />
                        </div>
                    </div>`
                    )
                }

                // Log

                else if (propertyType == "log")
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline mb-2" id="flFormOutline-${propertyId}">
                            <textarea class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="textarea" ${(required) ? "required" : ""} maxlength="${(property.max_length) ? property.max_length : 65535}"></textarea>
                            <label class="form-label">${ label }</label>
                        </div>
                    </div>
                    <div class="fl-modal-log">
                        <table class="table table-sm table-hover table-responsive">
                            <thead class="datatable-header" />
                            <tbody class="table-group-divider">`)

                    for (const modality of property.modalities) {
                        blocHtml.push(`
                        <tr>
                            <td><strong>${ moment(modality.touched_at).format("DD/MM/YYYY HH:mm:ss") }</strong></td>
                            <td><strong>${ modality.owner_n_fn.trim() !== "" ? `(${ modality.owner_n_fn })` : `(${ modality.chanel })` }</strong></td>
                            <td>${ modality.summary.split("\n").join("<br>") }</td>
                        </tr>`)
                    }

                    blocHtml.push("</tbody></table></div>")
                }

                else if (propertyType == "html") {

                    blocHtml.push(`
                    <div class="row mt-3">
                        <label class="col-form-label">${(required) ? "* " : ""}${ label }</label>
                    </div>
                    <div class="row">
                        <div class="card">
                            <div class="container">
                                <div>${ value }</div>
                            </div>
                        </div>
                    </div>`
                    )
                }

                else
                {
                    blocHtml.push(`
                    <div class="${ divClass }">
                        <div class="form-outline" id="flFormOutline-${propertyId}">
                            <input class="form-control form-control-sm fl-modal-form-input" id="flForm-${ propertyId }" data-fl-type="input" ${ value ? `value="${ value }"`: "" }  data-fl-disabled="${ disabled }" ${( required ) ? "required" : ""} maxlength="${ property.max_length ? property.max_length : 255 }" />
                            <label class="form-label select-label">${ label }</label>
                        </div>
                    </div>`
                    )
                }
            }

            blocs.push(blocHtml.join("\n"))
        }
        html.push(blocs.join("<hr>"))

        html.push(`
                <div class="form-group row submitDiv">`)

        html.push(`
            <div class="col-md-3 p-3">
                <button 
                    class="btn ${ (post.danger) ? "btn-outline-primary" : "btn-warning" } fl-detail-tab-submit"
                    id="flFormSubmit"
                    disabled
                    data-mdb-ripple-init
                    data-mdb-ripple-color="danger"
                    ${ (post.glyph) ? `title=${  post.label }` : "" }>
                        ${ (post.glyph) ? `<i class="fas ${ post.glyph }"></i>` : post.label }
                </button>
            </div>`)

        html.push(`
                <div class="col-md-3 p-3">
                    <button type="button" id="flFormCancel" class="btn btn-link" disabled>
                        ${ this.translations["Cancel"] }
                    </button>
                </div>`)

        html.push(`
                    </div>
                </form>
            </div>
        </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        const { properties, post, translations, controller, data } = this
        const form = document.getElementById(this.identifier)
        const cancelButton = document.getElementById("flFormCancel")
        // const backButton = document.getElementById("flScreen2BackButton")
        const submitButton = document.getElementById("flFormSubmit")

        // Initialize MDB components
        for (const [propertyId, property] of Object.entries(properties)) {

            const value = this.formatValueFromData(propertyId, property, data)

            if (property.type === "select") {
                const el = document.getElementById(`flForm-${ propertyId }`)
                new mdb.Select(el)
            }
            else if (property.type === "vector") {
                const el = document.getElementById(`flForm-${ propertyId }`)
                if (el) new mdb.Select(el)
            }
            // else if (property.type === "autocomplete") {
            //     const data = Object.values(property.modalities).map(x => x.label)
            //     const el = document.getElementById(`flFormOutline-flForm-${ propertyId }`)
            //     const dataFilter = (value) => {
            //         return data.filter((item) => {
            //             return item.toLowerCase().includes(value.toLowerCase())
            //         })
            //     }
            //     new mdb.Autocomplete(el, {
            //         filter: dataFilter,
            //         noResults: property.noResults,
            //     })
            // }
            else if (property.type === "date") {
                let el = document.getElementById(`flFormOutline-${ propertyId }`)
                const datePickerOptions = {
                    inline: true,
                }
                if (property.mdb) {
                    datePickerOptions.datepicker = { 
                        format: property.mdb.dateFormat
                    }
                    datePickerOptions.monthsFull = property.mdb.monthsFull
                    datePickerOptions.weekdaysNarrow = property.mdb.weekdaysNarrow
                }
                new mdb.Datepicker(el, datePickerOptions)
            }
            else if (property.type === "time") {
                const el = document.getElementById(`flFormOutline-${ propertyId }`)
                new mdb.Timepicker(el,{ format24: true, increment: true }) 
            }
            else if (property.type === "duration") {
                const el = document.getElementById(`flFormOutline-${ propertyId }`)
                new mdb.Timepicker(el,{ format24: true, increment: true }) 
            }
            else {
                const el = document.getElementById(`flFormOutline-${ propertyId }`)
                new mdb.Input(el)
            }
        }

        document.querySelectorAll(".btn").forEach(el => {
            new mdb.Ripple(el, {
                rippleColor: "danger"
            })
        })

        $(".flForm-message").hide()

        // Form submission handler
        if (form) {
            form.onsubmit = async (event) =>
            {
                event.preventDefault()
                form.checkValidity()

                // Build the request body
                const row = {}
                for (const [propertyId, property] of Object.entries(properties)) {
                    const input = document.getElementById(`flForm-${ propertyId }`)
                    if (property.type === "date") {
                        const val = input.value
                        row[propertyId] = val ? val.substring(6, 10) + "-" + val.substring(3, 5) + "-" + val.substring(0, 2) : ""
                    } else if (property.type === "duration") {
                        const val = input.value
                        if (val) {
                            const [hours, minutes] = val.split(":").map(Number)
                            row[propertyId] = hours * 60 + minutes
                        }
                    } else {
                        row[propertyId] = input.value
                    }
                }

                // Submit the form
                const body = post.body
                body.rows = [row]
                const response = await fetch(`/${ post.controller }/${ post.action }/${ post.entity }`, {
                    method: post.method,
                    headers: new Headers({"content-type": "application/json"}),
                    body: JSON.stringify(body),
                })

                // Handle response
                if (response.status == 200) {
                    const toast = new Toast({ controller: this.controller }, {
                        title: translations["success"],
                        message: translations["requestRegistered"],
                        type: "success" })
                    toast.trigger()
                    this.onSuccess && this.onSuccess()
                } else {
                    const toast = new Toast({ controller: this.controller }, {
                        title: translations["error"],
                        message: translations["technicalError"],
                        type: "danger",
                        persistent: true })
                    toast.trigger()
                }
            }
        }

        // Track changes to warn user if he tries to leave the page with unsaved changes
        let isDirty = false
        const enableButton = () => {
            isDirty = true
            // backButton?.setAttribute("disabled", "true")
            cancelButton.removeAttribute("disabled")
            submitButton.removeAttribute("disabled")
        }
        form?.addEventListener("input", () => { enableButton() })
        form?.addEventListener("change", () => { enableButton() })
        form?.addEventListener("valueChanged.mdb.datepicker", () => { enableButton() })
        form?.addEventListener("valueChanged.mdb.timepicker", () => { enableButton() })
        form?.addEventListener("itemSelect.mdb.autocomplete", () => { enableButton() })

        document.querySelectorAll(".form-outline").forEach(el => {
            if (el.classList.contains("fl-date-outline")) {
                el.addEventListener("open.mdb.datepicker", (e) => {
                    isDirty = true
                    // backButton?.setAttribute("disabled", "true")
                    cancelButton.removeAttribute("disabled")
                    submitButton.removeAttribute("disabled")
                })
            }
        })

        // Cancel button click handler
        if (cancelButton) cancelButton.onclick = () => {
            if (isDirty) {
                const confirmed = window.confirm(
                    this.translations["You have unsaved changes. Do you want to discard them?"]
                )
                if (!confirmed) {return}
            }
            document.getElementById("flScreen2Content").innerHTML = this.render()
            this.trigger()
            // backButton?.removeAttribute("disabled")
            cancelButton.setAttribute("disabled", "true")
            submitButton.setAttribute("disabled", "true")
        }
    }
}
