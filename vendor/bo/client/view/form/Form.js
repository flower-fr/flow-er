import View from "../View.js"

export default class Form extends View
{
    constructor({ controller, entity, view })
    {
        super({ controller })
        this.id = Date.now()
        this.entity = entity
        this.view = view
    }

    initialize = async () => {
        const response = await fetch(`/bo/form/${ this.entity }/${ this.view }`)
        const { properties, posts, translations } = await response.json()
        this.properties = properties
        this.posts = posts
        this.translations = translations
        this.data = { id: 0 }
    }

    render = () => 
    {
        const data = this.data

        const html = []

        html.push(`
        <div class="my-3 mt-5">
            <div class="row" id="flFormMessage"></div>
            <form class="row g-4" id="${ this.id }">`)

        // Consistency

        if (data.touched_at) {
            html.push(`<input type="hidden" id="${ this.id }-touched_at" value="${ data.touched_at }" />`)
        }

        for (const [propertyId, property] of Object.entries(this.properties)) {
            const label = property.label
            const propertyType = property.type
            const disabled = property.disabled
            const required = property.required
        
            let value = data[propertyId] || ""
            if (property.type === "percentage" && value) value = parseFloat(value * 100)
            else if (property.value && !Array.isArray(property.value)) {
                value = property.value
                if (value === "?id") value = data.id
                else if (value.substring(0, 5) === "today") {
                    if (value && value.charAt(5) === "+") value = moment().add(value.substring(6), "days").format("YYYY-MM-DD")
                    else if (value && value.charAt(5) === "-") value = moment().subtract(value.substring(6), "days").format("YYYY-MM-DD")
                    else if (property.type == "datetime") value = moment().format("YYYY-MM-DD HH:mm:ss")    
                    else value = moment().format("YYYY-MM-DD")
                }
            }

            // Title

            if (property.type === "title") {
                html.push(`<hr><h6 class="text-center mb-3">${ label }</h6>`)
            }

            else if (property.type === "hidden") {
                html.push(`<input type="hidden" class="fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="input" value="${ value }" />`)
            }

            // Input

            else if (property.type === "input")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="input" value="${ value }"  data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 255 }" />
                        <label class="form-label">${ label }</label>
                    </div>
                </div>`
                )
            }

            // Password

            else if (property.type === "password")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <input type="password" class="form-control form-control-sm is-valid fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="input" data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 255 }" />
                        <label class="form-label">${ label }</label>
                    </div>
                </div>`
                )
            }

            // Email

            else if (property.type === "email")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <input type="email" class="form-control form-control-sm is-valid fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="email" value="${ value }"  data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 255 }" />
                        <label class="form-label">${ label }</label>
                    </div>
                </div>`
                )
            }

            // Phone

            else if (property.type === "phone")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm is-valid fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="phone" value="${ value }"  data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 255 }" />
                        <label class="form-label">${ label }</label>
                    </div>
                </div>`
                )              
            }
    
            // Date or datetime

            else if (["date", "datetime"].includes(property.type))
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-date-outline" data-mdb-datepicker-init>
                        <input class="form-control form-control-sm fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="date" value="${ value ? moment(value).format("DD/MM/YYYY") : "" }"  data-fl-disabled="${ disabled }" ${ required } placeholder="${ this.translations["DD/MM/YYYY"] }" />
                        <label class="form-label">${ label }</label>
                    </div>
                </div>`
                )
            }

            // Birth year

            else if (propertyType === "birth_year")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline">
                        <select class="form-control form-control-sm fl-modal-form-select" id="${ this.id }-${ propertyId }" data-fl-type="birthYear" data-fl-disabled="${ disabled }" ${ required }>
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
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-time-outline" data-mdb-timepicker-init data-mdb-input-init>
                        <input class="form-control form-control-sm fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="time" value="${ value }" data-fl-disabled="${ disabled }" ${ required } />
                        <label class="form-label">${ label }</label>
                    </div>
                </div>`
                )
            }

            // Number

            else if (propertyType == "number")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline">
                        <input type="numeric" class="form-control form-control-sm fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="number" value="${ value }" data-fl-disabled="${ disabled }" ${ required } pattern="[0-9]+(\.[0-9]{0,4})?" placeholder="12345,67" />
                        <label class="form-label">${label}</label>
                    </div>
                </div>`
                )
            }

            // Percentage

            else if (propertyType == "percentage")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline">
                        <input type="numeric" class="form-control form-control-sm fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="percentage" value="${ value }" data-fl-disabled="${ disabled }" ${ required } pattern="[0-9]+(\.[0-9]{0,4})?" />
                        <label class="form-label">${ label }</label>
                    </div>
                </div>`
                )
            }

            // Textarea

            else if (propertyType == "textarea")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline">
                        <textarea class="form-control form-control-sm fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="textarea" rows="5" data-fl-disabled="${ disabled }" ${ required } maxlength="${ property.max_length ? property.max_length : 2047 }">${ value }</textarea>
                        <label class="form-label">${ label }</label>
                    </div>
                </div>`
                )
            }

            // Select

            else if (propertyType == "select")
            {
                const multiple = property.multiple

                let values
                if (value) {
                    if (Number.isInteger(value)) values = [value]
                    else values = value.split(",") 
                }
                else values = []

                html.push(`
                <div class="col-md-6">
                    <div class="form-outline">
                        <select class="form-select form-select-sm fl-modal-form-select" id="${ this.id }-${ propertyId }" data-fl-type="select" data-mdb-select-init ${ (required) ? "data-mdb-validation=\"true\" data-mdb-invalid-feedback=\" \" data-mdb-valid-feedback=\" \"" : "" } ${( multiple ) ? "multiple" : ""}  data-fl-disabled="${ disabled }" ${ required }>
                            <option />`
                )

                for (let [modalityId, modality] of Object.entries(property.modalities)) {
                    if (values[modalityId] || !modality.archive) {
                        html.push(`<option value="${modalityId}" ${(value == modalityId) ? "selected" : ""} ${ modality.archive ? "disabled" : "" }>${ modality.label }</option>`)
                    }
                }

                html.push(`
                        </select>
                        <label class="form-label select-label">${ label }</label>
                    </div>
                </div>`
                )
            }

            // File

            else if (propertyType == "file")
            {
                html.push(`
                <div class="col-md-6">
                    <div>
                        <label class="form-label" for="customFile">${ label }</label>
                        <input type="file" class="form-control form-control-sm fl-modal-form-file" id="${ this.id }-${ propertyId }" data-fl-type="file" data-fl-disabled="${ disabled }" ${ required } />
                    </div>
                </div>`
                )
            }

            // Log

            else if (propertyType == "log")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline mb-2">
                        <textarea class="form-control form-control-sm fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="textarea" ${(required) ? "required" : ""} maxlength="${(property.max_length) ? property.max_length : 65535}"></textarea>
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
                    </tr>`)
                }

                html.push("</tbody></table></div>")
            }

            else
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline">
                        <input class="form-control form-control-sm fl-modal-form-input" id="${ this.id }-${ propertyId }" data-fl-type="input" value="${ value }"  data-fl-disabled="${ disabled }" ${( required ) ? "required" : ""} maxlength="${ property.max_length ? property.max_length : 255 }" />
                        <label class="form-label select-label">${ label }</label>
                    </div>
                </div>`
                )
            }
        }

        html.push(`
                <div class="form-group row submitDiv">`)

        for (const [postId, post] of Object.entries(this.posts)) {
            if (!post.condition && data.id == 0 || post.condition == "id" && data.id != 0) {
                const where = []
                for (const [key, value] of Object.entries((data.where) ? data.where : {})) {
                    where.push(`${key}:${ Array.isArray(value) ? value.join(",") : value }`)
                }
                html.push(`
                    <div class="col-md-3 fl-submit-div">
                        <input type="hidden" id="flDetailTabSubmitRefresh-${postId}" data-fl-route="/${ post.controller }/${ post.action }/${ post.entity }/${ data.id }?${ (post.view) ? `&view=${post.view}` : "" }&where=${ where.join("|") }&order=-touched_at" />
                        <button 
                            name="${ this.id }-${postId}" 
                            class="btn ${ (post.danger) ? "btn-outline-primary" : "btn-warning" } fl-detail-tab-submit"
                            ${ (post.danger) ? "data-fl-danger=\"danger\"" : "" }
                            ${ (post.method) ? `data-fl-method=${post.method}`: "" }
                            data-fl-controller=${post.controller}
                            data-fl-action=${post.action}
                            data-fl-entity=${post.entity}
                            ${ (post.id) ? `data-fl-id=${ data[post.id] }`: "" }
                            data-fl-transaction=${postId}
                            ${ (post.steps) ? `data-fl-steps=${ JSON.stringify(post.steps) }`: "" }
                            ${ (post.view) ? `data-fl-view=${post.view}` : "" }
                            ${ (post.glyph) ? `title=${  post.label }` : "" }>${ (post.glyph) ? `<i class="fas ${ post.glyph }"></i>` : post.label }
                        </button>
                    </div>`)
            }
        }

        html.push(`
                </div>
            </form>
        </div>`)

        return html.join("\n")
    }

    trigger = () =>
    {
        // ${ (property.autocomplete)
        // property.values.join(",")
        const properties = this.properties, posts = this.posts, form = document.getElementById(this.id)
        if (form) {
            form.onsubmit = async function (event)
            {
                event.preventDefault()
                form.checkValidity()
                const body = { touched_at: document.getElementById(`${ this.id }-touched_at`)?.value }
                for (const propertyId in properties) {
                    const input = document.getElementById(`${ this.id }-${ propertyId }`)
                    body[propertyId] = input.value
                }

                const submit = event.submitter, postId = submit.name.split("-")[1], post = posts[postId]
                const response = await fetch(`/${ post.controller }/${ post.action }/${ post.entity }${ this.view ? `/${ this.view }` : "" }`, {
                    method: post.method,
                    body,
                })
                console.log(response)
            }
        }
    }
}
