import View from "../View.js"

export default class SearchTag extends View
{
    constructor({ controller, name })
    {
        super({ controller })
        this.name = name
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div
                class="chip chip-outline btn-outline-primary"
                id="flSearchTag-${ this.name }"
                data-fl-checked="false"
                data-mdb-chip-init
                data-mdb-ripple-color="dark"
            >
                #${ this.name }
            </div>`)

        return html.join("\n")
    }
}
