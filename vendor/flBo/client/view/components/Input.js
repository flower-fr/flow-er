import { View } from './View.js'

class Input extends View
{
    constructor({ id, property, value = "", label = "", required = false, disabled = false, max_length = 255 }) 
    {
        super({ id, views: [] })
        this.property = property
        this.value = value
        this.label = label
        this.required = required
        this.disabled = disabled
        this.max_length = max_length
    }

    render = (html) => 
    {
        html.push(`
            <div class="col-md-6 mb-3">
                <div class="form-outline" data-mdb-input-init id="flInputOutline-${ this.property }">
                    <input 
                        id="${this.id}"
                        class="form-control form-control-sm fl-modal-form-input"
                        name="flInput-${ this.property }"
                        value="${ this.value }"
                        ${(this.required) ? "required" : ""}
                        maxlength="${ this.max_length }"
                    />
                    <label class="form-label select-label">${(this.required) ? "* " : ""}${ this.label }</label>
                </div>
            </div>`)

        return html
    }

    style = () => {
        const formOutline = document.querySelector(`#flInputOutline-${ this.property }`)
        new mdb.Input(formOutline, {
            showcounter: true
        })
    }
}

export { Input }