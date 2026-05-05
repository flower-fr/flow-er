import View from "../View.js"

import Form from "../form/Form.js"

export default class Card extends View
{
    constructor({ controller, entity, id, view })
    {
        super({ controller })
        this.entity = entity
        this.id = id
        this.view = view
    }

    initialize = async () =>
    {
        let response = await fetch(`/bo/card/${ this.entity }?view=${ this.view }`)
        const { properties, translations } = await response.json()
        this.properties = properties
        this.translations = translations

        // Retrieve the data
        const columns = Object.keys(properties).join(",")
        response = await fetch(`/core/v1/${ this.entity }/${ this.id }?columns=${ columns }`)
        this.data = (await response.json()).rows[0]
    }

    render = () => 
    {
        const data = this.data

        const html = []

        html.push(`
        <div class="my-3 mt-5">
            <form class="row g-4">`)

        for (const [propertyId, property] of Object.entries(this.properties)) {
            const label = property.label
            const propertyType = property.type
        
            let value = data[propertyId] || ""
            if (property.type === "percentage" && value) value = parseFloat(value * 100)
            else if (property.value && !Array.isArray(property.value)) {
                value = property.value
                if (value.substring(0, 5) === "today") {
                    value = moment().format("YYYY-MM-DD")
                }
            }

            if (!value) continue

            // Input

            if (property.type === "input")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm" id="${ this.id }-${ propertyId }" value="${ value }"  disabled />
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
                        <input type="password" class="form-control form-control-sm" id="${ this.id }-${ propertyId }" value="${ value }" disabled />
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
                        <input type="email" class="form-control form-control-sm" data-fl-property="${ propertyId }" value="${ value }" disabled />
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
                        <input class="form-control form-control-sm" id="${ this.id }-${ propertyId }" value="${ value }" disabled />
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
                    <div class="form-outline fl-date-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm" id="${ this.id }-${ propertyId }" value="${ value ? moment(value).format("DD/MM/YYYY") : "" }"  disabled />
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
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <select class="form-control form-control-sm" id="${ this.id }-${ propertyId }" disabled>
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
                    <div class="form-outline fl-time-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm" id="${ this.id }-${ propertyId }" value="${ value }" disabled />
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
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <input type="number" class="form-control form-control-sm" id="${ this.id }-${ propertyId }" value="${ value }" disabled />
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
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <input type="number" class="form-control form-control-sm" id="${ this.id }-${ propertyId }" value="${ value }" disabled />
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
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <textarea class="form-control form-control-sm" id="${ this.id }-${ propertyId }" rows="5" disabled>${ value }</textarea>
                        <label class="form-label" for="${ this.id }-${ propertyId }">${ label }</label>
                    </div>
                </div>`
                )
            }

            // Select

            else if (propertyType == "select")
            {
                let values
                if (value) {
                    if (Number.isInteger(value)) values = [value]
                    else values = value.split(",") 
                }
                else values = []
                values = values.map(v => property.modalities[v].label)

                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm" id="${ this.id }-${ propertyId }" value="${ values.join(",") }" disabled />
                        <label class="form-label" for="${ this.id }-${ propertyId }">${ label }</label>
                    </div>
                </div>`)
            }

            // Log

            else if (propertyType == "log")
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline mb-2">
                        <textarea class="form-control form-control-sm" id="${ this.id }-${ propertyId }" disabled></textarea>
                        <label class="form-label">${ label }</label>
                    </div>
                </div>
                <div class="fl-modal-log">
                    <table class="table table-sm table-hover table-responsive">
                        <thead class="datatable-header" />
                        <tbody class=""table-group-divider">`)

                for (const modality of property.modalities) {
                    html.push(`
                    <tr>
                        <td><strong>${ moment(modality.touched_at).format("DD/MM/YYYY HH:mm:ss") }</strong></td>
                        <td><strong>${ modality.owner_n_fn.trim() !== "" ? `(${ modality.owner_n_fn })` : `(${ modality.chanel })` }</strong></td>
                        <td>${ modality.summary.split("\n").join("<br>") }</td>
                    </tr>`)
                }

                html.push("</tbody></table></div>")
            }

            else
            {
                html.push(`
                <div class="col-md-6">
                    <div class="form-outline fl-form-outline" data-mdb-input-init>
                        <input class="form-control form-control-sm" id="${ this.id }-${ propertyId }" value="${ value }" disabled />
                        <label class="form-label select-label">${ label }</label>
                    </div>
                </div>`
                )
            }
        }
    
        html.push(`
                <div class="col-md-12 mb-4">
                    <button type="button" class="btn btn-sm btn-outline-primary index-btn fl-update-button" id="flCardUpdateButton" title="${ this.translations["Update"] }">
                        <i class="fas fa-pen"></i>
                    </button>
                </div>`)

        html.push(`
            </form>
        </div>`)

        return html.join("\n")
    }

    getForm = () =>
    {
        const { controller, entity, id, view } = this
        this.controller.stack(new Form({ controller, entity, view, id }), this.translations["Modify"])
    }

    trigger = () =>
    {
        document.querySelectorAll(".form-outline").forEach(el => {
            new mdb.Input(el)
        })

        $("#flCardUpdateButton").click(this.getForm)

        $("#flCardCloseButton").hide()
    }
}
