import View from "../View.js"

export default class AddTag extends View
{
    constructor({ controller, name, layout })
    {
        super({ controller })
        this.name = name
        this.layout = layout
    }

    render = () =>
    {
        const html = []

        html.push(`
            <div
                class="chip chip-outline btn-outline-primary"
                id="flAddTag-${ this.name }-${ this.layout.screenIndex }"
                data-fl-checked="false"
                data-mdb-chip-init
                data-mdb-ripple-color="dark"
            >
                ${ this.name }
            </div>`)

        return html.join("\n")
    }
}
